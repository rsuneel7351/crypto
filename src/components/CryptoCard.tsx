
import React from "react";
import { Card } from "@/components/ui/card";
import { Cryptocurrency } from "@/types/crypto";
import { formatPrice, formatPercentage } from "@/utils/formatters";
import { Star } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface CryptoCardProps {
  crypto: Cryptocurrency;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: () => void;
}

const CryptoCard: React.FC<CryptoCardProps> = ({
  crypto,
  isFavorite,
  onToggleFavorite,
  onClick,
}) => {
  const priceChangeClass = crypto.price_change_percentage_24h >= 0
    ? "price-up"
    : "price-down";

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(crypto.id);
  };

  const sparklineData = crypto.sparkline_in_7d?.price?.map((price, index) => ({
    value: price,
  })) || [];

  return (
    <Card
      className="bg-crypto-card hover:bg-crypto-card/80 transition-colors duration-300 p-4 rounded-xl cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <img
            src={crypto.image}
            alt={`${crypto.name} logo`}
            className="w-8 h-8 rounded-full"
          />
          <div className="overflow-hidden">
            <h3 className="font-bold whitespace-nowrap overflow-hidden text-ellipsis">
              {crypto.name}
            </h3>
            <p className="text-muted-foreground text-sm uppercase">
              {crypto.symbol}
            </p>
          </div>
        </div>
        <Star
          className={`cursor-pointer transition-colors ${
            isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
          }`}
          onClick={handleFavoriteClick}
          size={20}
        />
      </div>
      <div className="flex items-end justify-between mt-2">
        <div>
          <p className="font-bold text-lg">{formatPrice(crypto.current_price)}</p>
          <p className={`text-sm ${priceChangeClass}`}>
            {formatPercentage(crypto.price_change_percentage_24h)}
          </p>
        </div>
        {sparklineData.length > 0 && (
          <div className="w-24 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={crypto.price_change_percentage_24h >= 0 ? "#4ade80" : "#f43f5e"}
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CryptoCard;