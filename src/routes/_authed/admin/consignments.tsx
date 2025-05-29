import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  useVehicles,
  useConcesionarios,
  useUpdateVehicle,
  useIsAdmin,
  getErrorMessage,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import {
  AlertTriangle,
  Car,
  Building2,
  Search,
  Filter,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { formatCurrency } from "~/lib/utils";
import { toast } from "~/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

export const Route = createFileRoute("/_authed/admin/consignments")({
  component: ConsignmentManagementPage,
});

export default function ConsignmentManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [assignmentFilter, setAssignmentFilter] = useState<string>("all");

  // Check if user is admin
  const isAdmin = useIsAdmin();

  // Fetch data
  const {
    data: vehicles = [],
    isLoading: isLoadingVehicles,
    error: vehiclesError,
  } = useVehicles();

  const {
    data: concesionarios = [],
    isLoading: isLoadingConcesionarios,
    error: concesionariosError,
  } = useConcesionarios();

  // Mutation for updating vehicle assignments
  const updateVehicleMutation = useUpdateVehicle();

  // Handle vehicle assignment
  const handleAssignVehicle = async (
    vehicleId: string,
    concesionarioId: string | null
  ) => {
    try {
      await updateVehicleMutation.mutateAsync({
        id: vehicleId,
        data: { concesionarioId },
      });

      const assignmentText = concesionarioId
        ? `asignado a ${concesionarios.find((c) => c.id === concesionarioId)?.name || "concesionario"}`
        : "liberado del concesionario";

      toast({
        title: "Vehículo actualizado",
        description: `El vehículo ha sido ${assignmentText} exitosamente.`,
      });
    } catch (error) {
      toast({
        title: "Error al asignar vehículo",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  // Filter vehicles based on search and filters
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.plate?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || vehicle.status === statusFilter;

    const matchesAssignment =
      assignmentFilter === "all" ||
      (assignmentFilter === "assigned" && vehicle.concesionarioId) ||
      (assignmentFilter === "unassigned" && !vehicle.concesionarioId);

    return matchesSearch && matchesStatus && matchesAssignment;
  });

  // Show unauthorized message if not admin
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertTriangle className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-bold">Acceso Denegado</h2>
        <p className="text-muted-foreground text-center max-w-md">
          No tienes permisos para acceder a la gestión de consignaciones. Esta
          sección está reservada para administradores.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Consignaciones
          </h1>
          <p className="text-muted-foreground">
            Administra la asignación de vehículos a concesionarios
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Vehículos
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asignados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehicles.filter((v) => v.concesionarioId).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Asignar</CardTitle>
            <XCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehicles.filter((v) => !v.concesionarioId).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Concesionarios
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{concesionarios.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtra los vehículos por diferentes criterios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por marca, modelo, VIN o placa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="sold">Vendido</SelectItem>
                <SelectItem value="reserved">Reservado</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={assignmentFilter}
              onValueChange={setAssignmentFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Asignación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las asignaciones</SelectItem>
                <SelectItem value="assigned">Asignados</SelectItem>
                <SelectItem value="unassigned">Sin asignar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vehículos ({filteredVehicles.length})</CardTitle>
          <CardDescription>
            Lista de todos los vehículos y sus asignaciones actuales
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingVehicles || isLoadingConcesionarios ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Cargando vehículos...
            </div>
          ) : vehiclesError || concesionariosError ? (
            <div className="text-center py-8 text-destructive">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p>
                Error al cargar datos:{" "}
                {getErrorMessage(vehiclesError || concesionariosError)}
              </p>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Car className="h-8 w-8 mx-auto mb-2" />
              <p>No se encontraron vehículos con los filtros aplicados</p>
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
                    <TableHead>Concesionario</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
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
                      <TableCell>{formatCurrency(vehicle.price)}</TableCell>
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
                        {vehicle.concesionario ? (
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-2 text-green-600" />
                            <span className="text-sm">
                              {vehicle.concesionario.name}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center text-muted-foreground">
                            <XCircle className="h-4 w-4 mr-2" />
                            <span className="text-sm">Sin asignar</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={vehicle.concesionarioId || "unassigned"}
                            onValueChange={(value) => {
                              const concesionarioId =
                                value === "unassigned" ? null : value;
                              handleAssignVehicle(vehicle.id, concesionarioId);
                            }}
                            disabled={updateVehicleMutation.isPending}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Asignar a..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">
                                <div className="flex items-center">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Sin asignar
                                </div>
                              </SelectItem>
                              {concesionarios.map((concesionario) => (
                                <SelectItem
                                  key={concesionario.id}
                                  value={concesionario.id}
                                >
                                  <div className="flex items-center">
                                    <Building2 className="h-4 w-4 mr-2" />
                                    {concesionario.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {updateVehicleMutation.isPending && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Operaciones comunes para la gestión de consignaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <XCircle className="h-4 w-4 mr-2" />
                  Liberar Todos los Vehículos
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción liberará todos los vehículos de sus
                    concesionarios asignados. Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      try {
                        const assignedVehicles = vehicles.filter(
                          (v) => v.concesionarioId
                        );
                        await Promise.all(
                          assignedVehicles.map((vehicle) =>
                            updateVehicleMutation.mutateAsync({
                              id: vehicle.id,
                              data: { concesionarioId: null },
                            })
                          )
                        );
                        toast({
                          title: "Vehículos liberados",
                          description: `${assignedVehicles.length} vehículos han sido liberados.`,
                        });
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: getErrorMessage(error),
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Liberar Todos
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button variant="outline" className="flex-1" disabled>
              <Clock className="h-4 w-4 mr-2" />
              Reporte de Consignaciones
              <Badge variant="secondary" className="ml-2">
                Próximamente
              </Badge>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
