import type React from "react";

import { useState, useEffect } from "react";
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
import diverseAvatars from "../../public/diverse-avatars.png";

// Vehicle type definition
type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  trim?: string;
  color: string;
  vin: string;
  plate: string;
  price: number;
  status: VehicleStatus;
  mileage?: number;
  fuelType: string;
  transmission: string;
  engineSize: string;
  doors: number;
  seats: number;
  images: string[];
  addedDate?: string;
  onSale?: boolean;
  salePrice?: number;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
};

// Vehicle status types
type VehicleStatus =
  | "available"
  | "reserved"
  | "in_process"
  | "financing"
  | "sold"
  | "unavailable"
  | "retired"
  | "preparing"
  | "pending_delivery"
  | "test_drive"
  | "maintenance"
  | "administrative"
  | "with_offer"
  | "with_contract"
  | "pending_payment"
  | "completed";

// Update the vehicleStatusMap object with the standardized color scheme and icons
const vehicleStatusMap: Record<
  VehicleStatus,
  {
    label: string;
    className: string;
    bgClassName: string;
    icon: React.ReactNode;
    description: string;
  }
> = {
  available: {
    label: "Disponible",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    bgClassName: "bg-yellow-50",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    description: "Vehículo listo para venta inmediata",
  },
  reserved: {
    label: "Reservado",
    className: "bg-blue-100 text-blue-800 border-blue-200",
    bgClassName: "bg-blue-50",
    icon: <Clock className="h-3.5 w-3.5" />,
    description: "Vehículo apartado por un cliente",
  },
  in_process: {
    label: "En proceso de venta",
    className: "bg-orange-100 text-orange-800 border-orange-200",
    bgClassName: "bg-orange-50",
    icon: <Hourglass className="h-3.5 w-3.5" />,
    description: "Venta en proceso de finalización",
  },
  financing: {
    label: "En financiamiento",
    className: "bg-purple-100 text-purple-800 border-purple-200",
    bgClassName: "bg-purple-50",
    icon: <Banknote className="h-3.5 w-3.5" />,
    description: "En proceso de aprobación de financiamiento",
  },
  sold: {
    label: "Vendido",
    className: "bg-green-100 text-green-800 border-green-200",
    bgClassName: "bg-green-50",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    description: "Venta completada",
  },
  unavailable: {
    label: "No disponible",
    className: "bg-red-100 text-red-800 border-red-200",
    bgClassName: "bg-red-50",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    description: "Temporalmente no disponible para venta",
  },
  retired: {
    label: "Retirado",
    className: "bg-gray-800 text-gray-100 border-gray-700",
    bgClassName: "bg-gray-50",
    icon: <X className="h-3.5 w-3.5" />,
    description: "Retirado permanentemente del inventario",
  },
  preparing: {
    label: "En preparación",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    bgClassName: "bg-amber-50",
    icon: <Wrench className="h-3.5 w-3.5" />,
    description: "En proceso de preparación para venta",
  },
  pending_delivery: {
    label: "Entrega pendiente",
    className: "bg-sky-100 text-sky-800 border-sky-200",
    bgClassName: "bg-sky-50",
    icon: <Truck className="h-3.5 w-3.5" />,
    description: "Vendido, pendiente de entrega al cliente",
  },
  test_drive: {
    label: "Test drive",
    className: "bg-teal-100 text-teal-800 border-teal-200",
    bgClassName: "bg-teal-50",
    icon: <Car className="h-3.5 w-3.5" />,
    description: "Reservado para prueba de manejo",
  },
  maintenance: {
    label: "Mantenimiento",
    className: "bg-rose-100 text-rose-800 border-rose-200",
    bgClassName: "bg-rose-50",
    icon: <Wrench className="h-3.5 w-3.5" />,
    description: "En servicio de mantenimiento o reparación",
  },
  administrative: {
    label: "Gestión admin.",
    className: "bg-slate-100 text-slate-800 border-slate-200",
    bgClassName: "bg-slate-50",
    icon: <Briefcase className="h-3.5 w-3.5" />,
    description: "En proceso de gestión administrativa",
  },
  with_offer: {
    label: "Con oferta",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    bgClassName: "bg-amber-50",
    icon: <Tag className="h-3.5 w-3.5" />,
    description: "Cliente ha realizado una oferta",
  },
  with_contract: {
    label: "Con contrato",
    className: "bg-indigo-100 text-indigo-800 border-indigo-200",
    bgClassName: "bg-indigo-50",
    icon: <FileText className="h-3.5 w-3.5" />,
    description: "Contrato generado, pendiente de firma",
  },
  pending_payment: {
    label: "Pago pendiente",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    bgClassName: "bg-amber-50",
    icon: <TimerReset className="h-3.5 w-3.5" />,
    description: "Esperando confirmación de pago",
  },
  completed: {
    label: "Finalizado",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    bgClassName: "bg-emerald-50",
    icon: <FileCheck className="h-3.5 w-3.5" />,
    description: "Proceso completado satisfactoriamente",
  },
};

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

// Sample data
const vehiclesData: Vehicle[] = [
  {
    id: "1",
    brand: "Toyota",
    model: "Corolla",
    year: 2022,
    trim: "XSE CVT",
    color: "Blanco",
    vin: "1HGCM82633A123456",
    plate: "A123456",
    price: 950000,
    status: "available",
    mileage: 1500,
    fuelType: "Gasolina",
    transmission: "Automática",
    engineSize: "1.8L",
    doors: 4,
    seats: 5,
    images: ["/placeholder.svg?key=c3c0u"],
    addedDate: "2023-10-15",
    onSale: true,
    salePrice: 899000,
  },
  {
    id: "2",
    brand: "Honda",
    model: "Civic",
    year: 2021,
    color: "Negro",
    vin: "2HGFG12567H789012",
    plate: "B789012",
    price: 875000,
    status: "sold",
    mileage: 12000,
    fuelType: "Gasolina",
    transmission: "Automática",
    engineSize: "2.0L",
    doors: 4,
    seats: 5,
    images: ["/placeholder.svg?key=d8vlv"],
    addedDate: "2023-09-28",
  },
  {
    id: "3",
    brand: "Hyundai",
    model: "Tucson",
    year: 2023,
    color: "Gris",
    vin: "5NPE24AF1FH123789",
    plate: "C345678",
    price: 1250000,
    status: "reserved",
    mileage: 500,
    fuelType: "Gasolina",
    transmission: "Automática",
    engineSize: "2.0L",
    doors: 5,
    seats: 5,
    images: ["/placeholder.svg?key=k2tfu"],
    addedDate: "2023-11-05",
    assignedTo: {
      id: "a1",
      name: "Carlos Méndez",
      avatar: diverseAvatars,
    },
  },
  {
    id: "4",
    brand: "Kia",
    model: "Sportage",
    year: 2022,
    color: "Rojo",
    vin: "KNDPB3AC8F7123456",
    plate: "D901234",
    price: 1050000,
    status: "in_process",
    mileage: 3500,
    fuelType: "Gasolina",
    transmission: "Automática",
    engineSize: "2.0L",
    doors: 5,
    seats: 5,
    images: ["/placeholder.svg?key=r891d"],
    addedDate: "2023-10-22",
  },
  {
    id: "5",
    brand: "Nissan",
    model: "Sentra",
    year: 2023,
    color: "Azul",
    vin: "3N1AB7AP3FY123456",
    plate: "E567890",
    price: 925000,
    status: "maintenance",
    mileage: 1200,
    fuelType: "Gasolina",
    transmission: "Automática",
    engineSize: "1.8L",
    doors: 4,
    seats: 5,
    images: ["/placeholder.svg?key=m00c3"],
    addedDate: "2023-11-10",
  },
  {
    id: "6",
    brand: "Toyota",
    model: "RAV4",
    year: 2023,
    color: "Plata",
    vin: "JTMWFREV0JD123456",
    plate: "F123456",
    price: 1350000,
    status: "available",
    mileage: 800,
    fuelType: "Gasolina",
    transmission: "Automática",
    engineSize: "2.5L",
    doors: 5,
    seats: 5,
    images: ["/placeholder.svg?key=3bpp8"],
    addedDate: "2023-10-05",
    onSale: true,
    salePrice: 1299000,
  },
  {
    id: "7",
    brand: "Mazda",
    model: "CX-5",
    year: 2022,
    color: "Rojo",
    vin: "JM3KFBDM7N0123456",
    plate: "G789012",
    price: 1150000,
    status: "test_drive",
    mileage: 2500,
    fuelType: "Gasolina",
    transmission: "Automática",
    engineSize: "2.5L",
    doors: 5,
    seats: 5,
    images: ["/placeholder.svg?key=f4vt5"],
    addedDate: "2023-11-02",
    assignedTo: {
      id: "a2",
      name: "María Rodríguez",
      avatar: diverseAvatars,
    },
  },
  {
    id: "8",
    brand: "Honda",
    model: "HR-V",
    year: 2023,
    color: "Blanco",
    vin: "3CZRU5H53PM123456",
    plate: "H345678",
    price: 980000,
    status: "with_offer",
    mileage: 1000,
    fuelType: "Gasolina",
    transmission: "Automática",
    engineSize: "1.8L",
    doors: 5,
    seats: 5,
    images: ["/placeholder.svg?key=k1vin"],
    addedDate: "2023-10-18",
  },
  {
    id: "9",
    brand: "Kia",
    model: "Seltos",
    year: 2023,
    color: "Negro",
    vin: "KNDEU2A29P7123456",
    plate: "I901234",
    price: 890000,
    status: "financing",
    mileage: 1800,
    fuelType: "Gasolina",
    transmission: "Automática",
    engineSize: "2.0L",
    doors: 5,
    seats: 5,
    images: ["/placeholder.svg?key=73t6k"],
    addedDate: "2023-10-30",
  },
  {
    id: "10",
    brand: "Nissan",
    model: "Kicks",
    year: 2022,
    color: "Azul",
    vin: "3N1CP5CU7NL123456",
    plate: "J567890",
    price: 850000,
    status: "pending_delivery",
    mileage: 2200,
    fuelType: "Gasolina",
    transmission: "Automática",
    engineSize: "1.6L",
    doors: 5,
    seats: 5,
    images: ["/placeholder.svg?key=efq3c"],
    addedDate: "2023-11-08",
  },
  {
    id: "11",
    brand: "Volkswagen",
    model: "Golf",
    year: 2022,
    color: "Gris",
    vin: "WVWZZZ1KZCP123456",
    plate: "K123456",
    price: 920000,
    status: "with_contract",
    mileage: 3000,
    fuelType: "Gasolina",
    transmission: "Manual",
    engineSize: "1.4L",
    doors: 5,
    seats: 5,
    images: ["/placeholder.svg?key=nluz3"],
    addedDate: "2023-09-15",
  },
  {
    id: "12",
    brand: "Hyundai",
    model: "Elantra",
    year: 2023,
    color: "Plata",
    vin: "KMHD84LF8PU123456",
    plate: "L789012",
    price: 880000,
    status: "pending_payment",
    mileage: 1500,
    fuelType: "Gasolina",
    transmission: "Automática",
    engineSize: "2.0L",
    doors: 4,
    seats: 5,
    images: ["/placeholder.svg?key=sfz0t"],
    addedDate: "2023-10-25",
  },
];

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
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Get unique values for filter options
  const uniqueBrands = getUniqueValues(vehiclesData, "brand");
  const uniqueColors = getUniqueValues(vehiclesData, "color");
  const uniqueTransmissions = getUniqueValues(vehiclesData, "transmission");
  const uniqueFuelTypes = getUniqueValues(vehiclesData, "fuelType");
  const minYearAvailable = Math.min(...vehiclesData.map((v) => v.year));
  const maxYearAvailable = Math.max(...vehiclesData.map((v) => v.year));
  const minPriceAvailable = Math.min(...vehiclesData.map((v) => v.price));
  const maxPriceAvailable = Math.max(...vehiclesData.map((v) => v.price));

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setVehicles(vehiclesData);
      setFilteredVehicles(vehiclesData);
      setIsLoading(false);

      // Initialize filters with data ranges
      setFilters((prev) => ({
        ...prev,
        minYear: minYearAvailable,
        maxYear: maxYearAvailable,
        minPrice: minPriceAvailable,
        maxPrice: maxPriceAvailable,
      }));
    }, 800);

    return () => clearTimeout(timer);
  }, []);

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
          vehicle.plate.toLowerCase().includes(searchTerm)
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

    // Price filter
    filtered = filtered.filter(
      (vehicle) =>
        vehicle.price >= filters.minPrice && vehicle.price <= filters.maxPrice
    );
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
  }, [filters, vehicles]);

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

    // Simulate API call
    setTimeout(() => {
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleToDelete.id));
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
      setIsDeleting(false);

      toast({
        title: "Vehículo eliminado",
        description: `${vehicleToDelete.brand} ${vehicleToDelete.model} ha sido eliminado correctamente.`,
        variant: "success",
      });
    }, 800);
  };

  const handleBulkDelete = () => {
    if (selectedVehicles.length === 0) return;
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = () => {
    setIsDeleting(true);

    // Simulate API call
    setTimeout(() => {
      setVehicles((prev) =>
        prev.filter((v) => !selectedVehicles.includes(v.id))
      );
      setBulkDeleteDialogOpen(false);
      setSelectedVehicles([]);
      setIsSelectionMode(false);
      setIsDeleting(false);

      toast({
        title: "Vehículos eliminados",
        description: `${selectedVehicles.length} vehículos han sido eliminados correctamente.`,
        variant: "success",
      });
    }, 800);
  };

  // Status change handlers
  const handleStatusChange = () => {
    if (selectedVehicles.length === 0 || newStatus === "") return;

    setIsDeleting(true); // Reuse loading state

    // Simulate API call
    setTimeout(() => {
      setVehicles((prev) =>
        prev.map((v) =>
          selectedVehicles.includes(v.id)
            ? { ...v, status: newStatus as VehicleStatus }
            : v
        )
      );

      setStatusChangeDialogOpen(false);
      setNewStatus("");
      setSelectedVehicles([]);
      setIsSelectionMode(false);
      setIsDeleting(false);

      toast({
        title: "Estado actualizado",
        description: `El estado de ${selectedVehicles.length} vehículos ha sido actualizado correctamente.`,
        variant: "success",
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
            const isNew =
              vehicle.mileage === 0 ||
              vehicle.mileage === undefined ||
              vehicle.mileage < 100;
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
                    className="relative aspect-[4/3] overflow-hidden bg-muted"
                    onClick={(e) =>
                      isSelectionMode && toggleVehicleSelection(vehicle.id, e)
                    }
                  >
                    <img
                      src={vehicle.images[0] || "/placeholder.svg"}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Assigned agent badge */}
                    {vehicle.assignedTo && (
                      <div className="absolute bottom-3 right-3 z-10">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="h-8 w-8 rounded-full bg-background border-2 border-primary overflow-hidden">
                                {vehicle.assignedTo.avatar ? (
                                  <img
                                    src={
                                      vehicle.assignedTo.avatar ||
                                      "/placeholder.svg"
                                    }
                                    alt="vehiculo asignado"
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-xs font-medium">
                                    {vehicle.assignedTo.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </div>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Asignado a: {vehicle.assignedTo.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg leading-tight">
                            {vehicle.brand} {vehicle.model}
                          </h3>
                          {/* Status and condition badges - moved from image overlay to content */}
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
                              {isNew ? "Nuevo" : "Usado"}
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
                                              : undefined,
                                }}
                              ></span>
                              {vehicle.color}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          {vehicle.onSale ? (
                            <div>
                              <p className="text-sm line-through text-muted-foreground">
                                {formatCurrency(vehicle.price)}
                              </p>
                              <p className="font-bold text-lg text-primary">
                                {formatCurrency(vehicle.salePrice!)}
                              </p>
                            </div>
                          ) : (
                            <p className="font-bold text-lg">
                              {formatCurrency(vehicle.price)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Key className="h-3.5 w-3.5" />
                          <span>{vehicle.plate}</span>
                        </div>
                        {vehicle.mileage !== undefined && (
                          <div className="flex items-center gap-1">
                            <Gauge className="h-3.5 w-3.5" />
                            <span>{vehicle.mileage.toLocaleString()} km</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Ingreso:{" "}
                          {vehicle.addedDate
                            ? formatDate(vehicle.addedDate)
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Link>

                <CardFooter className="px-4 py-3 border-t flex justify-between items-center bg-muted/30">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Fuel className="h-3 w-3 text-muted-foreground" />
                      <span>{vehicle.fuelType}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-muted-foreground/30"></div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-3 w-3 text-muted-foreground" />
                      <span>{vehicle.transmission}</span>
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
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                <img
                  src={vehicleToDelete.images[0] || "/placeholder.svg"}
                  alt={`${vehicleToDelete.brand} ${vehicleToDelete.model}`}
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">
                  {vehicleToDelete.brand} {vehicleToDelete.model}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {vehicleToDelete.year} • {vehicleToDelete.plate}
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
