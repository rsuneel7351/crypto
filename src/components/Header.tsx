import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Moon, Sun, Star } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { searchCryptocurrencies } from "@/services/cryptoApi";
import { Cryptocurrency } from "@/types/crypto";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Cryptocurrency[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        const results = await searchCryptocurrencies(searchQuery);
        setSearchResults(results);
        setShowResults(true);
      } catch (error) {
        console.error("Error searching cryptocurrencies:", error);
        toast({
          title: "Error",
          description: "Failed to search cryptocurrencies. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSearching(false);
      }
    }, 500);
  }, [searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleResultClick = (crypto: Cryptocurrency) => {
    setSearchQuery("");
    setShowResults(false);
    navigate(`/crypto/${crypto.id}`);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">CryptoWatch</span>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="relative w-full max-w-sm" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cryptocurrencies..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => searchQuery.length >= 3 && setShowResults(true)}
              />
            </div>

            {showResults && searchResults.length > 0 && (
              <Card className="absolute left-0 right-0 top-full mt-1 max-h-[300px] overflow-y-auto">
                <div className="p-2">
                  {searchResults.map((crypto) => (
                    <div
                      key={crypto.id}
                      className="flex cursor-pointer items-center space-x-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                      onClick={() => handleResultClick(crypto)}
                    >
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="h-6 w-6 rounded-full"
                      />
                      <span className="font-medium">{crypto.name}</span>
                      <span className="text-muted-foreground">
                        {crypto.symbol.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {showResults && searchQuery.length >= 3 && searchResults.length === 0 && !isSearching && (
              <Card className="absolute left-0 right-0 top-full mt-1 p-4">
                <p className="text-sm text-muted-foreground">No cryptocurrencies found</p>
              </Card>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => navigate('/favorites')}
            className="ml-2 flex items-center gap-2 w-auto bg-crypto-card border border-crypto-accent/30 hover:bg-crypto-accent/10 hover:border-crypto-accent transition-colors duration-300"
          >
            <Star className="h-4 w-4" />
            Favorites
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="ml-2"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
