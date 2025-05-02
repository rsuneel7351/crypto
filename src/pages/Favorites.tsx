import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoCard from "@/components/CryptoCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import { Cryptocurrency } from "@/types/crypto";
import { fetchFavoriteCryptocurrencies } from "@/services/cryptoApi";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";

const Favorites = () => {
  const [favoritesCrypto, setFavoritesCrypto] = useState<Cryptocurrency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadFavoriteCryptocurrencies = async () => {
    if (favorites.length === 0) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const favoritesCryptos = await fetchFavoriteCryptocurrencies(favorites);
      setFavoritesCrypto(favoritesCryptos);
    } catch (error) {
      toast({
        title: "Failed to load favorites",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavoriteCryptocurrencies();
    
    // Set up an interval to refresh data every 60 seconds
    const intervalId = setInterval(() => {
      loadFavoriteCryptocurrencies();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [favorites]);

  const handleCryptoClick = (id: string) => {
    navigate(`/crypto/${id}`);
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
    // If we're removing from favorites, update the list immediately
    if (isFavorite(id)) {
      setFavoritesCrypto((prevCryptos) =>
        prevCryptos.filter((crypto) => crypto.id !== id)
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Favorites</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: favorites.length || 4 }).map((_, index) => (
            <SkeletonLoader key={index} className="h-32" />
          ))}
        </div>
      ) : favoritesCrypto.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favoritesCrypto.map((crypto) => (
            <CryptoCard
              key={crypto.id}
              crypto={crypto}
              isFavorite={true}
              onToggleFavorite={handleToggleFavorite}
              onClick={() => handleCryptoClick(crypto.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-crypto-card p-8 rounded-xl text-center">
          <p className="text-lg mb-4">You haven't added any cryptocurrencies to favorites yet.</p>
          <button
            className="text-crypto-accent hover:underline"
            onClick={() => navigate("/")}
          >
            Browse cryptocurrencies
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
