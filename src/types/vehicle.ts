// Type inference from shared types instead of server functions
export type { Vehicle, VehicleById, VehicleStatus } from "./vehicle-types";
import type { Vehicle } from "./vehicle-types";

// Utility types for vehicle properties
export type VehicleCondition = Vehicle["condition"];

// Utility types for vehicle transmission and fuel
export type VehicleTransmission = Vehicle["transmission"];
export type VehicleFuelType = Vehicle["fuelType"];
