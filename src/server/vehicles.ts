// src/server/modules/vehicles.ts
import { z } from "zod/v4";
import { createServerFn } from "@tanstack/react-start";
import { db } from "~/db";
import * as schema from "~/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { getUser, getUserDealerId, isAdmin } from "./auth";
import { parseCurrencyServer } from "./utils";
import { uploadVehicleImages } from "~/server/uploadthing";

// Vehicle input schema for validation (conforms to database schema)
export const vehicleInsertSchema = z.object({
  brand: z.string().min(1, "La marca es requerida").trim(),
  model: z.string().min(1, "El modelo es requerido").trim(),
  year: z
    .union([z.number().int().min(1900).max(2050), z.string().min(4)])
    .transform((val) => {
      const parsed = parseInt(String(val), 10);
      if (isNaN(parsed)) throw new Error("El año debe ser un número válido");
      return parsed;
    }),
  trim: z
    .string()
    .optional()
    .nullable()
    .transform((t) => (t === "" ? null : t)),
  vehicleType: z.string().min(1, "El tipo de vehículo es requerido").trim(),
  color: z.string().min(1, "El color es requerido").trim(),
  status: z
    .enum(["available", "sold", "reserved", "in_process", "maintenance"])
    .default("available"),
  condition: z.enum(["new", "used"]).default("new"),
  images: z.array(z.string()).optional().default([]),
  description: z
    .string()
    .optional()
    .nullable()
    .transform((d) => (d === "" ? null : d)),
  transmission: z.string().min(1, "La transmisión es requerida").trim(),
  fuelType: z.string().min(1, "El tipo de combustible es requerido").trim(),
  engineSize: z.string().min(1, "El tamaño del motor es requerido").trim(),
  plate: z
    .string()
    .max(10, "La placa no puede exceder 10 caracteres")
    .optional()
    .nullable()
    .transform((p) => (p === "" ? null : p)),
  vin: z
    .string()
    .min(17, "El VIN debe tener 17 caracteres")
    .max(17, "El VIN debe tener 17 caracteres")
    .trim(),
  mileage: z
    .union([z.number().int().min(0), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === null || val === undefined || val === "") return null;
      const parsed = parseInt(String(val), 10);
      return isNaN(parsed) ? null : parsed;
    }),
  doors: z
    .union([z.number().int().min(1), z.string().min(1)])
    .transform((val) => {
      const parsed = parseInt(String(val), 10);
      if (isNaN(parsed))
        throw new Error("El número de puertas debe ser válido");
      return parsed;
    }),
  seats: z
    .union([z.number().int().min(1), z.string().min(1)])
    .transform((val) => {
      const parsed = parseInt(String(val), 10);
      if (isNaN(parsed))
        throw new Error("El número de asientos debe ser válido");
      return parsed;
    }),
  price: z.union([z.number().min(0), z.string().min(1)]).transform((val) => {
    const parsed = parseCurrencyServer(val);
    if (parsed === null || parsed <= 0)
      throw new Error("El precio debe ser mayor a 0");
    return parsed;
  }),
  hasOffer: z.boolean().default(false),
  offerPrice: z
    .union([z.number().min(0), z.string()])
    .optional()
    .nullable()
    .transform(parseCurrencyServer),
  adminStatus: z
    .string()
    .optional()
    .nullable()
    .transform((s) => (s === "" ? null : s)),
  inMaintenance: z.boolean().default(false),
  entryDate: z
    .string()
    .optional()
    .nullable()
    .transform((d) => (d === "" ? null : d)),
  concesionarioId: z
    .uuid("ID de concesionario inválido")
    .optional()
    .nullable()
    .transform((id) => (id === "" ? null : id)),
});

// Form input schema that accepts File objects for images
export const vehicleFormInputSchema = z.object({
  brand: z.string().min(1, "La marca es requerida").trim(),
  model: z.string().min(1, "El modelo es requerido").trim(),
  year: z
    .union([z.number().int().min(1900).max(2050), z.string().min(4)])
    .transform((val) => {
      const parsed = parseInt(String(val), 10);
      if (isNaN(parsed)) throw new Error("El año debe ser un número válido");
      return parsed;
    }),
  trim: z
    .string()
    .optional()
    .nullable()
    .transform((t) => (t === "" ? null : t)),
  vehicleType: z.string().min(1, "El tipo de vehículo es requerido").trim(),
  color: z.string().min(1, "El color es requerido").trim(),
  status: z
    .enum(["available", "sold", "reserved", "in_process", "maintenance"])
    .default("available"),
  condition: z.enum(["new", "used"]).default("new"),
  images: z
    .array(
      z.object({
        data: z.string(), // base64 encoded file data
        name: z.string(), // file name
        type: z.string(), // mime type
        size: z.number(), // file size
      })
    )
    .optional()
    .default([]), // Accept base64 encoded file objects
  description: z
    .string()
    .optional()
    .nullable()
    .transform((d) => (d === "" ? null : d)),
  transmission: z.string().min(1, "La transmisión es requerida").trim(),
  fuelType: z.string().min(1, "El tipo de combustible es requerido").trim(),
  engineSize: z.string().min(1, "El tamaño del motor es requerido").trim(),
  plate: z
    .string()
    .max(10, "La placa no puede exceder 10 caracteres")
    .optional()
    .nullable()
    .transform((p) => (p === "" ? null : p)),
  vin: z
    .string()
    .min(17, "El VIN debe tener 17 caracteres")
    .max(17, "El VIN debe tener 17 caracteres")
    .trim(),
  mileage: z
    .union([z.number().int().min(0), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === null || val === undefined || val === "") return null;
      const parsed = parseInt(String(val), 10);
      return isNaN(parsed) ? null : parsed;
    }),
  doors: z
    .union([z.number().int().min(1), z.string().min(1)])
    .transform((val) => {
      const parsed = parseInt(String(val), 10);
      return isNaN(parsed) ? null : parsed;
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "El número de puertas es requerido",
    }),
  seats: z
    .union([z.number().int().min(1), z.string().min(1)])
    .transform((val) => {
      const parsed = parseInt(String(val), 10);
      return isNaN(parsed) ? null : parsed;
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "El número de asientos es requerido",
    }),
  price: z
    .union([z.number().min(0), z.string().min(1)])
    .transform(parseCurrencyServer)
    .nullable()
    .refine((val) => val !== null && val > 0, {
      message: "El precio es requerido",
    }),
  hasOffer: z.boolean().default(false),
  offerPrice: z
    .union([z.number().min(0), z.string()])
    .optional()
    .nullable()
    .transform(parseCurrencyServer),
  adminStatus: z
    .string()
    .optional()
    .nullable()
    .transform((s) => (s === "" ? null : s)),
  inMaintenance: z.boolean().default(false),
  entryDate: z.iso.datetime({ offset: true }).optional().nullable(),
  concesionarioId: z
    .uuid("ID de concesionario inválido")
    .optional()
    .nullable()
    .transform((id) => (id === "" ? null : id)),
});

// Vehicle update schema
const vehicleUpdateSchema = z.object({
  vehicleId: z.uuid("ID de vehículo inválido"),
  updateData: z
    .object({
      concesionarioId: z
        .uuid("ID de concesionario inválido")
        .optional()
        .nullable()
        .transform((id) => (id === "" ? null : id)),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "No se proporcionaron campos para actualizar",
    }),
});

// Fetch Vehicles
export const fetchVehicles = createServerFn({ method: "GET" }).handler(
  async () => {
    console.log("Server function: fetchVehicles called");
    // Auth Check: Only authenticated users can fetch vehicles
    const user = await getUser();
    if (!user) {
      console.warn("Server function: Unauthorized access to fetchVehicles");
      throw new Error("Unauthorized: User not authenticated.");
    }

    // Get user's dealerId for multi-tenant filtering
    const dealerId = await getUserDealerId();
    if (!dealerId) {
      console.warn("Server function: User has no associated dealer");
      throw new Error("Usuario no tiene concesionario asociado.");
    }

    try {
      // Use Drizzle to query vehicles, joining with concesionarios and contracts, filtered by dealerId
      const vehiclesList = await db.query.vehicles.findMany({
        where: eq(schema.vehicles.dealerId, dealerId),
        columns: {
          id: true,
          brand: true,
          model: true,
          year: true,
          color: true,
          vin: true,
          plate: true,
          price: true,
          status: true,
          concesionarioId: true,
          dealerId: true,
          transmission: true,
          fuelType: true,
          mileage: true,
          condition: true,
          entryDate: true,
          images: true,
        },
        with: {
          concesionario: {
            columns: { id: true, name: true },
          },
          contracts: {
            columns: { id: true, status: true, clientId: true },
          },
        },
        orderBy: [asc(schema.vehicles.brand), asc(schema.vehicles.model)],
      });

      console.log(
        `Server function: fetchVehicles found ${vehiclesList.length} vehicles for dealer ${dealerId}`
      );
      return vehiclesList;
    } catch (error: any) {
      console.error("Server function: Error fetching vehicles:", error);
      throw new Error("Error al cargar vehículos: " + error.message);
    }
  }
);

// Fetch single vehicle by ID with purchasedBy information
export const fetchVehicleById = createServerFn({
  method: "GET",
})
  .validator(
    z.object({
      vehicleId: z.string().uuid("ID de vehículo inválido"),
    })
  )
  .handler(async ({ data }) => {
    console.log(
      "Server function: fetchVehicleById called with ID:",
      data.vehicleId
    );

    // Auth Check: Only authenticated users can fetch vehicle details
    const user = await getUser();
    if (!user) {
      console.warn("Server function: Unauthorized access to fetchVehicleById");
      throw new Error("Unauthorized: User not authenticated.");
    }

    // Get user's dealerId for multi-tenant filtering
    const dealerId = await getUserDealerId();
    if (!dealerId) {
      console.warn("Server function: User has no associated dealer");
      throw new Error("Usuario no tiene concesionario asociado.");
    }

    try {
      // Query the vehicle with all related data
      const vehicle = await db.query.vehicles.findFirst({
        where: and(
          eq(schema.vehicles.id, data.vehicleId),
          eq(schema.vehicles.dealerId, dealerId)
        ),
        columns: {
          id: true,
          brand: true,
          model: true,
          year: true,
          trim: true,
          color: true,
          vin: true,
          plate: true,
          price: true,
          status: true,
          condition: true,
          mileage: true,
          fuelType: true,
          transmission: true,
          engineSize: true,
          doors: true,
          seats: true,
          description: true,
          concesionarioId: true,
          dealerId: true,
          entryDate: true,
          images: true,
          vehicleType: true,
          hasOffer: true,
          offerPrice: true,
          adminStatus: true,
          inMaintenance: true,
        },
        with: {
          concesionario: {
            columns: { id: true, name: true },
          },
          contracts: {
            columns: {
              id: true,
              status: true,
              clientId: true,
              price: true,
              date: true,
            },
            with: {
              client: {
                columns: {
                  id: true,
                  name: true,
                  cedula: true,
                  email: true,
                },
              },
            },
            where: eq(schema.contracts.status, "completed"), // Only get completed contracts
          },
        },
      });

      if (!vehicle) {
        console.warn(
          `Server function: Vehicle ${data.vehicleId} not found for dealer ${dealerId}`
        );
        throw new Error("Vehículo no encontrado.");
      }

      // Process the purchasedBy information from contracts
      let purchasedBy = null;
      if (vehicle.contracts && vehicle.contracts.length > 0) {
        // Find the most recent completed contract
        const completedContract = vehicle.contracts
          .filter(
            (contract) => contract.status === "completed" && contract.client
          )
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0];

        if (completedContract && completedContract.client) {
          purchasedBy = {
            id: completedContract.client.id,
            name: completedContract.client.name,
            amount: Number(completedContract.price) || 0,
            contractDate: completedContract.date,
            cedula: completedContract.client.cedula,
            email: completedContract.client.email,
          };
        }
      }

      // Return vehicle with purchasedBy information
      const vehicleWithPurchasedBy = {
        ...vehicle,
        purchasedBy,
      };

      console.log(
        `Server function: fetchVehicleById found vehicle ${vehicle.id} with purchasedBy:`,
        purchasedBy ? `${purchasedBy.name} (${purchasedBy.cedula})` : "none"
      );

      return vehicleWithPurchasedBy;
    } catch (error: any) {
      console.error("Server function: Error fetching vehicle by ID:", error);
      throw new Error("Error al cargar vehículo: " + error.message);
    }
  });

// Create Vehicle with File Upload Support
export const createVehicleServer = createServerFn({ method: "POST" })
  .validator(vehicleFormInputSchema)
  .handler(async ({ data: vehicleData }) => {
    console.log("Server function: createVehicleServer called");
    console.log("Images count:", vehicleData.images?.length || 0);

    const user = await getUser();
    if (!user) {
      console.warn(
        "Server function: Unauthorized access to createVehicleServer"
      );
      throw new Error("Unauthorized: User not authenticated.");
    }

    // Get user's dealerId for multi-tenant operation
    const dealerId = await getUserDealerId();
    if (!dealerId) {
      console.warn("Server function: User has no associated dealer");
      throw new Error("Usuario no tiene concesionario asociado.");
    }

    try {
      // Prepare database insert data first (can be done in parallel with image processing)
      const prepareVehicleData = async () => ({
        brand: vehicleData.brand,
        model: vehicleData.model,
        year: vehicleData.year,
        trim: vehicleData.trim,
        vehicleType: vehicleData.vehicleType,
        color: vehicleData.color,
        status: vehicleData.status,
        condition: vehicleData.condition,
        description: vehicleData.description,
        transmission: vehicleData.transmission,
        fuelType: vehicleData.fuelType,
        engineSize: vehicleData.engineSize,
        plate: vehicleData.plate,
        vin: vehicleData.vin,
        mileage: vehicleData.mileage,
        doors: vehicleData.doors,
        seats: vehicleData.seats,
        price: vehicleData.price,
        hasOffer: vehicleData.hasOffer,
        offerPrice: vehicleData.offerPrice,
        adminStatus: vehicleData.adminStatus,
        inMaintenance: vehicleData.inMaintenance,
        entryDate: vehicleData.entryDate,
        concesionarioId: vehicleData.concesionarioId,
        dealerId: dealerId, // Add dealerId for multi-tenant support
      });

      // Process images and prepare data in parallel
      const [vehicleInsertData, imageUrls] = await Promise.all([
        prepareVehicleData(),
        // Upload images if any are provided (temporarily disabled for server compatibility)
        (async (): Promise<string[]> => {
          if (!vehicleData.images || vehicleData.images.length === 0) {
            return [];
          }

          console.log(
            `Image upload temporarily disabled - ${vehicleData.images.length} images received but not processed`
          );

          // TODO: Implement proper server-side image upload
          // For now, return empty array to prevent server errors
          return [];
        })(),
      ]);

      // Insert vehicle with uploaded image URLs
      const insertedVehicles = await db
        .insert(schema.vehicles)
        .values({
          brand: vehicleInsertData.brand,
          model: vehicleInsertData.model,
          year: vehicleInsertData.year!,
          trim: vehicleInsertData.trim,
          vehicleType: vehicleInsertData.vehicleType,
          color: vehicleInsertData.color,
          status: vehicleInsertData.status,
          condition: vehicleInsertData.condition,
          images: imageUrls,
          description: vehicleInsertData.description,
          transmission: vehicleInsertData.transmission,
          fuelType: vehicleInsertData.fuelType,
          engineSize: vehicleInsertData.engineSize,
          plate: vehicleInsertData.plate,
          vin: vehicleInsertData.vin,
          mileage: vehicleInsertData.mileage,
          doors: vehicleInsertData.doors!,
          seats: vehicleInsertData.seats!,
          price: vehicleInsertData.price!.toString(),
          hasOffer: vehicleInsertData.hasOffer,
          offerPrice: vehicleInsertData.offerPrice?.toString() || null,
          adminStatus: vehicleInsertData.adminStatus,
          inMaintenance: vehicleInsertData.inMaintenance,
          entryDate: vehicleInsertData.entryDate,
          concesionarioId: vehicleInsertData.concesionarioId,
          dealerId: dealerId,
        })
        .returning();

      if (!insertedVehicles || insertedVehicles.length === 0) {
        console.error(
          "Server function: Vehicle insertion failed, no rows returned."
        );
        throw new Error(
          "Error al insertar vehículo, no se recibieron datos de vuelta."
        );
      }

      console.log(
        "Server function: createVehicleServer successful",
        insertedVehicles[0]
      );
      return insertedVehicles[0];
    } catch (error: any) {
      console.error("Server function: Error creating vehicle:", error);
      let userFriendlyMessage = "Error desconocido al crear vehículo.";
      if (error.message?.includes("unique constraint")) {
        if (error.message?.includes("vin")) {
          userFriendlyMessage =
            "El VIN ingresado ya existe. Por favor, verifica los datos.";
        } else if (error.message?.includes("plate")) {
          userFriendlyMessage =
            "La placa ingresada ya existe. Por favor, verifica los datos.";
        } else {
          userFriendlyMessage =
            "Ya existe un vehículo con estos datos. Por favor, verifica la información.";
        }
      } else if (error.message?.includes("foreign key constraint")) {
        userFriendlyMessage = "Concesionario seleccionado no es válido.";
      } else {
        userFriendlyMessage = error.message;
      }
      throw new Error(userFriendlyMessage);
    }
  });

// Update Vehicle (for consignment management)
export const updateVehicleServer = createServerFn({ method: "POST" })
  .validator(vehicleUpdateSchema)
  .handler(async ({ data: updatePayload }) => {
    console.log(
      "Server function: updateVehicleServer called with data",
      updatePayload
    );
    const user = await getUser();
    if (!user) {
      console.warn(
        "Server function: Unauthorized access to updateVehicleServer"
      );
      throw new Error("Unauthorized: User not authenticated.");
    }

    const vehicleId = updatePayload.vehicleId;
    const dataToUpdate = updatePayload.updateData;

    // Authorization Check: Only administrators can update vehicle consignment
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
      console.warn(
        `Server function: User ${user.id} attempted unauthorized vehicle update.`
      );
      throw new Error(
        "No autorizado: Solo los administradores pueden actualizar la información del vehículo."
      );
    }

    // Get user's dealerId for multi-tenant validation
    const dealerId = await getUserDealerId();
    if (!dealerId) {
      console.warn("Server function: User has no associated dealer");
      throw new Error("Usuario no tiene concesionario asociado.");
    }

    try {
      // First, verify the vehicle belongs to the user's dealer
      const existingVehicle = await db.query.vehicles.findFirst({
        where: and(
          eq(schema.vehicles.id, vehicleId),
          eq(schema.vehicles.dealerId, dealerId)
        ),
      });

      if (!existingVehicle) {
        throw new Error(
          "Vehículo no encontrado o no pertenece a su concesionario."
        );
      }

      const updatedVehicles = await db
        .update(schema.vehicles)
        .set({
          ...dataToUpdate,
          updatedAt: new Date(),
        })
        .where(eq(schema.vehicles.id, vehicleId))
        .returning();

      if (!updatedVehicles || updatedVehicles.length === 0) {
        const existingVehicle = await db.query.vehicles.findFirst({
          where: eq(schema.vehicles.id, vehicleId),
        });
        if (existingVehicle) {
          throw new Error(
            "Error al actualizar el vehículo. Verifica permisos o datos."
          );
        } else {
          throw new Error("Vehículo no encontrado.");
        }
      }

      console.log(
        "Server function: updateVehicleServer successful",
        updatedVehicles[0]
      );
      return updatedVehicles[0];
    } catch (error: any) {
      console.error("Server function: Error updating vehicle:", error);
      let userFriendlyMessage = "Error desconocido al actualizar el vehículo.";
      if (error.message?.includes("foreign key constraint")) {
        userFriendlyMessage =
          "Valor inválido para la asignación (concesionario no válido).";
      } else if (error.message?.includes("Unauthorized:")) {
        userFriendlyMessage = error.message;
      } else {
        userFriendlyMessage = error.message;
      }
      throw new Error(userFriendlyMessage);
    }
  });

// Type exports for client-side use
export type CreateVehicleInput = z.infer<typeof vehicleInsertSchema>;
export type CreateVehicleFormInput = z.infer<typeof vehicleFormInputSchema>;
export type UpdateVehicleInput = z.infer<
  typeof vehicleUpdateSchema
>["updateData"];
