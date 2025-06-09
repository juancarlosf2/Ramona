// Type inference from fetchVehicles return type
import type { fetchVehicles, fetchVehicleById } from "~/server/api";

// Infer the Vehicle type from the fetchVehicles function
export type Vehicle = Awaited<ReturnType<typeof fetchVehicles>>[number];
export type VehicleById = Awaited<ReturnType<typeof fetchVehicleById>>;

// Utility type for vehicle status
export type VehicleStatus = Vehicle["status"];

// Utility type for vehicle condition
export type VehicleCondition = Vehicle["condition"];

// Utility types for individual properties
export type VehicleTransmission = Vehicle["transmission"];
export type VehicleFuelType = Vehicle["fuelType"];
