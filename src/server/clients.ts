// src/server/modules/clients.ts
import { z } from "zod/v4";
import { createServerFn } from "@tanstack/react-start";
import { db } from "~/db";
import * as schema from "~/db/schema";
import { eq, asc } from "drizzle-orm";
import { getUser, getUserDealerId } from "./auth";

// Client input schema for validation
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

// Type exports for client-side use
export type CreateClientInput = z.infer<typeof clientInsertSchema>;
