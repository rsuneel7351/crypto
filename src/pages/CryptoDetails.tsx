import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PriceChart from "@/components/PriceChart";
import SkeletonLoader from "@/components/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, ArrowLeft } from "lucide-react";
import { Cryptocurrency, HistoricalData, TimeRange } from "@/types/crypto";
import { fetchCryptocurrencyDetails, fetchHistoricalData } from "@/services/cryptoApi";
import { useFavorites } from "@/hooks/useFavorites";
import { formatPrice, formatMarketCap, formatPercentage, formatSupply } from "@/utils/formatters";
import { useToast } from "@/hooks/use-toast";
import CoinInfo from "@/components/CoinInfo";

const CryptoDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [crypto, setCrypto] = useState<Cryptocurrency | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadCryptoDetails = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const data = await fetchCryptocurrencyDetails(id);
      setCrypto(data);
    } catch (error) {
      console.error("Error loading crypto details:", error);
      toast({
        title: "Failed to load cryptocurrency details",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistoricalData = async () => {
    if (!id) return;

    try {
      setIsChartLoading(true);
      const data = await fetchHistoricalData(id, timeRange);
      setHistoricalData(data);
    } catch (error) {
      console.error("Error loading historical data:", error);
      toast({
        title: "Failed to load chart data",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsChartLoading(false);
    }
  };

  useEffect(() => {
    loadCryptoDetails();
  }, [id]);

  useEffect(() => {
    loadHistoricalData();
  }, [id, timeRange]);

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  const handleToggleFavorite = () => {
    if (crypto) {
      toggleFavorite(crypto.id);
    }
  };

  if (isLoading || !crypto) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <SkeletonLoader className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <SkeletonLoader className="h-6 w-48" />
            <SkeletonLoader className="h-4 w-24" />
          </div>
        </div>
        <SkeletonLoader className="h-[400px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonLoader className="h-32" />
          <SkeletonLoader className="h-32" />
          <SkeletonLoader className="h-32" />
        </div>
      </div>
    );
  }

  const priceChangeClass = crypto.price_change_percentage_24h >= 0
    ? "text-green-500"
    : "text-red-500";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          variant="outline"
          onClick={handleToggleFavorite}
          className="flex items-center gap-2"
        >
          <Star
            className={`h-4 w-4 ${isFavorite(crypto.id) ? "fill-yellow-400" : ""
              }`}
          />
          {isFavorite(crypto.id) ? "Remove from Favorites" : "Add to Favorites"}
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={crypto.image}
              alt={`${crypto.name} logo`}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </h1>
              <p className="text-muted-foreground">
                Rank #{crypto.market_cap_rank}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold">
                {formatPrice(crypto.current_price)}
              </p>
              <p className={priceChangeClass}>
                {formatPercentage(crypto.price_change_percentage_24h)} (24h)
              </p>
            </div>
          </div>
        </div>
      </div>

      <PriceChart
        data={historicalData}
        isLoading={isChartLoading}
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        color={crypto.price_change_percentage_24h >= 0 ? "#4ade80" : "#f43f5e"}
      />
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-crypto-card p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Market Cap</h3>
          <p className="text-xl font-bold">{formatMarketCap(crypto.market_cap)}</p>
        </Card>

        <Card className="bg-crypto-card p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Circulating Supply</h3>
          <p className="text-xl font-bold">{formatSupply(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}</p>
        </Card>

        <Card className="bg-crypto-card p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Max Supply</h3>
          <p className="text-xl font-bold">
            {crypto.max_supply ? formatSupply(crypto.max_supply) : "∞"} {crypto.symbol.toUpperCase()}
          </p>
        </Card>
      </div>

      <Card className="bg-crypto-card p-6 rounded-xl mt-6">
        <h2 className="text-xl font-bold mb-4">About {crypto.name}</h2>
        <Separator className="mb-4 bg-gray-700" />
        <p className="text-muted-foreground mb-4">
          {crypto.description || `${crypto.name} is a cryptocurrency with the symbol ${crypto.symbol.toUpperCase()}.`}
        </p>

        {crypto.categories && crypto.categories.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {crypto.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-crypto-card text-crypto-text rounded-full text-sm border border-crypto-border"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {crypto.links && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Links</h3>
            <div className="space-y-2">
              {crypto.links.homepage && crypto.links.homepage[0] && (
                <a
                  href={crypto.links.homepage[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-400 hover:text-blue-300"
                >
                  <span>Website</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              {crypto.links.twitter_screen_name && (
                <a
                  href={`https://twitter.com/${crypto.links.twitter_screen_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-400 hover:text-blue-300"
                >
                  <span>Twitter</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              {crypto.links.subreddit_url && (
                <a
                  href={crypto.links.subreddit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-400 hover:text-blue-300"
                >
                  <span>Reddit</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              {crypto.links.repos_url?.github && crypto.links.repos_url.github[0] && (
                <a
                  href={crypto.links.repos_url.github[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-400 hover:text-blue-300"
                >
                  <span>GitHub</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}

        {crypto.last_updated && (
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: {new Date(crypto.last_updated).toLocaleString()}
          </p>
        )}
      </Card>
    </div>
  );
};

export default CryptoDetails;
