// src/server/api.ts
import { z } from "zod/v4"; // Use Zod v4 for native ISO date support
import { db } from "~/db"; // Import your Drizzle client instance
import * as schema from "~/db/schema"; // Import your Drizzle schema
import { eq, and, asc } from "drizzle-orm"; // Drizzle ORM functions
import { getSupabaseServerClient } from "~/utils/supabase";
import { createServerFn } from "@tanstack/react-start";
import { uploadVehicleImages } from "~/server/uploadthing";

// Server-side helper to get the current user from the session
export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      console.error("Error getting user from Supabase:", error);
      console.log("No authenticated user found");
      return null;
    }

    return data.user;
  } catch (error: any) {
    // If it's a 503 error, log it but don't crash the app
    if (error?.status === 503) {
      console.warn(
        "Supabase auth service temporarily unavailable:",
        error.message
      );
      return null;
    }

    console.error("Error getting user:", error);
    return null;
  }
});

// Helper to get the user's dealerId
async function getUserDealerId() {
  const user = await getUser();
  if (!user) {
    console.log("getUserDealerId: No user found.");
    return null;
  }

  try {
    // Query the profiles table using Drizzle
    const profile = await db.query.profiles.findFirst({
      where: eq(schema.profiles.id, user.id), // Link profile ID to auth.users ID
      columns: { dealerId: true }, // Only fetch the dealerId
    });

    const dealerId = profile?.dealerId;
    console.log(`getUserDealerId for user ${user.id}: ${dealerId}`);
    return dealerId;
  } catch (error) {
    console.error(`getUserDealerId failed for user ${user.id}:`, error);
    return null;
  }
}

// Helper to check if the current user is an admin
async function isAdmin() {
  const user = await getUser(); // Get the server-side user
  if (!user) {
    console.log("isAdmin check: No user found.");
    return false;
  }

  try {
    // Query the profiles table using Drizzle
    const profile = await db.query.profiles.findFirst({
      where: eq(schema.profiles.id, user.id), // Link profile ID to auth.users ID
      columns: { role: true }, // Only fetch the role
    });

    const isUserAdmin = profile?.role === "admin";
    console.log(`isAdmin check for user ${user.id}: ${isUserAdmin}`);
    return isUserAdmin;
  } catch (error) {
    console.error(`isAdmin check failed for user ${user.id}:`, error);
    // Default to not admin if there's an error fetching the profile
    return false;
  }
}

// --- Input Schemas (Zod) for Server Functions ---
// These schemas validate data RECEIVED BY the server function from the client.

// Helper to parse currency strings into numbers on the server
const parseCurrencyServer = (
  value: string | number | null | undefined
): number | null => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return value;
  // Remove non-digit/non-dot characters, handle potential commas as thousands separators
  const cleanedValue = String(value)
    .replace(/[^\d.,]/g, "")
    .replace(",", "."); // Clean and replace comma with dot for float parsing
  const numericValue = parseFloat(cleanedValue);
  return isNaN(numericValue) ? null : numericValue;
};

const clientInsertSchema = z.object({
  cedula: z
    .string()
    .min(11, "La cédula debe tener al menos 11 dígitos")
    .max(13, "Formato de cédula inválido")
    .trim(),
  name: z.string().min(2, "El nombre es requerido").trim(),
  email: z
    .email("Email inválido")
    .optional()
    .nullable()
    .transform((e) => (e === "" ? null : e)), // Handle empty string from form
  phone: z
    .string()
    .optional()
    .nullable()
    .transform((p) => (p === "" ? null : p)), // Handle empty string from form
  address: z.string().min(5, "La dirección es requerida").trim(),
});

// Input schema for Contract Creation Server Function
const contractInsertSchema = z
  .object({
    status: z.enum(["active", "pending", "completed"]).default("pending"),
    clientId: z.uuid("ID de cliente inválido"),
    vehicleId: z.uuid("ID de vehículo inválido"),
    price: z
      .union([z.number().min(0), z.string().min(1)])
      .transform(parseCurrencyServer)
      .nullable()
      .refine((val) => val !== null, { message: "El precio es requerido" }),
    date: z.iso
      .datetime({ offset: true }) // Handle ISO datetime strings with timezone
      .nullable()
      .refine((val) => val !== null, { message: "La fecha es requerida" }),
    financingType: z.enum(["cash", "financing"]),
    downPayment: z
      .union([z.number().min(0), z.string()])
      .optional()
      .nullable()
      .transform(parseCurrencyServer),
    months: z
      .union([z.number().int().min(1), z.string()])
      .optional()
      .nullable()
      .transform((val) => {
        const parsed = parseInt(String(val), 10);
        return isNaN(parsed) ? null : parsed;
      }),
    monthlyPayment: z
      .union([z.number().min(0), z.string()])
      .optional()
      .nullable()
      .transform(parseCurrencyServer),
    notes: z
      .string()
      .optional()
      .nullable()
      .transform((n) => (n === "" ? null : n)),
  })
  .refine(
    (data) => {
      // Additional validation for financing details
      if (data.financingType === "financing") {
        return (
          data.downPayment !== null &&
          data.months !== null &&
          data.months > 0 &&
          data.monthlyPayment !== null
        );
      }
      return true;
    },
    {
      message:
        "Cuota inicial, meses y pago mensual son requeridos para financiamiento",
      path: ["financingDetails"],
    }
  );

const insuranceInsertSchema = z
  .object({
    vehicleId: z.uuid("ID de vehículo inválido"),
    clientId: z
      .uuid("ID de cliente inválido")
      .optional()
      .nullable()
      .transform((id) => (id === "" ? null : id)),
    contractId: z
      .uuid("ID de contrato inválido")
      .optional()
      .nullable()
      .transform((id) => (id === "" ? null : id)),
    startDate: z.iso
      .datetime({ offset: true })
      .transform((val) => new Date(val)) // Handle ISO datetime strings with timezone
      .nullable()
      .refine((val) => val !== null, { message: "Fecha de inicio requerida" }),
    expiryDate: z.iso
      .datetime({ offset: true })
      .transform((val) => new Date(val)) // Handle ISO datetime strings with timezone
      .nullable()
      .refine((val) => val !== null, {
        message: "Fecha de vencimiento requerida",
      }),
    coverageType: z.enum(["motor_transmission", "full", "basic"]),
    coverageDuration: z
      .union([z.number().int().min(1), z.string().min(1)])
      .transform((val) => {
        const parsed = parseInt(String(val), 10);
        return isNaN(parsed) ? null : parsed;
      })
      .nullable()
      .refine((val) => val !== null, {
        message: "Duración de cobertura requerida",
      }),
    premium: z
      .union([z.number().min(0), z.string().min(1)])
      .transform(parseCurrencyServer)
      .nullable()
      .refine((val) => val !== null && val >= 0, {
        message: "Prima requerida",
      }),
    status: z
      .enum(["active", "expiring_soon", "expired", "cancelled"])
      .default("active"),
  })
  .refine(
    (data) => {
      // Additional date validation
      return (
        data.startDate instanceof Date &&
        !isNaN(data.startDate.getTime()) &&
        data.expiryDate instanceof Date &&
        !isNaN(data.expiryDate.getTime())
      );
    },
    { message: "Fechas inválidas", path: ["datesValid"] }
  );

export const vehicleInsertSchema = z.object({
  brand: z.string().min(1, "La marca es requerida").trim(),
  model: z.string().min(1, "El modelo es requerido").trim(),
  year: z
    .union([z.number().int().min(1900).max(2050), z.string().min(4)])
    .transform((val) => {
      const parsed = parseInt(String(val), 10);
      return isNaN(parsed) ? null : parsed;
    })
    .nullable()
    .refine((val) => val !== null, { message: "El año es requerido" }),
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

// Form input schema that accepts File objects for images
export const vehicleFormInputSchema = z.object({
  brand: z.string().min(1, "La marca es requerida").trim(),
  model: z.string().min(1, "El modelo es requerido").trim(),
  year: z
    .union([z.number().int().min(1900).max(2050), z.string().min(4)])
    .transform((val) => {
      const parsed = parseInt(String(val), 10);
      return isNaN(parsed) ? null : parsed;
    })
    .nullable()
    .refine((val) => val !== null, { message: "El año es requerido" }),
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

// --- Server Functions Definitions ---

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

// Fetch Clients
export const fetchClients = createServerFn({ method: "GET" }).handler(
  async () => {
    console.log("Server function: fetchClients called");
    const user = await getUser();
    if (!user) {
      console.warn("Server function: Unauthorized access to fetchClients");
      throw new Error("Unauthorized: User not authenticated.");
    }

    // Get user's dealerId for multi-tenant filtering
    const dealerId = await getUserDealerId();
    if (!dealerId) {
      console.warn("Server function: User has no associated dealer");
      throw new Error("Usuario no tiene concesionario asociado.");
    }

    try {
      const clientsList = await db.query.clients.findMany({
        where: eq(schema.clients.dealerId, dealerId),
        columns: {
          id: true,
          name: true,
          cedula: true,
          email: true,
          dealerId: true,
        },
        orderBy: [asc(schema.clients.name)],
      });
      console.log(
        `Server function: fetchClients found ${clientsList.length} clients for dealer ${dealerId}`
      );
      return clientsList;
    } catch (error: any) {
      console.error("Server function: Error fetching clients:", error);
      throw new Error("Error al cargar clientes: " + error.message);
    }
  }
);

// Fetch Contracts
export const fetchContracts = createServerFn({ method: "GET" }).handler(
  async () => {
    console.log("Server function: fetchContracts called");
    const user = await getUser();
    if (!user) {
      console.warn("Server function: Unauthorized access to fetchContracts");
      throw new Error("Unauthorized: User not authenticated.");
    }

    // Get user's dealerId for multi-tenant filtering
    const dealerId = await getUserDealerId();
    if (!dealerId) {
      console.warn("Server function: User has no associated dealer");
      throw new Error("Usuario no tiene concesionario asociado.");
    }

    try {
      const contractsList = await db.query.contracts.findMany({
        where: eq(schema.contracts.dealerId, dealerId),
        columns: {
          id: true,
          contractNumber: true,
          notes: true,
          clientId: true,
          dealerId: true,
        },
        orderBy: [asc(schema.contracts.contractNumber)],
      });
      console.log(
        `Server function: fetchContracts found ${contractsList.length} contracts for dealer ${dealerId}`
      );
      return contractsList;
    } catch (error: any) {
      console.error("Server function: Error fetching contracts:", error);
      throw new Error("Error al cargar contratos: " + error.message);
    }
  }
);

// Fetch Dealer Info
export const fetchDealerInfo = createServerFn({ method: "GET" }).handler(
  async () => {
    console.log("Server function: fetchDealerInfo called");
    const user = await getUser();
    if (!user) {
      console.warn("Server function: Unauthorized access to fetchDealerInfo");
      throw new Error("Unauthorized: User not authenticated.");
    }

    // Get user's dealerId for multi-tenant filtering
    const dealerId = await getUserDealerId();
    if (!dealerId) {
      console.warn("Server function: User has no associated dealer");
      return null;
    }

    try {
      const dealer = await db.query.dealers.findFirst({
        where: eq(schema.dealers.id, dealerId),
      });

      if (!dealer) {
        console.warn(
          "Server function: No dealer info found for user's dealerId."
        );
        return null;
      }

      console.log("Server function: Dealer info fetched for user's dealer.");
      return dealer;
    } catch (error: any) {
      console.error("Server function: Error fetching dealer info:", error);
      throw new Error(
        "Error al cargar información del concesionario principal: " +
          error.message
      );
    }
  }
);

// Fetch Concesionarios
export const fetchConcesionarios = createServerFn({ method: "GET" }).handler(
  async () => {
    console.log("Server function: fetchConcesionarios called");
    const user = await getUser();
    if (!user) {
      console.warn(
        "Server function: Unauthorized access to fetchConcesionarios"
      );
      throw new Error("Unauthorized: User not authenticated.");
    }

    // Get user's dealerId for multi-tenant filtering
    const dealerId = await getUserDealerId();
    if (!dealerId) {
      console.warn("Server function: User has no associated dealer");
      throw new Error("Usuario no tiene concesionario asociado.");
    }

    try {
      const concesionariosList = await db.query.concesionarios.findMany({
        where: eq(schema.concesionarios.dealerId, dealerId),
        columns: { id: true, name: true },
        orderBy: [asc(schema.concesionarios.name)],
      });
      console.log(
        `Server function: fetchConcesionarios found ${concesionariosList.length} concesionarios for dealer ${dealerId}`
      );
      return concesionariosList;
    } catch (error: any) {
      console.error("Server function: Error fetching concesionarios:", error);
      throw new Error("Error al cargar concesionarios: " + error.message);
    }
  }
);

// Create Client
export const createClientServer = createServerFn({ method: "POST" })
  .validator(clientInsertSchema)
  .handler(async ({ data: clientData }) => {
    console.log(
      "Server function: createClientServer called with data",
      clientData
    );
    const user = await getUser();
    if (!user) {
      console.warn(
        "Server function: Unauthorized access to createClientServer"
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
      const insertedClients = await db
        .insert(schema.clients)
        .values({
          cedula: clientData.cedula,
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          address: clientData.address,
          dealerId: dealerId, // Add dealerId for multi-tenant support
        })
        .returning();

      if (!insertedClients || insertedClients.length === 0) {
        console.error(
          "Server function: Client insertion failed, no rows returned."
        );
        throw new Error(
          "Error al insertar cliente, no se recibieron datos de vuelta."
        );
      }

      console.log(
        "Server function: createClientServer successful",
        insertedClients[0]
      );
      return insertedClients[0];
    } catch (error: any) {
      console.error("Server function: Error creating client:", error);
      let userFriendlyMessage = "Error desconocido al crear cliente.";
      if (error.message?.includes("unique constraint")) {
        userFriendlyMessage =
          "La cédula ingresada ya existe. Por favor, verifica los datos.";
      } else {
        userFriendlyMessage = error.message;
      }
      throw new Error(userFriendlyMessage);
    }
  });

// Create Contract
export const createContractServer = createServerFn({ method: "POST" })
  .validator(contractInsertSchema)
  .handler(async ({ data: contractData }) => {
    console.log(
      "Server function: createContractServer called with data",
      contractData
    );
    const user = await getUser();
    if (!user) {
      console.warn(
        "Server function: Unauthorized access to createContractServer"
      );
      throw new Error("Unauthorized: User not authenticated.");
    }

    // Get user's dealerId for multi-tenant operation
    const dealerId = await getUserDealerId();
    if (!dealerId) {
      console.warn("Server function: User has no associated dealer");
      throw new Error("Usuario no tiene concesionario asociado.");
    }

    // Generate contract number
    const contractNumber = `CTR-${new Date().getFullYear()}-${Date.now()}`;

    try {
      const insertedContracts = await db
        .insert(schema.contracts)
        .values({
          contractNumber: contractNumber,
          status: contractData.status,
          clientId: contractData.clientId,
          vehicleId: contractData.vehicleId,
          price: contractData.price,
          date: contractData.date,
          financingType: contractData.financingType,
          downPayment: contractData.downPayment,
          months: contractData.months,
          monthlyPayment: contractData.monthlyPayment,
          notes: contractData.notes,
          dealerId: dealerId, // Add dealerId for multi-tenant support
        })
        .returning();

      if (!insertedContracts || insertedContracts.length === 0) {
        console.error(
          "Server function: Contract insertion failed, no rows returned."
        );
        throw new Error(
          "Error al insertar contrato, no se recibieron datos de vuelta."
        );
      }

      console.log(
        "Server function: createContractServer successful",
        insertedContracts[0]
      );
      return insertedContracts[0];
    } catch (error: any) {
      console.error("Server function: Error creating contract:", error);
      let userFriendlyMessage = "Error desconocido al crear contrato.";
      if (error.message?.includes("unique constraint")) {
        userFriendlyMessage =
          "Conflicto al generar el número de contrato. Por favor, inténtalo de nuevo.";
      } else if (error.message?.includes("foreign key constraint")) {
        userFriendlyMessage =
          "Cliente o vehículo seleccionado(s) no son válidos.";
      } else {
        userFriendlyMessage = error.message;
      }
      throw new Error(userFriendlyMessage);
    }
  });

// Create Insurance
export const createInsuranceServer = createServerFn({ method: "POST" })
  .validator(insuranceInsertSchema)
  .handler(async ({ data: insuranceData }) => {
    console.log(
      "Server function: createInsuranceServer called with data",
      insuranceData
    );
    const user = await getUser();
    if (!user) {
      console.warn(
        "Server function: Unauthorized access to createInsuranceServer"
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
      const insertedInsurance = await db
        .insert(schema.insurance)
        .values({
          vehicleId: insuranceData.vehicleId,
          clientId: insuranceData.clientId,
          contractId: insuranceData.contractId,
          startDate: insuranceData.startDate,
          expiryDate: insuranceData.expiryDate,
          coverageType: insuranceData.coverageType,
          coverageDuration: insuranceData.coverageDuration,
          premium: insuranceData.premium,
          status: insuranceData.status,
          dealerId: dealerId, // Add dealerId for multi-tenant support
        })
        .returning();

      if (!insertedInsurance || insertedInsurance.length === 0) {
        console.error(
          "Server function: Insurance insertion failed, no rows returned."
        );
        throw new Error(
          "Error al insertar seguro, no se recibieron datos de vuelta."
        );
      }

      console.log(
        "Server function: createInsuranceServer successful",
        insertedInsurance[0]
      );
      return insertedInsurance[0];
    } catch (error: any) {
      console.error("Server function: Error creating insurance:", error);
      let userFriendlyMessage = "Error desconocido al crear seguro.";
      if (error.message?.includes("foreign key constraint")) {
        userFriendlyMessage =
          "Vehículo, cliente o contrato seleccionado(s) no son válidos.";
      } else {
        userFriendlyMessage = error.message;
      }
      throw new Error(userFriendlyMessage);
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
        // Upload images if any are provided (optimized with Promise.all)
        (async (): Promise<string[]> => {
          if (!vehicleData.images || vehicleData.images.length === 0) {
            return [];
          }

          console.log(
            `Converting and uploading ${vehicleData.images.length} images...`
          );

          // Convert base64 images to File objects in parallel
          const fileConversionPromises = vehicleData.images.map(
            async (imageData, index) => {
              try {
                // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
                const base64Data = imageData.data.includes(",")
                  ? imageData.data.split(",")[1]
                  : imageData.data;

                // Convert base64 to Uint8Array (this is CPU intensive, so we parallelize it)
                const byteArray = Uint8Array.from(atob(base64Data), (c) =>
                  c.charCodeAt(0)
                );

                // Create File object
                const file = new File([byteArray], imageData.name, {
                  type: imageData.type,
                });

                return file;
              } catch (error) {
                console.error(
                  `Error converting image ${index + 1} (${imageData.name}):`,
                  error
                );
                throw new Error(`Error procesando imagen ${imageData.name}`);
              }
            }
          );

          // Wait for all file conversions to complete in parallel
          const fileObjects = await Promise.all(fileConversionPromises);
          console.log(
            `Successfully converted ${fileObjects.length} images to File objects`
          );

          // Upload all files in parallel
          const urls = await uploadVehicleImages(fileObjects);
          console.log(`Successfully uploaded ${urls.length} images`);
          return urls;
        })(),
      ]);

      // Insert vehicle with uploaded image URLs
      const insertedVehicles = await db
        .insert(schema.vehicles)
        .values({
          ...vehicleInsertData,
          images: imageUrls, // Use uploaded image URLs
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

// Fetch user's profile
export const fetchMyProfile = createServerFn({ method: "GET" }).handler(
  async () => {
    console.log("Server function: fetchMyProfile called");
    const user = await getUser();
    if (!user) {
      console.warn("Server function: fetchMyProfile Unauthorized");
      return null;
    }
    try {
      const profile = await db.query.profiles.findFirst({
        where: eq(schema.profiles.id, user.id),
        with: {
          dealer: {
            columns: { id: true, businessName: true },
          },
        },
      });
      console.log(
        `Server function: fetchMyProfile found profile for user ${user.id}`
      );
      return profile;
    } catch (error: any) {
      console.error("Server function: Error fetching my profile:", error);
      throw new Error("Error al cargar perfil de usuario: " + error.message);
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

// Type exports for client-side use
export type CreateClientInput = z.infer<typeof clientInsertSchema>;
export type CreateContractInput = z.infer<typeof contractInsertSchema>;
export type CreateInsuranceInput = z.infer<typeof insuranceInsertSchema>;
export type CreateVehicleInput = z.infer<typeof vehicleInsertSchema>;
export type CreateVehicleFormInput = z.infer<typeof vehicleFormInputSchema>;
export type UpdateVehicleInput = z.infer<
  typeof vehicleUpdateSchema
>["updateData"];
