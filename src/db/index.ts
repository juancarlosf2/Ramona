// src/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema"; // Import your Drizzle schema definitions

// Prevent this from running on the client side
if (typeof window !== "undefined") {
  throw new Error("Database client should not be imported on the client side");
}

// Access the secure server environment variable for the database URL
const databaseUrl = process.env.DATABASE_URL; // Use the variable name you configured

if (!databaseUrl) {
  // Crash the application startup if the critical DB URL is missing
  throw new Error(
    "FATAL ERROR: DATABASE_URL environment variable is not set. Cannot connect to database."
  );
}

// Create a new postgres client instance
const client = postgres(databaseUrl, {
  prepare: false,
  // Add SSL options if needed for production: ssl: { rejectUnauthorized: true },
});

// Create the Drizzle ORM client instance
export const db = drizzle(client, { schema });

// Optional: Export client if manual connection management is needed later
export { client };
