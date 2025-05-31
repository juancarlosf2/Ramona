import { z } from "zod";

export const vehicleFormSchema = z.object({
  // Step 1: General Information
  brand: z.string().min(1, { message: "La marca es requerida" }),
  model: z.string().min(1, { message: "El modelo es requerido" }),
  year: z
    .number()
    .int({ message: "El año debe ser un número entero" })
    .min(1900, { message: "El año debe ser válido" })
    .max(new Date().getFullYear() + 1, {
      message: "El año no puede ser futuro",
    }),
  trim: z.string().optional(),
  vehicleType: z
    .string()
    .min(1, { message: "El tipo de vehículo es requerido" }),
  color: z.string().min(1, { message: "El color es requerido" }),
  status: z.string().min(1, { message: "El estado es requerido" }),
  condition: z.string().min(1, { message: "La condición es requerida" }),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),

  // Step 2: Technical Specifications
  transmission: z.string().min(1, { message: "La transmisión es requerida" }),
  fuelType: z
    .string()
    .min(1, { message: "El tipo de combustible es requerido" }),
  engineSize: z
    .string()
    .min(1, { message: "El tamaño del motor es requerido" }),
  plate: z.string().optional(),
  vin: z
    .string()
    .min(17, { message: "El VIN debe tener 17 caracteres" })
    .max(17, { message: "El VIN debe tener 17 caracteres" }),
  mileage: z.number().optional(),
  doors: z.number().min(1, { message: "El número de puertas es requerido" }),
  seats: z.number().min(1, { message: "El número de asientos es requerido" }),

  // Step 3: Financial and Administrative
  price: z.string().min(1, { message: "El precio es requerido" }),
  hasOffer: z.boolean().default(false),
  offerPrice: z.string().optional(),
  adminStatus: z.string().optional(),
  inMaintenance: z.boolean().default(false),
  entryDate: z.string().datetime({
    message: "La fecha de ingreso debe ser una fecha válida",
  }),

  // Step 4: Associations (Optional)
  clientId: z.string().optional(),
  clientName: z.string().optional(),
  contractId: z.string().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;
