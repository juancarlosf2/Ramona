import { useTheme } from "next-themes";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

interface SparkLineChartProps {
  data: number[];
  trend: "up" | "down" | "neutral";
}

export function SparkLineChart({ data, trend }: SparkLineChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Format data for the chart
  const chartData = data.map((value, index) => ({ value }));

  // Wait for component to mount to avoid hydration issues with theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Determine line color based on trend and theme
  const getLineColor = () => {
    if (trend === "up") return "#10b981"; // Green for positive trends
    if (trend === "down") return "#ef4444"; // Red for negative trends
    return theme === "dark" ? "#94a3b8" : "#64748b"; // Neutral color
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <defs>
          <filter id="shadow" x="-2" y="-2" width="110%" height="110%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2" />
          </filter>
        </defs>
        <Line
          type="monotone"
          dataKey="value"
          stroke={getLineColor()}
          strokeWidth={2.5}
          dot={false}
          isAnimationActive={true}
          animationDuration={1500}
          filter="url(#shadow)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
