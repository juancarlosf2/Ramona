import { formatCurrency } from "~/lib/utils";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Link } from "@tanstack/react-router";

type VehicleCardProps = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  status: "available" | "sold" | "reserved" | "maintenance" | "importing";
  mileage?: number;
  className?: string;
};

// Status mapping for vehicles with improved contrast
const vehicleStatusMap: Record<
  VehicleCardProps["status"],
  { label: string; className: string }
> = {
  available: {
    label: "Disponible",
    className: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
  sold: {
    label: "Vendido",
    className: "bg-blue-100 text-blue-900 border-blue-300",
  },
  reserved: {
    label: "Reservado",
    className: "bg-amber-100 text-amber-900 border-amber-300",
  },
  maintenance: {
    label: "En Mantenimiento",
    className: "bg-red-100 text-red-900 border-red-300",
  },
  importing: {
    label: "Importando",
    className: "bg-purple-100 text-purple-900 border-purple-300",
  },
};

export function VehicleCard({
  id,
  brand,
  model,
  year,
  price,
  image,
  status,
  mileage,
  className,
}: VehicleCardProps) {
  const statusConfig = vehicleStatusMap[status];
  const isNew = mileage === 0 || mileage === undefined || mileage < 100;

  return (
    <Link to={`/vehicles/$vehicleId`} params={{ vehicleId: id }}>
      <Card
        className={`overflow-hidden hover:shadow-md transition-shadow duration-200 ${className}`}
      >
        <div className="relative aspect-[16/10]">
          <img
            src={image || "/placeholder.svg"}
            alt={`${brand} ${model}`}
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
              {isNew ? "Nuevo" : "Usado"}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">
                {year} {brand} {model}
              </h3>
              {mileage !== undefined && mileage > 0 && (
                <p className="text-sm text-foreground/70">
                  {mileage.toLocaleString()} km
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
          <span className="font-bold">{formatCurrency(price)}</span>
          <span className="text-xs text-muted-foreground underline">
            Ver detalles
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
