import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left Section - Logo and Search */}
          <div className="flex flex-1 items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/favicon.svg" alt="Logo" className="h-8 w-8" />
              <span className="hidden sm:inline-block text-lg font-semibold">CryptoWatch</span>
            </Link>

            {/* Search Input - Hidden on mobile, visible on tablet and up */}
            <div className="hidden md:block relative flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search cryptocurrencies..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-9"
                />
              </div>
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-1 max-h-[300px] overflow-y-auto rounded-md border bg-background shadow-lg">
                  {isSearching ? (
                    <div className="flex items-center justify-center p-4">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-1">
                      {searchResults.map((crypto) => (
                        <button
                          key={crypto.id}
                          onClick={() => handleResultClick(crypto)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-accent"
                        >
                          <img
                            src={crypto.image}
                            alt={crypto.name}
                            className="h-6 w-6"
                          />
                          <div>
                            <p className="font-medium">{crypto.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {crypto.symbol.toUpperCase()}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Favorites Button */}
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2"
              onClick={() => navigate("/favorites")}
            >
              <Star className="h-4 w-4" />
              <span>Favorites</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="sm:hidden"
              onClick={() => navigate("/favorites")}
            >
              <Star className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="flex items-center justify-center"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search - Shows below header when active */}
        {showMobileSearch && (
          <div className="py-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search cryptocurrencies..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-9"
              />
            </div>
            {showResults && (
              <div className="absolute left-4 right-4 mt-1 max-h-[300px] overflow-y-auto rounded-md border bg-background shadow-lg">
                {isSearching ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-1">
                    {searchResults.map((crypto) => (
                      <button
                        key={crypto.id}
                        onClick={() => handleResultClick(crypto)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-accent"
                      >
                        <img
                          src={crypto.image}
                          alt={crypto.name}
                          className="h-6 w-6"
                        />
                        <div>
                          <p className="font-medium">{crypto.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {crypto.symbol.toUpperCase()}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
