import { z } from "zod";

export const vehicleFormSchema = z.object({
  // Step 1: General Information
  brand: z.string().min(1, "La marca es requerida"),
  model: z.string().min(1, "El modelo es requerido"),
  year: z
    .number()
    .int()
    .min(1900, "El año debe ser válido")
    .max(new Date().getFullYear() + 1, "El año no puede ser futuro"),
  trim: z.string().optional(),
  vehicleType: z.string().min(1, "El tipo de vehículo es requerido"),
  color: z.string().min(1, "El color es requerido"),
  status: z.string().min(1, "El estado es requerido"),
  condition: z.string().min(1, "La condición es requerida"),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),

  // Step 2: Technical Specifications
  transmission: z.string().min(1, "La transmisión es requerida"),
  fuelType: z.string().min(1, "El tipo de combustible es requerido"),
  engineSize: z.string().min(1, "El tamaño del motor es requerido"),
  plate: z.string().optional(),
  vin: z
    .string()
    .min(17, "El VIN debe tener 17 caracteres")
    .max(17, "El VIN debe tener 17 caracteres"),
  mileage: z.number().optional(),
  doors: z.number().min(1, "El número de puertas es requerido"),
  seats: z.number().min(1, "El número de asientos es requerido"),

  // Step 3: Financial and Administrative
  price: z.string().min(1, "El precio es requerido"),
  hasOffer: z.boolean().default(false),
  offerPrice: z.string().optional(),
  adminStatus: z.string().optional(),
  inMaintenance: z.boolean().default(false),
  entryDate: z.string().datetime({
    offset: true,
    message: "La fecha de ingreso es requerida",
  }),
  // .transform((date) => {
  //   console.log("Transforming date:", date);
  //   // Convert date to ISO string if it's a Date object
  //   if (date instanceof Date) {
  //     return date.toISOString();
  //   }
  //   // Otherwise, return the date as is (it should already be a string)
  //   return date;
  // }),

  // Step 4: Associations (Optional)
  clientId: z.string().optional(),
  clientName: z.string().optional(),
  contractId: z.string().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;
