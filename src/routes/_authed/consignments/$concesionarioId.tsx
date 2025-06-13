import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useUpdateVehicle,
  getErrorMessage,
  concesionarioByIdQueryOptions,
  useSuspenseConcesionario,
} from "~/hooks/useSupabaseData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  AlertTriangle,
  Car,
  Building2,
  Loader2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  User,
  Calendar,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { formatCurrency } from "~/lib/utils";
import { toast } from "~/hooks/use-toast";

export const Route = createFileRoute("/_authed/consignments/$concesionarioId")({
  loader: async ({ context, params: { concesionarioId } }) => {
    // Use queryClient.ensureQueryData to prefetch concesionario data on the server
    const queryClient = (context as any).queryClient;
    if (queryClient) {
      await queryClient.ensureQueryData(
        concesionarioByIdQueryOptions(concesionarioId)
      );
    }
  },
  component: ConcesionarioDetailPage,
});

export default function ConcesionarioDetailPage() {
  const { concesionarioId } = Route.useParams();

  // Use suspense query to get concesionario data
  const { data: concesionario } = useSuspenseConcesionario(concesionarioId);

  // Mutation for updating vehicle assignments
  const updateVehicleMutation = useUpdateVehicle();

  // Calculate statistics from the loaded data
  const assignedVehicles = concesionario.vehicles || [];
  const totalVehicles = assignedVehicles.length;
  const availableVehicles = assignedVehicles.filter(
    (v) => v.status === "available"
  ).length;
  const soldVehicles = assignedVehicles.filter(
    (v) => v.status === "sold"
  ).length;
  const totalValue = assignedVehicles.reduce(
    (sum, vehicle) => sum + Number(vehicle.price),
    0
  );

  // Handle vehicle unassignment
  const handleUnassignVehicle = async (vehicleId: string) => {
    try {
      await updateVehicleMutation.mutateAsync({
        vehicleId: vehicleId,
        updateData: { concesionarioId: null },
      });

      toast({
        title: "Vehículo liberado",
        description:
          "El vehículo ha sido liberado del concesionario exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error al liberar vehículo",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  // Show unauthorized message if not admin
  // if (!isAdmin) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
  //       <AlertTriangle className="h-16 w-16 text-destructive" />
  //       <h2 className="text-2xl font-bold">Acceso Denegado</h2>
  //       <p className="text-muted-foreground text-center max-w-md">
  //         No tienes permisos para acceder a la gestión de consignaciones. Esta
  //         sección está reservada para administradores.
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/consignments">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              {concesionario.name}
            </h1>
            <p className="text-muted-foreground">
              Detalles del concesionario y vehículos asignados
            </p>
          </div>
        </div>
      </div>

      {/* Concesionario Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Concesionario</CardTitle>
          <CardDescription>
            Datos de contacto y detalles del concesionario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{concesionario.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Nombre del concesionario
                  </p>
                </div>
              </div>

              {concesionario.contactName && (
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{concesionario.contactName}</p>
                    <p className="text-sm text-muted-foreground">
                      Persona de contacto
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {concesionario.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{concesionario.phone}</p>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                  </div>
                </div>
              )}

              {concesionario.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{concesionario.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Correo electrónico
                    </p>
                  </div>
                </div>
              )}

              {concesionario.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{concesionario.address}</p>
                    <p className="text-sm text-muted-foreground">Dirección</p>
                  </div>
                </div>
              )}

              {concesionario.createdAt && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {new Intl.DateTimeFormat("es-DO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(concesionario.createdAt))}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Fecha de registro
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Vehículos
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVehicles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableVehicles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendidos</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{soldVehicles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Vehicles */}
      <Card>
        <CardHeader>
          <CardTitle>Vehículos Asignados ({assignedVehicles.length})</CardTitle>
          <CardDescription>
            Lista de vehículos actualmente asignados a este concesionario
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assignedVehicles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Car className="h-8 w-8 mx-auto mb-2" />
              <p>No hay vehículos asignados a este concesionario</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>VIN</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {vehicle.brand} {vehicle.model}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {vehicle.year} • {vehicle.color}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {vehicle.vin}
                      </TableCell>
                      <TableCell>{vehicle.plate || "N/A"}</TableCell>
                      <TableCell>
                        {formatCurrency(Number(vehicle.price))}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            vehicle.status === "available"
                              ? "default"
                              : vehicle.status === "sold"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {vehicle.status === "available"
                            ? "Disponible"
                            : vehicle.status === "sold"
                              ? "Vendido"
                              : vehicle.status === "reserved"
                                ? "Reservado"
                                : vehicle.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnassignVehicle(vehicle.id)}
                            disabled={updateVehicleMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Liberar
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              to={`/vehicles/$vehicleId`}
                              params={{ vehicleId: vehicle.id }}
                            >
                              Ver detalles
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
