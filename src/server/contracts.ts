// src/server/modules/contracts.ts
import { z } from "zod/v4";
import { createServerFn } from "@tanstack/react-start";
import { db } from "~/db";
import * as schema from "~/db/schema";
import { eq, asc } from "drizzle-orm";
import { getUser, getUserDealerId } from "./auth";
import { parseCurrencyServer } from "./utils";

// Contract input schema for validation
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

// Type exports for client-side use
export type CreateContractInput = z.infer<typeof contractInsertSchema>;
