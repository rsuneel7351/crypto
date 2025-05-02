import { Button } from "@/components/ui/button";
import { HistoricalData } from "@/types/crypto";
import { Cryptocurrency } from "@/types/crypto";
import { fetchHistoricalData } from "@/services/cryptoApi";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

interface CoinInfoProps {
    coin: any;
    currency: string;
}

export const chartDays = [
    {
        label: "24 Hours",
        value: "1d",
    },
    {
        label: "7 Days",
        value: "7d",
    },
    {
        label: "30 Days",
        value: "30d",
    },
    {
        label: "90 Days",
        value: "90d",
    },
    {
        label: "1 Year",
        value: "1y",
    },
];

const CoinInfo: React.FC<CoinInfoProps> = ({ coin, currency }) => {
    const [historicData, setHistoricData] = useState<HistoricalData | null>(null);
    const [timeRange, setTimeRange] = useState<"1d" | "7d" | "30d" | "90d" | "1y" | "max">("7d");
    const [isLoading, setIsLoading] = useState(false);

    const fetchHistoricData = async () => {
        try {
            setIsLoading(true);
            const data = await fetchHistoricalData(coin.id, timeRange);
            setHistoricData(data);
        } catch (error) {
            console.error("Error fetching historical data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistoricData();
    }, [timeRange, coin.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crypto-accent"></div>
            </div>
        );
    }

    if (!historicData || historicData.prices.length === 0) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <p className="text-muted-foreground">No historical data available</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Line
                data={{
                    labels: historicData.prices.map(([timestamp]) => {
                        const date = new Date(timestamp);
                        if (timeRange === "1d") {
                            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                        }
                        return date.toLocaleDateString();
                    }),
                    datasets: [
                        {
                            data: historicData.prices.map(([, price]) => price),
                            label: `Price (${timeRange}) in ${currency.toUpperCase()}`,
                            borderColor: "#6E56CF",
                            backgroundColor: "rgba(110, 86, 207, 0.1)",
                            fill: true,
                            tension: 0.4,
                        },
                    ],
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false,
                            },
                            ticks: {
                                color: "#666",
                            },
                        },
                        y: {
                            grid: {
                                color: "rgba(255, 255, 255, 0.1)",
                            },
                            ticks: {
                                color: "#666",
                            },
                        },
                    },
                    elements: {
                        point: {
                            radius: 0,
                        },
                    },
                }}
            />
            <div className="flex flex-wrap gap-2 justify-center">
                {chartDays.map((day) => (
                    <Button
                        key={day.value}
                        variant={timeRange === day.value ? "secondary" : "outline"}
                        className={`px-3 py-1 text-sm ${
                            timeRange === day.value ? "bg-crypto-accent text-white" : ""
                        }`}
                        onClick={() => setTimeRange(day.value as any)}
                    >
                        {day.label}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default CoinInfo;