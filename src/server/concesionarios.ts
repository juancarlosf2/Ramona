// src/server/modules/concesionarios.ts
import { z } from "zod/v4";
import { createServerFn } from "@tanstack/react-start";
import { db } from "~/db";
import * as schema from "~/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { getUser, getUserDealerId } from "./auth";

// Concesionario input schema for validation
const concesionarioInsertSchema = z.object({
  name: z.string().min(2, "El nombre del concesionario es requerido").trim(),
  contactName: z.string().min(2, "El nombre del contacto es requerido").trim(),
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
        columns: {
          id: true,
          name: true,
          contactName: true,
          email: true,
          phone: true,
          address: true,
          createdAt: true,
        },
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

// Fetch single concesionario by ID with assigned vehicles
export const fetchConcesionarioById = createServerFn({
  method: "GET",
})
  .validator(
    z.object({
      concesionarioId: z.string().uuid("ID de concesionario inválido"),
    })
  )
  .handler(async ({ data }) => {
    console.log(
      "Server function: fetchConcesionarioById called with ID:",
      data.concesionarioId
    );

    // Auth Check: Only authenticated users can fetch concesionario details
    const user = await getUser();
    if (!user) {
      console.warn(
        "Server function: Unauthorized access to fetchConcesionarioById"
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
      // Query the concesionario with all related data
      const concesionario = await db.query.concesionarios.findFirst({
        where: and(
          eq(schema.concesionarios.id, data.concesionarioId),
          eq(schema.concesionarios.dealerId, dealerId)
        ),
        columns: {
          id: true,
          name: true,
          contactName: true,
          email: true,
          phone: true,
          address: true,
          dealerId: true,
          createdAt: true,
          updatedAt: true,
        },
        with: {
          vehicles: {
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
              condition: true,
              mileage: true,
              entryDate: true,
            },
            orderBy: [asc(schema.vehicles.brand), asc(schema.vehicles.model)],
          },
        },
      });

      if (!concesionario) {
        console.warn(
          `Server function: Concesionario ${data.concesionarioId} not found for dealer ${dealerId}`
        );
        throw new Error("Concesionario no encontrado.");
      }

      console.log(
        `Server function: fetchConcesionarioById found concesionario ${concesionario.id} with ${concesionario.vehicles.length} vehicles`
      );

      return concesionario;
    } catch (error: any) {
      console.error(
        "Server function: Error fetching concesionario by ID:",
        error
      );
      throw new Error("Error al cargar concesionario: " + error.message);
    }
  });

// Create Concesionario
export const createConcesionarioServer = createServerFn({ method: "POST" })
  .validator(concesionarioInsertSchema)
  .handler(async ({ data: concesionarioData }) => {
    console.log(
      "Server function: createConcesionarioServer called with data",
      concesionarioData
    );
    const user = await getUser();
    if (!user) {
      console.warn(
        "Server function: Unauthorized access to createConcesionarioServer"
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
      const insertedConcesionarios = await db
        .insert(schema.concesionarios)
        .values({
          name: concesionarioData.name,
          contactName: concesionarioData.contactName,
          email: concesionarioData.email,
          phone: concesionarioData.phone,
          address: concesionarioData.address,
          dealerId: dealerId, // Add dealerId for multi-tenant support
        })
        .returning();

      if (!insertedConcesionarios || insertedConcesionarios.length === 0) {
        console.error(
          "Server function: Concesionario insertion failed, no rows returned."
        );
        throw new Error(
          "Error al insertar concesionario, no se recibieron datos de vuelta."
        );
      }

      console.log(
        "Server function: createConcesionarioServer successful",
        insertedConcesionarios[0]
      );
      return insertedConcesionarios[0];
    } catch (error: any) {
      console.error("Server function: Error creating concesionario:", error);
      let userFriendlyMessage = "Error desconocido al crear concesionario.";
      if (error.message?.includes("unique constraint")) {
        userFriendlyMessage =
          "Ya existe un concesionario con este nombre. Por favor, verifica los datos.";
      } else {
        userFriendlyMessage = error.message;
      }
      throw new Error(userFriendlyMessage);
    }
  });

// Type exports for client-side use
export type CreateConcesionarioInput = z.infer<
  typeof concesionarioInsertSchema
>;
export type ConcesionarioById = Awaited<
  ReturnType<typeof fetchConcesionarioById>
>;
