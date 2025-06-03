import { formatCurrency } from "~/lib/utils";
import { vehicleStatusMap } from "~/lib/vehicle-status-config";
import { translateCondition } from "~/lib/vehicle-translations";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Link } from "@tanstack/react-router";
import type { Vehicle } from "~/types/vehicle";

type VehicleCardProps = {
  vehicle: Vehicle;
  className?: string;
};

export function VehicleCard({
  vehicle,
  className,
}: VehicleCardProps) {
  const statusConfig = vehicleStatusMap[vehicle.status];
  const isNew = vehicle.condition === "new";

  return (
    <Link to={`/vehicles/$vehicleId`} params={{ vehicleId: vehicle.id }}>
      <Card
        className={`overflow-hidden hover:shadow-md transition-shadow duration-200 ${className}`}
      >
        <div className="relative aspect-[16/10]">
          <img
            src={vehicle.images?.[0] || "/placeholder.svg"}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge
              className={
                isNew
                  ? "bg-primary text-primary-foreground font-medium"
                  : "bg-muted text-foreground font-medium"
              }
            >
              {translateCondition(vehicle.condition)}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">
                {vehicle.year} {vehicle.brand} {vehicle.model}
              </h3>
              {vehicle.mileage !== undefined && vehicle.mileage !== null && vehicle.mileage > 0 && (
                <p className="text-sm text-foreground/70">
                  {vehicle.mileage.toLocaleString()} km
                </p>
              )}
            </div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border shadow-sm ${statusConfig.className}`}
            >
              {statusConfig.label}
            </span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <span className="font-bold">{formatCurrency(Number(vehicle.price))}</span>
          <span className="text-xs text-muted-foreground underline">
            Ver detalles
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
