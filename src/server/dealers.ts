// src/server/modules/dealers.ts
import { createServerFn } from "@tanstack/react-start";
import { db } from "~/db";
import * as schema from "~/db/schema";
import { eq } from "drizzle-orm";
import { getUser, getUserDealerId } from "./auth";

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
