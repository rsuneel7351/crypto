import React from "react";
import { HistoricalData, TimeRange } from "@/types/crypto";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPrice } from "@/utils/formatters";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PriceChartProps {
  data?: HistoricalData;
  isLoading: boolean;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  color?: string;
}

const PriceChart: React.FC<PriceChartProps> = ({
  data,
  isLoading,
  timeRange,
  onTimeRangeChange,
  color = "#6E56CF",
}) => {
  console.log(data, "data")

  if (isLoading) {
    return (
      <Card className="bg-crypto-card p-4 rounded-xl h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-slow w-8 h-8 mx-auto mb-4 rounded-full bg-gray-500"></div>
          <p className="text-muted-foreground">Loading chart data...</p>
        </div>
      </Card>
    );
  }

  if (!data || !data.prices || data.prices.length === 0) {
    console.log("No chart data available:", { data });
    return (
      <Card className="bg-crypto-card p-4 rounded-xl h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">No chart data available</p>
      </Card>
    );
  }

  const chartData = data.prices.map(([timestamp, price]) => ({
    timestamp,
    date: new Date(timestamp),
    price: Number(price),
  }));

  chartData.sort((a, b) => a.timestamp - b.timestamp);

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);

    if (timeRange === "1d") {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    if (timeRange === "7d") {
      return date.toLocaleDateString([], { weekday: "short" });
    }

    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const formatTooltipDate = (timestamp: number) => {
    const date = new Date(timestamp);

    if (timeRange === "1d") {
      return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-crypto-bg p-3 border border-gray-700 rounded shadow-lg">
          <p className="text-muted-foreground text-sm">
            {formatTooltipDate(payload[0].payload.timestamp)}
          </p>
          <p className="font-bold">{formatPrice(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-crypto-card p-4 rounded-xl w-full">
      <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
        {(["1d", "7d", "30d", "90d", "1y", "max"] as TimeRange[]).map(
          (range) => (
            <Button
              key={range}
              variant={timeRange === range ? "secondary" : "outline"}
              className={`sm:text-sm px-3 py-1 text-sm ${timeRange === range ? "bg-crypto-accent text-white" : ""
                }`}
              onClick={() => onTimeRangeChange(range)}
            >
              {range}
            </Button>
          )
        )}
      </div>
      <div className="h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D2A39" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              stroke="#666"
              tick={{ fill: "#999", fontSize: 12 }}
              axisLine={{ stroke: "#333" }}
            />
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={(value) => formatPrice(value)}
              stroke="#666"
              tick={{ fill: "#999", fontSize: 12 }}
              axisLine={{ stroke: "#333" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              dot={false}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PriceChart;
