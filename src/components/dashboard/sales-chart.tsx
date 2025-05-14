import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { useState, useEffect, useRef } from "react";
import { Badge } from "~/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "~/lib/utils";

// Original monthly data
const monthlyData = [
  { name: "Ene", total: 580000 },
  { name: "Feb", total: 690000 },
  { name: "Mar", total: 1100000 },
  { name: "Abr", total: 1200000 },
  { name: "May", total: 1800000 },
  { name: "Jun", total: 1400000 },
  { name: "Jul", total: 1700000 },
  { name: "Ago", total: 1600000 },
  { name: "Sep", total: 1800000 },
  { name: "Oct", total: 2100000 },
  { name: "Nov", total: 1900000 },
  { name: "Dic", total: 2400000 },
];

// Generate daily data for 30 days with different performance scenarios
const generateDailyData = (
  scenario: "positive" | "neutral" | "negative",
  days = 30
) => {
  const result = [];
  let baseValue = 1800000;
  const now = new Date();

  // Set trend based on scenario
  const trendFactor =
    scenario === "positive" ? 1.005 : scenario === "negative" ? 0.995 : 1.0;

  for (let i = 1; i <= days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (days - i));

    // Create some natural-looking variations with overall trend
    const randomFactor = 0.9 + Math.random() * 0.2; // Between 0.9 and 1.1
    baseValue = Math.round(baseValue * trendFactor * randomFactor);

    // Add day name
    const dayName = date
      .toLocaleDateString("es-ES", { weekday: "short" })
      .substring(0, 3);

    result.push({
      name: i.toString(),
      dayName: dayName,
      date: date.toISOString().split("T")[0],
      total: baseValue,
      formattedDate: `${date.toLocaleString("default", { month: "short" })} ${date.getDate()}, ${date.getFullYear()}`,
    });
  }

  return result;
};

// Generate hourly data for today
const generateHourlyData = () => {
  const result = [];
  const now = new Date();
  let baseValue = 80000;

  // Start from 8 AM
  for (let i = 8; i <= now.getHours(); i++) {
    const hour = i < 10 ? `0${i}:00` : `${i}:00`;

    // Random variations
    const randomFactor = 0.8 + Math.random() * 0.4; // Between 0.8 and 1.2
    baseValue = Math.round(baseValue * randomFactor);

    result.push({
      name: hour,
      total: baseValue,
      formattedDate: `Hoy a las ${hour}`,
    });
  }

  return result;
};

// Calculate percentage change between first and last data points
const calculatePercentageChange = (data: any[]) => {
  if (data.length < 2) return 0;
  const firstValue = data[0].total;
  const lastValue = data[data.length - 1].total;
  return ((lastValue - firstValue) / firstValue) * 100;
};

// Determine performance scenario based on percentage change
const determineScenario = (percentageChange: number) => {
  if (percentageChange > 1) return "positive";
  if (percentageChange < -1) return "negative";
  return "neutral";
};

// Get color based on scenario
const getScenarioColor = (scenario: string) => {
  switch (scenario) {
    case "positive":
      return "#10b981"; // green
    case "negative":
      return "#ef4444"; // red
    case "neutral":
      return "#f59e0b"; // orange
    default:
      return "#8884d8"; // purple (default)
  }
};

interface SalesChartProps {
  period?: string;
}

export function SalesChart({ period = "30days" }: SalesChartProps) {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [percentageChange, setPercentageChange] = useState(3.2);
  const [scenario, setScenario] = useState("positive");
  const [summaryMetrics, setSummaryMetrics] = useState({
    topDay: { day: "", value: 0, formattedDate: "" },
    lowestDay: { day: "", value: 0, formattedDate: "" },
    avgPerDay: 0,
  });
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Generate appropriate data based on period
    let data: any[] = [];

    switch (period) {
      case "today":
        data = generateHourlyData();
        break;
      case "7days":
        data = generateDailyData("positive", 7);
        break;
      case "30days":
        data = generateDailyData("positive", 30);
        break;
      case "3months":
        data = generateDailyData("positive", 90);
        break;
      case "6months":
        data = monthlyData.slice(-6);
        break;
      case "12months":
        data = monthlyData;
        break;
      default:
        data = generateDailyData("positive", 30);
    }

    setChartData(data);

    // Calculate percentage change and determine scenario
    const change = calculatePercentageChange(data);
    setPercentageChange(Number.parseFloat(change.toFixed(1)));
    setScenario(determineScenario(change));

    // Calculate summary metrics
    const topDay = data.reduce(
      (max, item) => (max.total > item.total ? max : item),
      data[0]
    );
    const lowestDay = data.reduce(
      (min, item) => (min.total < item.total ? min : item),
      data[0]
    );
    const avgPerDay =
      data.reduce((sum, item) => sum + item.total, 0) / data.length;

    setSummaryMetrics({
      topDay: {
        day: topDay.dayName || topDay.name,
        value: topDay.total,
        formattedDate: topDay.formattedDate || topDay.date,
      },
      lowestDay: {
        day: lowestDay.dayName || lowestDay.name,
        value: lowestDay.total,
        formattedDate: lowestDay.formattedDate || lowestDay.date,
      },
      avgPerDay: avgPerDay,
    });

    // Set initial active index to the last data point
    const timeout = setTimeout(() => {
      setActiveIndex(data.length - 1);

      // Reset after a moment
      setTimeout(() => {
        setActiveIndex(null);
      }, 2000);
    }, 500);

    return () => clearTimeout(timeout);
  }, [period]);

  if (!mounted) return null;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get the current scenario color
  const lineColor = getScenarioColor(scenario);

  // Calculate total sales amount based on period
  const getTotalSales = () => {
    switch (period) {
      case "today":
        return "RD$245,890";
      case "7days":
        return "RD$1,234,567";
      case "30days":
        return "RD$5,678,901";
      case "3months":
        return "RD$15,432,100";
      case "6months":
        return "RD$28,765,432";
      case "12months":
        return "RD$53,412,202";
      default:
        return "RD$5,678,901";
    }
  };

  // Get min and max values for Y axis
  const minValue = Math.min(...chartData.map((item) => item.total)) * 0.9;
  const maxValue = Math.max(...chartData.map((item) => item.total)) * 1.1;

  return (
    <div className="w-full" ref={chartRef}>
      {/* Header section with vertical layout */}
      <div className="flex flex-col mb-4">
        {/* Top: Total and change */}
        <div className="space-y-1">
          <h3 className="text-3xl font-bold tracking-tight">
            {getTotalSales()}
          </h3>
          <div className="flex items-center text-sm">
            <span
              className={`flex items-center ${percentageChange >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {percentageChange >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {Math.abs(percentageChange).toFixed(1)}%
            </span>
            <span className="text-muted-foreground ml-1">
              vs periodo anterior
            </span>
          </div>
        </div>

        {/* Bottom: Summary Metrics - now stacked vertically with 16px spacing */}
        <div className="flex flex-col space-y-2 mt-4">
          <Badge
            variant="outline"
            className={cn(
              "w-fit bg-background/80 backdrop-blur-sm flex items-center gap-1 py-1 px-2",
              "border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400"
            )}
          >
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            <span className="text-xs whitespace-nowrap">
              Top: {summaryMetrics.topDay.day} —{" "}
              {formatCurrency(summaryMetrics.topDay.value)}
            </span>
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "w-fit bg-background/80 backdrop-blur-sm flex items-center gap-1 py-1 px-2",
              "border-rose-200 text-rose-700 dark:border-rose-800 dark:text-rose-400"
            )}
          >
            <TrendingDown className="h-3 w-3 text-rose-500" />
            <span className="text-xs whitespace-nowrap">
              Min: {summaryMetrics.lowestDay.day} —{" "}
              {formatCurrency(summaryMetrics.lowestDay.value)}
            </span>
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "w-fit bg-background/80 backdrop-blur-sm flex items-center gap-1 py-1 px-2",
              "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400"
            )}
          >
            <BarChart2 className="h-3 w-3 text-blue-500" />
            <span className="text-xs whitespace-nowrap">
              Prom: {formatCurrency(summaryMetrics.avgPerDay)}
            </span>
          </Badge>
        </div>
      </div>

      {/* Chart section - full width */}
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            className="animate-in fade-in duration-1000"
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            onMouseMove={(e) => {
              if (e.activeTooltipIndex !== undefined) {
                setActiveIndex(e.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <defs>
              <linearGradient
                id={`colorGradient${scenario}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              horizontal={true}
              stroke="#f0f0f0"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey={period === "7days" ? "dayName" : "name"}
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
              padding={{ left: 10, right: 10 }}
              tick={{ fontSize: 10 }}
              interval={period === "30days" ? 4 : period === "3months" ? 14 : 0}
            />
            <YAxis
              stroke="#888888"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 1000}k`}
              domain={[minValue, maxValue]}
              width={30}
              tickCount={5}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-black text-white rounded-md shadow-lg p-3 animate-in zoom-in-95 duration-100">
                      <div className="text-center">
                        <p className="font-bold">
                          {formatCurrency(data.total)}
                        </p>
                        <p className="text-xs opacity-80">
                          {period === "today"
                            ? data.name
                            : data.formattedDate || data.date}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
              position={{ y: 0 }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke={lineColor}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#colorGradient${scenario})`}
              activeDot={{
                r: 6,
                stroke: "#fff",
                strokeWidth: 2,
                fill: lineColor,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
