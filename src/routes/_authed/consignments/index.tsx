import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  useSuspenseVehicles,
  useSuspenseConcesionarios,
  useUpdateVehicle,
  getErrorMessage,
  vehiclesQueryOptions,
  concesionariosQueryOptions,
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
  PlusCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  User,
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

export const Route = createFileRoute("/_authed/consignments/")({
  loader: async ({ context }) => {
    // Check admin access on server

    // Prefetch data on server
    const queryClient = (context as any).queryClient;
    if (queryClient) {
      await Promise.all([
        queryClient.ensureQueryData(vehiclesQueryOptions()),
        queryClient.ensureQueryData(concesionariosQueryOptions()),
      ]);
    }
  },
  component: ConsignmentManagementPage,
});

export default function ConsignmentManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [assignmentFilter, setAssignmentFilter] = useState<string>("all");

  // Use suspense queries - data is already loaded by the loader
  const { data: vehicles = [] } = useSuspenseVehicles();
  const { data: concesionarios = [] } = useSuspenseConcesionarios();

  // Mutation for updating vehicle assignments
  const updateVehicleMutation = useUpdateVehicle();

  // Handle vehicle assignment
  const handleAssignVehicle = async (
    vehicleId: string,
    concesionarioId: string | null
  ) => {
    try {
      await updateVehicleMutation.mutateAsync({
        vehicleId: vehicleId,
        updateData: { concesionarioId },
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
        <Button asChild>
          <Link to="/consignments/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Agregar Concesionario
          </Link>
        </Button>
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
          {filteredVehicles.length === 0 ? (
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

      {/* Concesionarios List */}
      <Card>
        <CardHeader>
          <CardTitle>Concesionarios ({concesionarios.length})</CardTitle>
          <CardDescription>
            Lista de todos los concesionarios registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {concesionarios.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-8 w-8 mx-auto mb-2" />
              <p>No hay concesionarios registrados</p>
              <p className="text-sm">
                Usa el botón "Agregar Concesionario" para crear uno nuevo
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {concesionarios.map((concesionario) => (
                <Link
                  key={concesionario.id}
                  to="/consignments/$concesionarioId"
                  params={{ concesionarioId: concesionario.id }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold">
                              {concesionario.name}
                            </CardTitle>
                            {concesionario.contactName && (
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <User className="h-3.5 w-3.5 mr-1.5" />
                                {concesionario.contactName}
                              </div>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {concesionario.phone && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5 mr-2" />
                          {concesionario.phone}
                        </div>
                      )}
                      {concesionario.email && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-3.5 w-3.5 mr-2" />
                          {concesionario.email}
                        </div>
                      )}
                      {concesionario.address && (
                        <div className="flex items-start text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">
                            {concesionario.address}
                          </span>
                        </div>
                      )}
                      <div className="pt-2">
                        <div className="text-xs text-muted-foreground">
                          Vehículos asignados:{" "}
                          <span className="font-medium text-foreground">
                            {
                              vehicles.filter(
                                (v) => v.concesionarioId === concesionario.id
                              ).length
                            }
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
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
                              vehicleId: vehicle.id,
                              updateData: { concesionarioId: null },
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
