import type React from "react";
import { Card } from "~/components/ui/card";
import { BarChart2, CarFront, UserPlus, Package } from "lucide-react";
import { cn } from "~/lib/utils";
import { SparkLineChart } from "~/components/dashboard/sparkline-chart";

interface DashboardStatsProps {
  salesTotal: string;
  salesChange: string;
  vehiclesSold: string;
  vehiclesChange: string;
  clientsNew: string;
  clientsChange: string;
  vehiclesInventory: string;
  inventoryChange: string;
  period: string;
}

export function DashboardStats({
  salesTotal,
  salesChange,
  vehiclesSold,
  vehiclesChange,
  clientsNew,
  clientsChange,
  vehiclesInventory,
  inventoryChange,
  period,
}: DashboardStatsProps) {
  // Generate different sparkline data based on the period
  const getSparklineData = (type: string) => {
    // Base patterns for different metrics
    const patterns = {
      sales: [
        25, 36, 30, 45, 39, 28, 32, 36, 42, 45, 48, 52, 53, 41, 55, 60, 52, 53,
        59, 68,
      ],
      vehicles: [
        15, 20, 18, 25, 22, 18, 20, 24, 25, 22, 28, 30, 28, 27, 32, 30, 26, 28,
        30, 34,
      ],
      clients: [
        10, 12, 14, 16, 14, 12, 15, 17, 19, 18, 20, 22, 21, 23, 25, 24, 26, 25,
        27, 28,
      ],
      inventory: [
        50, 48, 45, 43, 42, 45, 47, 44, 42, 40, 38, 40, 42, 45, 42, 40, 42, 41,
        40, 42,
      ],
    };

    // Adjust data length based on period
    const data = [...patterns[type as keyof typeof patterns]];

    switch (period) {
      case "today":
        return data.slice(-5);
      case "7days":
        return data.slice(-7);
      case "30days":
        return data.slice(-12);
      case "3months":
        return data;
      case "6months":
        return [...data, ...data.slice(0, 5)];
      case "12months":
        return [...data, ...data];
      default:
        return data;
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Ventas Totales"
        value={salesTotal}
        change={salesChange}
        trend={salesChange.startsWith("+") ? "up" : "down"}
        icon={BarChart2}
        color="text-emerald-500"
        sparklineData={getSparklineData("sales")}
      />
      <StatCard
        title="Vehículos Vendidos"
        value={vehiclesSold}
        change={vehiclesChange}
        trend={vehiclesChange.startsWith("+") ? "up" : "down"}
        icon={CarFront}
        color="text-emerald-500"
        sparklineData={getSparklineData("vehicles")}
      />
      <StatCard
        title="Clientes Nuevos"
        value={clientsNew}
        change={clientsChange}
        trend={clientsChange.startsWith("+") ? "up" : "down"}
        icon={UserPlus}
        color="text-emerald-500"
        sparklineData={getSparklineData("clients")}
      />
      <StatCard
        title="Vehículos en Inventario"
        value={vehiclesInventory}
        change={inventoryChange}
        trend={inventoryChange.startsWith("+") ? "up" : "down"}
        icon={Package}
        color={
          inventoryChange.startsWith("+") ? "text-emerald-500" : "text-rose-500"
        }
        sparklineData={getSparklineData("inventory")}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ElementType;
  color: string;
  sparklineData: number[];
}

function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
  sparklineData,
}: StatCardProps) {
  return (
    <Card className="overflow-hidden p-6 relative">
      <div className="flex flex-col space-y-1">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className={cn("rounded-full p-1.5", "bg-muted/80")}>
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>

        <div className="mt-2">
          <span className="text-2xl font-bold">{value}</span>
        </div>

        <div className="flex items-center">
          <span
            className={cn(
              "text-sm font-medium",
              trend === "up"
                ? "text-emerald-500"
                : trend === "down"
                  ? "text-rose-500"
                  : "text-muted-foreground"
            )}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : ""} {change}
          </span>
          <span className="text-sm text-muted-foreground ml-1">
            vs periodo anterior
          </span>
        </div>

        <div className="h-[60px] w-full mt-2">
          <SparkLineChart data={sparklineData} trend={trend} />
        </div>
      </div>
    </Card>
  );
}
