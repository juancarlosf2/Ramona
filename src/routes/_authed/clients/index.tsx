import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ClientsTable } from "~/components/clients/clients-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export const Route = createFileRoute("/_authed/clients/")({
  component: ClientsPage,
});

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona la información de tus clientes y sus interacciones
          </p>
        </div>
        <Link to="/clients/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Agregar Cliente
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Listado de Clientes</CardTitle>
          <CardDescription>
            Visualiza y gestiona todos tus clientes desde un solo lugar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientsTable />
        </CardContent>
      </Card>
    </div>
  );
}
