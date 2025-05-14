"use client";

import { Car, Calendar, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Link } from "@tanstack/react-router";

// Mock vehicle data
const vehiclesData = [
  {
    id: "1",
    model: "Toyota Corolla",
    year: "2023",
    vin: "1HGCM82633A123456",
    price: "$32,500.00",
    purchaseDate: "15 Nov 2023",
    image: "/classic-red-convertible.png",
  },
  {
    id: "2",
    model: "Honda CR-V",
    year: "2022",
    vin: "5J6RW2H89NL003456",
    price: "$29,800.00",
    purchaseDate: "Pendiente",
    image: "/modern-family-suv.png",
  },
];

interface ClientVehiclesProps {
  clientId: string;
  isLoading: boolean;
}

export function ClientVehicles({ clientId, isLoading }: ClientVehiclesProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-[200px] w-full" />
            <CardHeader className="p-4 pb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24 mt-1" />
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {vehiclesData.map((vehicle) => (
        <Card
          key={vehicle.id}
          className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          <div className="relative h-[200px] w-full overflow-hidden">
            <img
              src={vehicle.image || "/placeholder.svg"}
              alt={`${vehicle.year} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
          </div>

          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              {vehicle.year} {vehicle.model}
            </CardTitle>
            <CardDescription>VIN: {vehicle.vin}</CardDescription>
          </CardHeader>

          <CardContent className="p-4 pt-0 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>Precio: {vehicle.price}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Fecha de compra: {vehicle.purchaseDate}</span>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Button
              asChild
              variant="secondary"
              className="w-full hover:opacity-90 transition-opacity py-2.5"
            >
              <Link
                params={{ vehicleId: vehicle.id }}
                to={`/vehicles/$vehicleId`}
              >
                <span className="font-jakarta font-extrabold text-center">
                  Ver detalles del vehículo
                </span>
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
