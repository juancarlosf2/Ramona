import type React from "react";
import {
  CheckCircle2,
  Wrench,
  Car,
  AlertTriangle,
  Hammer,
  Truck,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { useState } from "react";

interface VehicleStatusGridProps {
  period?: string;
}

export function VehicleStatusGrid({
  period = "30days",
}: VehicleStatusGridProps) {
  // Status data with icons and colors - adjust counts based on period
  const getStatusData = () => {
    // Base data
    const baseData = [
      {
        name: "Disponible",
        icon: CheckCircle2,
        color: "bg-emerald-100 text-emerald-600 border-emerald-200",
        iconColor: "text-emerald-500",
        count: 25,
      },
      {
        name: "En Mantenimiento",
        icon: Wrench,
        color: "bg-amber-100 text-amber-600 border-amber-200",
        iconColor: "text-amber-500",
        count: 4,
      },
      {
        name: "Reservado",
        icon: Car,
        color: "bg-blue-100 text-blue-600 border-blue-200",
        iconColor: "text-blue-500",
        count: 8,
      },
      {
        name: "Dañado",
        icon: AlertTriangle,
        color: "bg-red-100 text-red-600 border-red-200",
        iconColor: "text-red-500",
        count: 3,
      },
      {
        name: "En Reparación",
        icon: Hammer,
        color: "bg-purple-100 text-purple-600 border-purple-200",
        iconColor: "text-purple-500",
        count: 5,
      },
      {
        name: "En Importación",
        icon: Truck,
        color: "bg-indigo-100 text-indigo-600 border-indigo-200",
        iconColor: "text-indigo-500",
        count: 7,
      },
    ];

    // Adjust counts based on period
    let multiplier = 1;
    switch (period) {
      case "today":
        multiplier = 0.2;
        break;
      case "7days":
        multiplier = 0.5;
        break;
      case "30days":
        multiplier = 1;
        break;
      case "3months":
        multiplier = 1.2;
        break;
      case "6months":
        multiplier = 1.5;
        break;
      case "12months":
        multiplier = 2;
        break;
      default:
        multiplier = 1;
    }

    // Apply multiplier to counts
    return baseData.map((item) => ({
      ...item,
      count: Math.round(item.count * multiplier),
    }));
  };

  const statusData = getStatusData();

  // Calculate total vehicles
  const totalVehicles = statusData.reduce(
    (sum, status) => sum + status.count,
    0
  );

  // Calculate percentages
  const statusDataWithPercentages = statusData.map((status) => ({
    ...status,
    percentage: Math.round((status.count / totalVehicles) * 100),
  }));

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {statusDataWithPercentages.map((status) => (
          <StatusCard
            key={status.name}
            name={status.name}
            icon={status.icon}
            color={status.color}
            iconColor={status.iconColor}
            count={status.count}
            percentage={status.percentage}
          />
        ))}
      </div>
    </div>
  );
}

interface StatusCardProps {
  name: string;
  icon: React.ElementType;
  color: string;
  iconColor: string;
  count: number;
  percentage: number;
}

function StatusCard({
  name,
  icon: Icon,
  color,
  iconColor,
  count,
  percentage,
}: StatusCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-all duration-200",
        color,
        isHovered ? "shadow-md translate-y-[-2px]" : "shadow-sm"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Icon className={cn("h-5 w-5", iconColor)} />
            <h3 className="font-medium text-sm">{name}</h3>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{count}</span>
            <span className="text-sm opacity-80">{percentage}% del total</span>
          </div>
        </div>
      </div>
    </div>
  );
}
