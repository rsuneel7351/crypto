import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cryptocurrency } from "@/types/crypto";
import { fetchCryptocurrencies } from "@/services/cryptoApi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import CryptoCard from "@/components/CryptoCard";
import { useFavorites } from "@/hooks/useFavorites";

const ITEMS_PER_PAGE = 20;

const Index: React.FC = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"market_cap" | "current_price" | "total_volume">("market_cap");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadCryptocurrencies();
  }, [currentPage]);

  const loadCryptocurrencies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchCryptocurrencies(currentPage, ITEMS_PER_PAGE);
      setCryptocurrencies(data);
      setTotalPages(Math.ceil(1000 / ITEMS_PER_PAGE)); // Assuming 1000 is the total number of coins
    } catch (error) {
      console.error("Error loading cryptocurrencies:", error);
      setError("Failed to load cryptocurrencies. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load cryptocurrencies. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("_");
    setSortBy(field as "market_cap" | "current_price" | "total_volume");
    setSortOrder(order as "asc" | "desc");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredCryptocurrencies = cryptocurrencies.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCryptocurrencies = [...filteredCryptocurrencies].sort((a, b) => {
    const aValue = a[sortBy] || 0;
    const bValue = b[sortBy] || 0;
    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });
  const handleCryptoClick = (id: string) => {
    navigate(`/crypto/${id}`);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Cryptocurrency Market</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full md:w-64"
          />
          {/* <Select
            value={`${sortBy}_${sortOrder}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market_cap_desc">Market Cap (High to Low)</SelectItem>
              <SelectItem value="market_cap_asc">Market Cap (Low to High)</SelectItem>
              <SelectItem value="current_price_desc">Price (High to Low)</SelectItem>
              <SelectItem value="current_price_asc">Price (Low to High)</SelectItem>
              <SelectItem value="total_volume_desc">Volume (High to Low)</SelectItem>
              <SelectItem value="total_volume_asc">Volume (Low to High)</SelectItem>
            </SelectContent>
          </Select> */}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <Card key={index} className="bg-crypto-card border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))
          : sortedCryptocurrencies.map((crypto) => (
            // <Card
            //   key={crypto.id}
            //   className="bg-crypto-card rounded-xl hover:border-crypto-accent/50 hover:shadow-lg hover:shadow-crypto-accent/10 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer group backdrop-blur-sm"
            //   onClick={() => navigate(`/crypto/${crypto.id}`)}
            // >
            //   <CardHeader className="pb-2">
            //     <div className="flex items-center justify-between">
            //       <CardTitle className="text-lg group-hover:text-crypto-accent transition-colors duration-300">
            //         <div className="flex items-center gap-2">
            //           <img
            //             src={crypto.image}
            //             alt={`${crypto.name} logo`}
            //             className="w-8 h-8 group-hover:scale-110 transition-transform duration-300"
            //           />  <span>{crypto.name} ({crypto.symbol.toUpperCase()})</span>
            //         </div>
            //       </CardTitle>

            //       <Star
            //         className={`cursor-pointer transition-colors ${favorites.includes(crypto.id) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
            //         onClick={(e) => handleFavoriteClick(e, crypto.id)}
            //         size={20}
            //       />
            //     </div>
            //   </CardHeader>
            //   <CardContent>
            //     <div className="space-y-2">
            //       <p className="text-2xl font-bold group-hover:text-crypto-accent transition-colors duration-300">
            //         ${crypto.current_price.toLocaleString()}
            //       </p>
            //       <p className="text-sm text-muted-foreground">
            //         Market Cap: ${crypto.market_cap.toLocaleString()}
            //       </p>
            //       <p
            //         className={`text-sm font-medium ${crypto.price_change_percentage_24h >= 0
            //           ? "text-green-500"
            //           : "text-red-500"
            //           }`}
            //       >
            //         {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
            //         {crypto.price_change_percentage_24h.toFixed(2)}% (24h)
            //       </p>
            //     </div>
            //   </CardContent>
            // </Card>
            <CryptoCard
              key={crypto.id}
              crypto={crypto}
              isFavorite={isFavorite(crypto.id)}
              onToggleFavorite={toggleFavorite}
              onClick={() => handleCryptoClick(crypto.id)}
            />
          ))}
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
            )
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="px-2">...</span>
                )}
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              </React.Fragment>
            ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
