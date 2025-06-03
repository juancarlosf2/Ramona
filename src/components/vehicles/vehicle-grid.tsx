import type React from "react";

import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Car,
  Search,
  X,
  Fuel,
  GitFork,
  Banknote,
  Tag,
  CheckCircle2,
  Clock,
  Wrench,
  AlertCircle,
  Truck,
  TimerReset,
  Hourglass,
  FileCheck,
  FileText,
  Briefcase,
  Key,
  Gauge,
  Trash2,
  CheckSquare,
  Square,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn, formatCurrency } from "~/lib/utils";
import { vehicleStatusMap } from "~/lib/vehicle-status-config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { toast } from "~/hooks/use-toast";
import { Link, useRouter } from "@tanstack/react-router";
import { useVehicles } from "~/hooks/useSupabaseData";
import diverseAvatars from "../../public/diverse-avatars.png";
import {
  translateTransmission,
  translateFuelType,
  translateCondition,
} from "~/lib/vehicle-translations";
import type { Vehicle, VehicleStatus } from "~/types/vehicle";

// Vehicle status types are now imported from ~/types/vehicle

// Brand color mapping for avatars
const brandColorMap: Record<string, string> = {
  Toyota: "bg-red-100",
  Honda: "bg-blue-100",
  Hyundai: "bg-sky-100",
  Kia: "bg-orange-100",
  Nissan: "bg-gray-100",
  Mazda: "bg-purple-100",
  Ford: "bg-indigo-100",
  Chevrolet: "bg-yellow-100",
  BMW: "bg-blue-100",
  "Mercedes-Benz": "bg-gray-100",
  Volkswagen: "bg-blue-100",
  Audi: "bg-gray-100",
  Lexus: "bg-red-100",
  Subaru: "bg-blue-100",
  Mitsubishi: "bg-red-100",
  Jeep: "bg-green-100",
  Suzuki: "bg-blue-100",
  Volvo: "bg-blue-100",
  Peugeot: "bg-blue-100",
  Renault: "bg-yellow-100",
};

// Filter type
type Filters = {
  search: string;
  status: VehicleStatus[];
  brands: string[];
  minYear: number;
  maxYear: number;
  minPrice: number;
  maxPrice: number;
  colors: string[];
  transmissions: string[];
  fuelTypes: string[];
};

// Get unique values for filter options
const getUniqueValues = <T extends keyof Vehicle>(
  vehicles: Vehicle[],
  key: T
): Vehicle[T][] => {
  const values = vehicles.map((vehicle) => vehicle[key]);
  return [...new Set(values)] as Vehicle[T][];
};

export function VehicleGrid() {
  const router = useRouter();

  // React Query for vehicles data
  const { data: vehicles = [], isLoading, error } = useVehicles();

  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<number>(0);

  // Selection state
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<VehicleStatus | "">("");

  // Filter states
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: [],
    brands: [],
    minYear: 2015,
    maxYear: new Date().getFullYear() + 1,
    minPrice: 0,
    maxPrice: 2000000,
    colors: [],
    transmissions: [],
    fuelTypes: [],
  });

  // Memoized derived values from server data
  const uniqueBrands = useMemo(
    () => getUniqueValues(vehicles, "brand"),
    [vehicles]
  );
  const uniqueColors = useMemo(
    () => getUniqueValues(vehicles, "color"),
    [vehicles]
  );
  const uniqueTransmissions = useMemo(
    () => getUniqueValues(vehicles, "transmission"),
    [vehicles]
  );
  const uniqueFuelTypes = useMemo(
    () => getUniqueValues(vehicles, "fuelType"),
    [vehicles]
  );

  const {
    minYearAvailable,
    maxYearAvailable,
    minPriceAvailable,
    maxPriceAvailable,
  } = useMemo(() => {
    if (vehicles.length === 0) {
      return {
        minYearAvailable: 2015,
        maxYearAvailable: new Date().getFullYear() + 1,
        minPriceAvailable: 0,
        maxPriceAvailable: 2000000,
      };
    }

    const years = vehicles.map((v) => v.year);
    const prices = vehicles.map((v) => Number.parseFloat(v.price));

    return {
      minYearAvailable: Math.min(...years),
      maxYearAvailable: Math.max(...years),
      minPriceAvailable: Math.min(...prices),
      maxPriceAvailable: Math.max(...prices),
    };
  }, [vehicles]);

  // Initialize filters when vehicles data is loaded
  useEffect(() => {
    if (vehicles.length > 0) {
      setFilteredVehicles(vehicles);
      setFilters((prev) => ({
        ...prev,
        minYear: minYearAvailable,
        maxYear: maxYearAvailable,
        minPrice: minPriceAvailable,
        maxPrice: maxPriceAvailable,
      }));
    }
  }, [
    vehicles,
    minYearAvailable,
    maxYearAvailable,
    minPriceAvailable,
    maxPriceAvailable,
  ]);

  // Apply filters
  useEffect(() => {
    if (vehicles.length === 0) return;

    let filtered = [...vehicles];
    let activeFilterCount = 0;

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.brand.toLowerCase().includes(searchTerm) ||
          vehicle.model.toLowerCase().includes(searchTerm) ||
          vehicle.vin.toLowerCase().includes(searchTerm) ||
          (vehicle.plate && vehicle.plate.toLowerCase().includes(searchTerm))
      );
      activeFilterCount++;
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter((vehicle) =>
        filters.status.includes(vehicle.status)
      );
      activeFilterCount++;
    }

    // Brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter((vehicle) =>
        filters.brands.includes(vehicle.brand)
      );
      activeFilterCount++;
    }

    // Year filter
    filtered = filtered.filter(
      (vehicle) =>
        vehicle.year >= filters.minYear && vehicle.year <= filters.maxYear
    );
    if (
      filters.minYear > minYearAvailable ||
      filters.maxYear < maxYearAvailable
    ) {
      activeFilterCount++;
    }

    // Price filter (convert string price to number)
    filtered = filtered.filter((vehicle) => {
      const vehiclePrice = Number.parseFloat(vehicle.price);
      return (
        vehiclePrice >= filters.minPrice && vehiclePrice <= filters.maxPrice
      );
    });
    if (
      filters.minPrice > minPriceAvailable ||
      filters.maxPrice < maxPriceAvailable
    ) {
      activeFilterCount++;
    }

    // Color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter((vehicle) =>
        filters.colors.includes(vehicle.color)
      );
      activeFilterCount++;
    }

    // Transmission filter
    if (filters.transmissions.length > 0) {
      filtered = filtered.filter((vehicle) =>
        filters.transmissions.includes(vehicle.transmission)
      );
      activeFilterCount++;
    }

    // Fuel type filter
    if (filters.fuelTypes.length > 0) {
      filtered = filtered.filter((vehicle) =>
        filters.fuelTypes.includes(vehicle.fuelType)
      );
      activeFilterCount++;
    }

    setFilteredVehicles(filtered);
    setActiveFilters(activeFilterCount);
  }, [
    vehicles,
    filters,
    minYearAvailable,
    maxYearAvailable,
    minPriceAvailable,
    maxPriceAvailable,
  ]);

  // Update filter
  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Toggle filter value in array
  const toggleFilterValue = <K extends keyof Filters>(
    key: K,
    value: Filters[K] extends Array<infer U> ? U : never
  ) => {
    setFilters((prev) => {
      const currentValues = prev[key] as any[];
      return {
        ...prev,
        [key]: currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value],
      };
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      status: [],
      brands: [],
      minYear: minYearAvailable,
      maxYear: maxYearAvailable,
      minPrice: minPriceAvailable,
      maxPrice: maxPriceAvailable,
      colors: [],
      transmissions: [],
      fuelTypes: [],
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-DO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  // Selection handlers
  const toggleVehicleSelection = (
    vehicleId: string,
    event?: React.MouseEvent
  ) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    setSelectedVehicles((prev) => {
      if (prev.includes(vehicleId)) {
        const newSelection = prev.filter((id) => id !== vehicleId);
        if (newSelection.length === 0) {
          setIsSelectionMode(false);
        }
        return newSelection;
      } else {
        if (!isSelectionMode) {
          setIsSelectionMode(true);
        }
        return [...prev, vehicleId];
      }
    });
  };

  const toggleAllVehicles = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (selectedVehicles.length === filteredVehicles.length) {
      setSelectedVehicles([]);
      setIsSelectionMode(false);
    } else {
      setSelectedVehicles(filteredVehicles.map((v) => v.id));
      setIsSelectionMode(true);
    }
  };

  const clearSelection = () => {
    setSelectedVehicles([]);
    setIsSelectionMode(false);
  };

  // Delete handlers
  const handleDeleteVehicle = (vehicle: Vehicle, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteVehicle = () => {
    if (!vehicleToDelete) return;

    setIsDeleting(true);

    // TODO: Implement actual API call to delete vehicle
    setTimeout(() => {
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
      setIsDeleting(false);

      toast({
        title: "Funcionalidad en desarrollo",
        description:
          "La eliminación de vehículos será implementada próximamente.",
        variant: "default",
      });
    }, 800);
  };

  const handleBulkDelete = () => {
    if (selectedVehicles.length === 0) return;
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = () => {
    setIsDeleting(true);

    // TODO: Implement actual API call to delete multiple vehicles
    setTimeout(() => {
      setBulkDeleteDialogOpen(false);
      setSelectedVehicles([]);
      setIsSelectionMode(false);
      setIsDeleting(false);

      toast({
        title: "Funcionalidad en desarrollo",
        description:
          "La eliminación masiva de vehículos será implementada próximamente.",
        variant: "default",
      });
    }, 800);
  };

  // Status change handlers
  const handleStatusChange = () => {
    if (selectedVehicles.length === 0 || newStatus === "") return;

    setIsDeleting(true); // Reuse loading state

    // TODO: Implement actual API call to update vehicle statuses
    setTimeout(() => {
      setStatusChangeDialogOpen(false);
      setNewStatus("");
      setSelectedVehicles([]);
      setIsSelectionMode(false);
      setIsDeleting(false);

      toast({
        title: "Funcionalidad en desarrollo",
        description:
          "La actualización de estado de vehículos será implementada próximamente.",
        variant: "default",
      });
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border overflow-hidden"
          >
            <div className="aspect-[4/3] bg-muted"></div>
            <div className="p-4 space-y-3">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-5 bg-muted rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selection toolbar */}
      {isSelectionMode && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                onClick={toggleAllVehicles}
              >
                {selectedVehicles.length === filteredVehicles.length ? (
                  <>
                    <CheckSquare className="h-4 w-4" />
                    <span>Deseleccionar todos</span>
                  </>
                ) : (
                  <>
                    <Square className="h-4 w-4" />
                    <span>Seleccionar todos</span>
                  </>
                )}
              </Button>
              <span className="text-sm font-medium">
                {selectedVehicles.length} vehículo
                {selectedVehicles.length !== 1 ? "s" : ""} seleccionado
                {selectedVehicles.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                className="h-8 gap-1.5"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Eliminar</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => setStatusChangeDialogOpen(true)}
              >
                <Tag className="h-3.5 w-3.5" />
                <span>Cambiar estado</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={clearSelection}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por marca, modelo, VIN o placa..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9 pr-4"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5"
            onClick={() => setIsSelectionMode(!isSelectionMode)}
          >
            {isSelectionMode ? (
              <>
                <X className="h-4 w-4" />
                <span>Cancelar selección</span>
              </>
            ) : (
              <>
                <CheckSquare className="h-4 w-4" />
                <span>Seleccionar</span>
              </>
            )}
          </Button>
          <Select defaultValue="latest">
            <SelectTrigger className="w-[180px] [&>span]:gap-2">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Últimas entradas</SelectItem>
              <SelectItem value="price_asc">Menor precio</SelectItem>
              <SelectItem value="price_desc">Mayor precio</SelectItem>
              <SelectItem value="year_desc">Año más reciente</SelectItem>
              <SelectItem value="year_asc">Año más antiguo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredVehicles.length} de {vehicles.length} vehículos
        </p>
        {activeFilters > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8 px-2 text-xs"
          >
            Limpiar filtros
            <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Vehicle grid */}
      {filteredVehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Car className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No se encontraron vehículos</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            No hay vehículos que coincidan con los filtros seleccionados.
          </p>
          <Button onClick={resetFilters}>Reiniciar filtros</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-50 duration-500">
          {filteredVehicles.map((vehicle) => {
            const statusConfig = vehicleStatusMap[vehicle.status];
            const isNew = vehicle.condition === "new";
            const isSelected = selectedVehicles.includes(vehicle.id);

            return (
              <Card
                key={vehicle.id}
                className={cn(
                  "overflow-hidden rounded-xl border transition-all duration-200 group relative",
                  isSelected
                    ? "ring-2 ring-primary border-primary shadow-md"
                    : "border-border hover:shadow-md hover:scale-[1.01]"
                )}
              >
                {/* Selection checkbox */}
                <div
                  className={cn(
                    "absolute top-3 left-3 z-10 transition-opacity duration-200",
                    isSelectionMode || isSelected
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  )}
                >
                  <div
                    className="h-6 w-6 bg-white rounded-md shadow-md flex items-center justify-center cursor-pointer"
                    onClick={(e) => toggleVehicleSelection(vehicle.id, e)}
                  >
                    {isSelected ? (
                      <CheckSquare className="h-5 w-5 text-primary" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                <Link
                  to={`/vehicles/$vehicleId`}
                  params={{ vehicleId: vehicle.id }}
                  className="block"
                  onClick={(e) => isSelectionMode && e.preventDefault()}
                >
                  <div
                    className="relative aspect-[4/3] overflow-hidden bg-muted flex items-center justify-center"
                    onClick={(e) =>
                      isSelectionMode && toggleVehicleSelection(vehicle.id, e)
                    }
                  >
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <img
                        src={vehicle.images[0]}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    {/* Fallback placeholder - shown when no images or image fails to load */}
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center text-muted-foreground absolute inset-0",
                        vehicle.images && vehicle.images.length > 0
                          ? "hidden"
                          : ""
                      )}
                    >
                      <Car className="h-16 w-16 mb-2" />
                      <span className="text-sm font-medium">
                        {vehicle.brand}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg leading-tight">
                            {vehicle.brand} {vehicle.model}
                          </h3>
                          {/* Status and condition badges */}
                          <div className="flex flex-col gap-2 mt-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge
                                    className={cn(
                                      "w-fit px-2.5 py-1 rounded-full flex items-center gap-1.5 border",
                                      statusConfig.className
                                    )}
                                  >
                                    {statusConfig.icon}
                                    <span>{statusConfig.label}</span>
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{statusConfig.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <Badge
                              className={cn(
                                "w-fit px-2.5 py-1 rounded-full flex items-center gap-1.5",
                                isNew
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : "bg-gray-100 text-gray-800 border border-gray-200"
                              )}
                            >
                              {isNew ? (
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                              ) : (
                                <Clock className="h-3.5 w-3.5 mr-1" />
                              )}
                              {translateCondition(vehicle.condition)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {vehicle.year} •
                            <span className="inline-flex items-center ml-1">
                              <span
                                className="inline-block w-2 h-2 rounded-full mr-1"
                                style={{
                                  backgroundColor: vehicle.color
                                    .toLowerCase()
                                    .includes("blanco")
                                    ? "#f8fafc"
                                    : vehicle.color
                                          .toLowerCase()
                                          .includes("negro")
                                      ? "#020617"
                                      : vehicle.color
                                            .toLowerCase()
                                            .includes("gris")
                                        ? "#94a3b8"
                                        : vehicle.color
                                              .toLowerCase()
                                              .includes("plata")
                                          ? "#cbd5e1"
                                          : vehicle.color
                                                .toLowerCase()
                                                .includes("rojo")
                                            ? "#ef4444"
                                            : vehicle.color
                                                  .toLowerCase()
                                                  .includes("azul")
                                              ? "#3b82f6"
                                              : "#64748b",
                                }}
                              ></span>
                              {vehicle.color}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {formatCurrency(Number.parseFloat(vehicle.price))}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Key className="h-3.5 w-3.5" />
                          <span>{vehicle.plate || "Sin placa"}</span>
                        </div>
                        {vehicle.mileage !== null && (
                          <div className="flex items-center gap-1">
                            <Gauge className="h-3.5 w-3.5" />
                            <span>{vehicle.mileage.toLocaleString()} km</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span className="text-xs">
                            VIN: {vehicle.vin.slice(-8)}
                          </span>
                        </div>
                        {vehicle.entryDate && (
                          <div className="flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(vehicle.entryDate).toLocaleDateString(
                                "es-DO",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {vehicle.concesionario && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Briefcase className="h-3 w-3" />
                          <span>
                            Concesionario: {vehicle.concesionario.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Link>

                <CardFooter className="px-4 py-3 border-t flex justify-between items-center bg-muted/30">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Fuel className="h-3 w-3 text-muted-foreground" />
                      <span>{translateFuelType(vehicle.fuelType)}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-muted-foreground/30"></div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-3 w-3 text-muted-foreground" />
                      <span>{translateTransmission(vehicle.transmission)}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs font-medium"
                  >
                    Ver detalles
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar vehículo</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este vehículo? Esta acción no
              se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {vehicleToDelete && (
            <div className="flex items-center gap-4 py-2">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted flex items-center justify-center">
                {vehicleToDelete.images && vehicleToDelete.images.length > 0 ? (
                  <img
                    src={vehicleToDelete.images[0]}
                    alt={`${vehicleToDelete.brand} ${vehicleToDelete.model}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to car icon if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                {/* Fallback car icon - shown when no images or image fails to load */}
                <Car
                  className={cn(
                    "h-8 w-8 text-muted-foreground absolute inset-0 m-auto",
                    vehicleToDelete.images && vehicleToDelete.images.length > 0
                      ? "hidden"
                      : ""
                  )}
                />
              </div>
              <div>
                <h4 className="font-medium">
                  {vehicleToDelete.brand} {vehicleToDelete.model}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {vehicleToDelete.year} •{" "}
                  {vehicleToDelete.plate || "Sin placa"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteVehicle}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="animate-spin mr-2">◌</span>
                  Eliminando...
                </>
              ) : (
                "Eliminar vehículo"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk delete confirmation dialog */}
      <Dialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar vehículos seleccionados</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar {selectedVehicles.length}{" "}
              vehículo
              {selectedVehicles.length !== 1 ? "s" : ""}? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setBulkDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmBulkDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="animate-spin mr-2">◌</span>
                  Eliminando...
                </>
              ) : (
                `Eliminar ${selectedVehicles.length} vehículo${selectedVehicles.length !== 1 ? "s" : ""}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status change dialog */}
      <Dialog
        open={statusChangeDialogOpen}
        onOpenChange={setStatusChangeDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar estado de vehículos</DialogTitle>
            <DialogDescription>
              Selecciona el nuevo estado para los {selectedVehicles.length}{" "}
              vehículo
              {selectedVehicles.length !== 1 ? "s" : ""} seleccionado
              {selectedVehicles.length !== 1 ? "s" : ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={newStatus}
              onValueChange={(value) => setNewStatus(value as VehicleStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar nuevo estado" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(vehicleStatusMap).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn("w-2 h-2 rounded-full", value.className)}
                      ></div>
                      <span>{value.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setStatusChangeDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={handleStatusChange}
              disabled={isDeleting || newStatus === ""}
            >
              {isDeleting ? (
                <>
                  <span className="animate-spin mr-2">◌</span>
                  Actualizando...
                </>
              ) : (
                "Actualizar estado"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
