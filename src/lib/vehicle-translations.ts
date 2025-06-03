/**
 * Translation dictionary for vehicle technical specifications
 * Maps English values (stored in database) to Spanish display labels
 */

// Transmission types mapping
export const transmissionTranslations = {
  automatic: "Automática",
  manual: "Manual",
  cvt: "CVT",
  dct: "Doble Embrague (DCT)",
} as const;

// Fuel types mapping
export const fuelTypeTranslations = {
  gasoline: "Gasolina",
  diesel: "Diesel",
  electric: "Eléctrico",
  hybrid: "Híbrido",
  plugin_hybrid: "Híbrido Enchufable",
} as const;

// Vehicle condition mapping
export const conditionTranslations = {
  new: "Nuevo",
  used: "Usado",
} as const;

// Vehicle status mapping (for additional completeness)
export const statusTranslations = {
  available: "Disponible",
  reserved: "Reservado",
  in_process: "En proceso de venta",
  financing: "En financiamiento",
  sold: "Vendido",
  unavailable: "No disponible",
  retired: "Retirado",
  preparing: "En preparación",
  pending_delivery: "Entrega pendiente",
  test_drive: "Test drive",
  maintenance: "Mantenimiento",
  administrative: "Gestión admin.",
  with_offer: "Con oferta",
  with_contract: "Con contrato",
  pending_payment: "Pago pendiente",
  completed: "Finalizado",
  importing: "En importación",
} as const;

// Type definitions for better type safety
export type TransmissionType = keyof typeof transmissionTranslations;
export type FuelType = keyof typeof fuelTypeTranslations;
export type ConditionType = keyof typeof conditionTranslations;
export type StatusType = keyof typeof statusTranslations;

/**
 * Utility functions to translate vehicle technical specifications
 */

/**
 * Translates transmission type from English to Spanish
 * @param transmission - English transmission value
 * @returns Spanish translation or original value if not found
 */
export function translateTransmission(transmission: string): string {
  const key = transmission.toLowerCase() as TransmissionType;
  return transmissionTranslations[key] || transmission;
}

/**
 * Translates fuel type from English to Spanish
 * @param fuelType - English fuel type value
 * @returns Spanish translation or original value if not found
 */
export function translateFuelType(fuelType: string): string {
  const key = fuelType.toLowerCase() as FuelType;
  return fuelTypeTranslations[key] || fuelType;
}

/**
 * Translates vehicle condition from English to Spanish
 * @param condition - English condition value
 * @returns Spanish translation or original value if not found
 */
export function translateCondition(condition: string): string {
  const key = condition.toLowerCase() as ConditionType;
  return conditionTranslations[key] || condition;
}

/**
 * Translates vehicle status from English to Spanish
 * @param status - English status value
 * @returns Spanish translation or original value if not found
 */
export function translateStatus(status: string): string {
  const key = status.toLowerCase() as StatusType;
  return statusTranslations[key] || status;
}

/**
 * Comprehensive vehicle translation function
 * Translates multiple vehicle fields at once
 * @param vehicleData - Object containing vehicle fields to translate
 * @returns Object with translated Spanish values
 */
export function translateVehicleFields(vehicleData: {
  transmission?: string;
  fuelType?: string;
  condition?: string;
  status?: string;
}) {
  return {
    transmission: vehicleData.transmission
      ? translateTransmission(vehicleData.transmission)
      : undefined,
    fuelType: vehicleData.fuelType
      ? translateFuelType(vehicleData.fuelType)
      : undefined,
    condition: vehicleData.condition
      ? translateCondition(vehicleData.condition)
      : undefined,
    status: vehicleData.status
      ? translateStatus(vehicleData.status)
      : undefined,
  };
}
