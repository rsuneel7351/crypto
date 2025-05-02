
import { useState, useEffect } from "react";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("cryptoFavorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cryptoFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (cryptoId: string) => {
    setFavorites((prevFavorites) => {
      if (!prevFavorites.includes(cryptoId)) {
        return [...prevFavorites, cryptoId];
      }
      return prevFavorites;
    });
  };

  const removeFavorite = (cryptoId: string) => {
    setFavorites((prevFavorites) => 
      prevFavorites.filter((id) => id !== cryptoId)
    );
  };

  const isFavorite = (cryptoId: string) => {
    return favorites.includes(cryptoId);
  };

  const toggleFavorite = (cryptoId: string) => {
    if (isFavorite(cryptoId)) {
      removeFavorite(cryptoId);
    } else {
      addFavorite(cryptoId);
    }
  };

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
};
