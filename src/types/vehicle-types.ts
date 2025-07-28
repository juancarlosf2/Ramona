// Shared types for server functions without importing the actual functions
export type VehicleData = {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  vin: string;
  plate: string | null;
  price: string;
  status: "available" | "sold" | "reserved" | "in_process" | "maintenance";
  concesionarioId: string | null;
  dealerId: string;
  transmission: string;
  fuelType: string;
  mileage: number | null;
  condition: "new" | "used";
  entryDate: string | null;
  images: string[];
  trim?: string | null;
  vehicleType: string;
  doors: number;
  seats: number;
  description?: string | null;
  hasOffer: boolean;
  offerPrice?: string | null;
  adminStatus?: string | null;
  inMaintenance: boolean;
  concesionario?: {
    id: string;
    name: string;
  } | null;
  contracts?: Array<{
    id: string;
    status: string;
    clientId: string;
  }>;
};

export type VehicleWithDetails = VehicleData & {
  purchasedBy?: {
    id: string;
    name: string;
    amount: number;
    contractDate: string;
    cedula: string;
    email: string;
  } | null;
};

// Vehicle status utility type
export type VehicleStatus = VehicleData["status"];

// For backwards compatibility, export the main types
export type Vehicle = VehicleData;
export type VehicleById = VehicleWithDetails;
