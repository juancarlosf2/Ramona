// src/server/modules/insurance.ts
import { z } from "zod/v4";
import { createServerFn } from "@tanstack/react-start";
import { db } from "~/db";
import * as schema from "~/db/schema";
import { getUser, getUserDealerId } from "./auth";
import { parseCurrencyServer } from "./utils";

// Insurance input schema for validation
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

// Type exports for client-side use
export type CreateInsuranceInput = z.infer<typeof insuranceInsertSchema>;
