import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";
import { PlusCircle } from "lucide-react";
import { VehicleGrid } from "~/components/vehicles/vehicle-grid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export const Route = createFileRoute("/_authed/vehicles/")({
  component: VehiclesPage,
});

export default function VehiclesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehículos</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tu inventario de vehículos y su disponibilidad
          </p>
        </div>
        <Link to="/vehicles/register">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Agregar Vehículo
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Inventario de Vehículos</CardTitle>
          <CardDescription>
            Visualiza y gestiona todos los vehículos disponibles en tu
            inventario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VehicleGrid />
        </CardContent>
      </Card>
    </div>
  );
}
