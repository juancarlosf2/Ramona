import { z } from "zod/v4";

export const vehicleFormSchema = z.object({
  // Step 1: General Information
  brand: z.string().min(1, { error: "La marca es requerida" }),
  model: z.string().min(1, { error: "El modelo es requerido" }),
  year: z
    .number()
    .int({ error: "El año debe ser un número entero" })
    .min(1900, { error: "El año debe ser válido" })
    .max(new Date().getFullYear() + 1, {
      error: "El año no puede ser futuro",
    }),
  trim: z.string().optional(),
  vehicleType: z.string().min(1, { error: "El tipo de vehículo es requerido" }),
  color: z.string().min(1, { error: "El color es requerido" }),
  status: z.string().min(1, { error: "El estado es requerido" }),
  condition: z.string().min(1, { error: "La condición es requerida" }),
  images: z.array(z.instanceof(File)).optional().default([]),
  description: z.string().optional(),

  // Step 2: Technical Specifications
  transmission: z.string().min(1, { error: "La transmisión es requerida" }),
  fuelType: z.string().min(1, { error: "El tipo de combustible es requerido" }),
  engineSize: z.string().min(1, { error: "El tamaño del motor es requerido" }),
  plate: z
    .string()
    .max(10, { error: "La placa no puede exceder 10 caracteres" })
    .optional(),
  vin: z
    .string()
    .min(17, { error: "El VIN debe tener 17 caracteres" })
    .max(17, { error: "El VIN debe tener 17 caracteres" }),
  mileage: z.number().optional(),
  doors: z.number().min(1, { error: "El número de puertas es requerido" }),
  seats: z.number().min(1, { error: "El número de asientos es requerido" }),

  // Step 3: Financial and Administrative
  price: z.string().min(1, { error: "El precio es requerido" }),
  hasOffer: z.boolean().default(false),
  offerPrice: z.string().optional(),
  adminStatus: z.string().optional(),
  inMaintenance: z.boolean().default(false),
  entryDate: z.string().datetime({
    error: "La fecha de ingreso debe ser una fecha válida",
  }),

  // Step 4: Associations (Optional)
  clientId: z.string().optional(),
  clientName: z.string().optional(),
  contractId: z.string().optional(),
  concesionarioId: z.string().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;
