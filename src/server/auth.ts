// src/server/modules/auth.ts
import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "~/utils/supabase";
import { db } from "~/db";
import * as schema from "~/db/schema";
import { eq } from "drizzle-orm";

// Server-side helper to get the current user from the session
export async function getUser() {
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
}

// Helper to get the user's dealerId
export async function getUserDealerId() {
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
export async function isAdmin() {
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
