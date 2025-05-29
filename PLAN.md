# Project Plan: Full-Stack Integration with Drizzle ORM, Server Functions, Supabase Auth & Database

## Goal

Implement a robust data layer using Drizzle ORM within `@tanstack/start` Server Functions for all database interactions. Design and integrate new entities (`dealers`, `concesionarios`, `profiles`), linking user profiles to dealers and enforcing role-based access (specifically for dealer information updates) via server-side logic and Supabase RLS. Build out frontend forms and consignment management UI leveraging `@tanstack/react-query` hooks that call these server functions.

## Scope

- Define the complete Drizzle schema for all tables: `clients`, `vehicles`, `contracts`, `insurance`, `dealers`, `concesionarios`, `profiles`.
- Generate and apply database migrations based on the Drizzle schema.
- Implement comprehensive RLS policies for all tables in Supabase, utilizing `auth.uid()` and user roles stored in the `profiles` table for fine-grained access control (especially for `dealers` and potentially `concesionarios`/`vehicles`).
- Set up the Drizzle ORM client to connect to the Supabase database **server-side**.
- Create `@tanstack/start` Server Functions (RPC endpoints) for all necessary database operations: fetching data lists, creating records, and updating records (including vehicle consignment status).
- Implement server-side logic within Server Functions for input validation (using Zod), authentication checks (is user logged in?), and authorization checks (e.g., is user an 'admin'?).
- Modify existing `@tanstack/react-query` hooks (`useFetch*`, `useCreate*`, `useUpdate*`) or create new ones, ensuring they call the corresponding Server Functions instead of using the Supabase client directly for database queries/mutations.
- Update the React frontend components (`clients/new.tsx`, `contracts/new.tsx`, `insurance/new.tsx`) to use the modified React Query hooks for fetching dropdown data and submitting forms.
- Update the Contract creation form (`src/routes/_authed/contracts/new.tsx`) to fetch and display the main `dealer`'s information in the contract preview section.
- Design and implement a **new dedicated UI** (a page) for Consignment Management (`admin/consignments.tsx`), allowing administrators to assign or unassign a `Concesionario` to/from a `Vehicle` using the relevant hooks calling Server Functions.
- Ensure serializable data and errors are handled correctly between client and server functions.
- The client-side `@supabase/supabase-js` client will _only_ be used for managing the user's authentication state (login/logout, getting session).

## Technology Stack

- Frontend: React, TanStack Router, React Hook Form, Zod, Shadcn UI components, **@tanstack/react-query**
- Backend/Database Interaction: **Drizzle ORM**, `@tanstack/start` **Server Functions** (`createServerFunction`), Supabase (PostgreSQL Database, Authentication, RLS)
- Authentication State (Client): Supabase Client (`@supabase/supabase-js`)

## Assumptions

- Supabase project is created, accessible, and configured for Authentication and Database.
- Supabase Authentication is enabled and used for user login/session management.
- `@tanstack/start` is set up in the project with Server Function capabilities (`createServerFunction`).
- Drizzle ORM is set up in the project:
  - Necessary Drizzle libraries (`drizzle-orm`, a database driver like `pg`, `postgres-js`, or `@neondatabase/serverless`, `drizzle-kit`) are installed.
  - Drizzle configuration file (`drizzle.config.ts`) exists and points to your Supabase database connection string (available securely as a server environment variable).
  - A Drizzle schema file (e.g., `src/db/schema.ts`) is ready to define table structures.
  - Database migrations can be generated and applied using Drizzle Kit commands (`drizzle-kit generate`, `drizzle-kit push`).
- `@tanstack/react-query` is set up with a `QueryClient` provider at the application root.
- The `useToast` hook from `~/hooks/use-toast` is available and configured.
- There is a server-side helper to get the currently authenticated Supabase user/session (e.g., `import { getUser } from '~/server/auth';`).
- Initial data (at least one row in `dealers`, some `concesionarios`, a few `vehicles`, and a `profiles` row linked to your test user with `role: 'admin'`) will be manually inserted after migration for testing restricted access.

## Phases and Steps

This plan outlines the steps to build the system from schema definition through frontend integration. **Engineers MUST complete each step, ensure it works as expected, and SEEK FEEDBACK BEFORE PROCEEDING to the next step.** Do not attempt to jump ahead.

### Phase 1: Database Schema and Migration

**Step 1.1: Define Drizzle Schema for All Entities**

Define the Drizzle schema for all tables (`clients`, `vehicles`, `contracts`, `insurance`, `dealers`, `concesionarios`, `profiles`) in your Drizzle schema file (e.g., `src/db/schema.ts`). Include all columns, Drizzle data types, constraints (primary key, unique), nullability (`.notNull()`, `.nullable()`), default values (`.default(...)`), foreign keys (`.references(...)`), and ENUMs using Drizzle's `pgEnum`. Define relations using `drizzle-orm/relations` if you plan to use Drizzle's ORM-style joins (recommended for fetching related data like `vehicle` with its `concesionario`).

```typescript
// src/db/schema.ts
import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  date,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm"; // Needed for relations

// Define ENUMs
export const contractStatusEnum = pgEnum("enum_contract_status", [
  "active",
  "pending",
  "completed",
]);
export const insuranceStatusEnum = pgEnum("enum_insurance_status", [
  "active",
  "expiring_soon",
  "expired",
  "cancelled",
]);
export const coverageTypeEnum = pgEnum("enum_coverage_type", [
  "motor_transmission",
  "full",
  "basic",
]);
export const financingTypeEnum = pgEnum("enum_financing_type", [
  "cash",
  "financing",
]);
export const vehicleStatusEnum = pgEnum("enum_vehicle_status", [
  "available",
  "sold",
  "reserved",
  "in_process",
  "maintenance",
]);
export const vehicleConditionEnum = pgEnum("enum_vehicle_condition", [
  "new",
  "used",
]);
export const userRoleEnum = pgEnum("user_role", ["admin", "user"]); // New role enum for profiles

// Reference Supabase Auth Users table in the 'auth' schema
// You MUST configure Drizzle Kit or your Drizzle client to read the 'auth' schema
// This definition should match the actual auth.users table structure in Supabase
export const authUsers = pgTable(
  "users",
  {
    id: uuid("id").primaryKey(), // The UUID from Supabase Auth
    // email: text("email"), // Add if you need to join/reference email from auth.users
    // other fields you might need...
  },
  (table) => {
    // Add indexes if needed, e.g., table.index("email_idx").on(table.email);
    return {}; // Return empty object or index definition
  }
);

// Define the 'dealers' table (New)
export const dealers = pgTable("dealers", {
  id: uuid("id").primaryKey().defaultRandom(), // UUID for the dealer
  businessName: text("business_name").notNull(),
  email: text("email"),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define the 'concesionarios' table (New)
export const concesionarios = pgTable("concesionarios", {
  id: uuid("id").primaryKey().defaultRandom(), // UUID for the 3rd party concesionario
  name: text("name").notNull(),
  contactName: text("contact_name"),
  email: text("email"),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define the 'profiles' table (New)
// Links a Supabase Auth user (auth.users) to a dealer and assigns a role
export const profiles = pgTable("profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }), // FK to auth.users.id (UUID from Supabase Auth)
  dealerId: uuid("dealer_id")
    .references(() => dealers.id, { onDelete: "restrict" })
    .notNull(), // FK to dealers.id
  role: userRoleEnum("role").default("user").notNull(), // User role within the dealer organization
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define the 'clients' table (Ensure it matches your requirements and add defaults)
export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  cedula: varchar("cedula", { length: 13 }).unique(),
  name: text("name").notNull(),
  email: text("email"),
  phone: varchar("phone", { length: 20 }),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define the 'vehicles' table (Add concesionarioId and updated_at default)
export const vehicles = pgTable("vehicles", {
  id: uuid("id").primaryKey().defaultRandom(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  trim: text("trim"),
  vehicleType: text("vehicle_type").notNull(), // Consider making this an enum
  color: text("color").notNull(),
  status: vehicleStatusEnum("status").notNull(),
  condition: vehicleConditionEnum("condition").notNull(),
  images: text("images").array(), // Array of text
  description: text("description"),
  transmission: text("transmission").notNull(), // Consider making this an enum
  fuelType: text("fuel_type").notNull(), // Consider making this an enum
  engineSize: text("engine_size").notNull(),
  plate: varchar("plate", { length: 10 }).unique(),
  vin: varchar("vin", { length: 17 }).unique().notNull(), // Assuming VIN is NOT NULL
  mileage: integer("mileage"),
  doors: integer("doors").notNull(),
  seats: integer("seats").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  hasOffer: boolean("has_offer").default(false).notNull(),
  offerPrice: numeric("offer_price", { precision: 10, scale: 2 }),
  adminStatus: text("admin_status"), // Consider making this an enum
  inMaintenance: boolean("in_maintenance").default(false).notNull(),
  entryDate: date("entry_date"),
  // New foreign key column
  concesionarioId: uuid("concesionario_id").references(
    () => concesionarios.id,
    { onDelete: "set null" }
  ), // FK to concesionarios, SET NULL on delete
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define the 'contracts' table (Ensure it matches requirements and add defaults)
export const contracts = pgTable("contracts", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractNumber: varchar("contract_number", { length: 50 }).unique(), // Unique contract number
  status: contractStatusEnum("status").default("pending").notNull(),
  clientId: uuid("client_id")
    .references(() => clients.id, { onDelete: "restrict" })
    .notNull(), // FK to clients
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id, { onDelete: "restrict" })
    .notNull(), // FK to vehicles
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  date: date("date").notNull(),
  financingType: financingTypeEnum("financing_type").notNull(),
  downPayment: numeric("down_payment", { precision: 10, scale: 2 }),
  months: integer("months"),
  monthlyPayment: numeric("monthly_payment", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define the 'insurance' table (Ensure it matches requirements and add defaults)
export const insurance = pgTable("insurance", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id, { onDelete: "restrict" })
    .notNull(), // FK to vehicles
  clientId: uuid("client_id").references(() => clients.id, {
    onDelete: "set null",
  }), // FK to clients, SET NULL on delete
  contractId: uuid("contract_id").references(() => contracts.id, {
    onDelete: "set null",
  }), // FK to contracts, SET NULL on delete
  startDate: date("start_date").notNull(),
  expiryDate: date("expiry_date").notNull(),
  coverageType: coverageTypeEnum("coverage_type").notNull(),
  coverageDuration: integer("coverage_duration").notNull(), // Duration in months
  premium: numeric("premium", { precision: 10, scale: 2 }).notNull(),
  status: insuranceStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Define Drizzle Relations ---
// Define relations between tables for easier querying (joins)
export const vehiclesRelations = relations(vehicles, ({ one }) => ({
  concesionario: one(concesionarios, {
    // Relationship name 'concesionario'
    fields: [vehicles.concesionarioId], // FK column in 'vehicles'
    references: [concesionarios.id], // PK column in 'concesionarios'
  }),
  contracts: relations(contracts, ({ many }) => ({
    // A vehicle can have many contracts
    contracts: many(contracts),
  })),
  insurance: relations(insurance, ({ many }) => ({
    // A vehicle can have many insurance policies
    insurance: many(insurance),
  })),
}));

export const contractsRelations = relations(contracts, ({ one }) => ({
  client: one(clients, {
    fields: [contracts.clientId],
    references: [clients.id],
  }),
  vehicle: one(vehicles, {
    fields: [contracts.vehicleId],
    references: [vehicles.id],
  }),
}));

export const insuranceRelations = relations(insurance, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [insurance.vehicleId],
    references: [vehicles.id],
  }),
  client: one(clients, {
    fields: [insurance.clientId],
    references: [clients.id],
  }),
  contract: one(contracts, {
    fields: [insurance.contractId],
    references: [contracts.id],
  }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  dealer: one(dealers, {
    fields: [profiles.dealerId],
    references: [dealers.id],
  }),
  // If you need to relate back to auth.users, ensure authUsers is defined correctly
  // authUser: one(authUsers, { fields: [profiles.id], references: [authUsers.id] }), // Link profile ID to auth.users ID
}));

export const dealersRelations = relations(dealers, ({ many }) => ({
  profiles: many(profiles), // A dealer can have many profiles
}));

export const concesionariosRelations = relations(
  concesionarios,
  ({ many }) => ({
    vehicles: many(vehicles), // A concesionario can have many vehicles on consignment
  })
);
```

**Step 1.2: Generate and Apply Drizzle Migrations**

Use Drizzle Kit commands to generate the necessary SQL migration files based on your schema definitions and then apply them to your Supabase database.

1.  Ensure your `drizzle.config.ts` is correctly configured to point to your schema file(s) and use the appropriate database connection (via an environment variable) and schema (`public` and potentially `auth` if referencing `auth.users`).
2.  Generate the migration files:
    ```bash
    npx drizzle-kit generate:pg --schema=./src/db/schema.ts
    ```
    _(Adjust `--schema` path if different. This command creates timestamped `.sql` files in your designated migrations directory.)_
3.  Review the generated SQL migration files carefully. Verify that they correctly create the new tables (`dealers`, `concesionarios`, `profiles`), define ENUM types, add the `concesionario_id` column and foreign key constraint to the `vehicles` table, and include foreign keys/constraints for all other tables.
4.  Apply the migrations to your Supabase database. The simplest way is often to copy the generated SQL into the Supabase SQL Editor and run it, or use Drizzle Kit's push command if configured:
    ```bash
    npx drizzle-kit push:pg --schema=./src/db/schema.ts
    ```
    _(Ensure your environment variable for the database connection URL is set correctly for the push command.)_
5.  Verify the tables, columns, and relationships exist in the Supabase UI Data Editor. Check that the ENUM types were created.

**Step 1.3: Implement Initial RLS Policies**

Implement Row-Level Security policies for _all_ tables in the Supabase dashboard ("Authentication" -> "Policies"). Focus on the initial basic policies needed to get data flowing through Server Functions and React Query, respecting the profile/role structure.

1.  **Enable RLS** for ALL tables: `clients`, `vehicles`, `contracts`, `insurance`, `dealers`, `concesionarios`, `profiles`.
2.  **Profiles Table:**
    - Policy: `Allow users to see their own profile` (SELECT)
      - USING expression: `auth.uid() = id`
    - Policy: `Allow users to create their own profile` (INSERT)
      - WITH CHECK expression: `auth.uid() = id`
    - _(Consider UPDATE/DELETE policies for profiles if needed, restricted to `auth.uid() = id`)_
3.  **Dealers Table:**
    - Policy: `Allow all authenticated users to select dealers` (SELECT)
      - USING expression: `auth.role() = 'authenticated'`
      - _(Allows fetching the dealer name for the contract preview. If dealers are multi-tenant and users should only see their own dealer, this policy would need to join through `profiles`)_
    - Policy: `Allow admins to update dealers` (UPDATE)
      - USING expression: `EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin' )`
    - _(Add INSERT/DELETE policies for dealers, similarly restricted to admins)_
4.  **Concesionarios Table:**
    - Policy: `Allow all authenticated users to select concesionarios` (SELECT)
      - USING expression: `auth.role() = 'authenticated'`
      - _(Needed for the Consignment Management dropdown)_
    - _(Add INSERT/UPDATE/DELETE policies for concesionarios, likely restricted to admins)_
5.  **Vehicles Table:**
    - Policy: `Allow all authenticated users to select vehicles` (SELECT)
      - USING expression: `auth.role() = 'authenticated'`
      - _(Allows fetching the vehicle list for contracts, insurance, and consignment management. For multi-dealer, this would need to join through profiles/dealers.)_
    - Policy: `Allow authenticated users to create vehicles` (INSERT)
      - WITH CHECK expression: `auth.role() = 'authenticated'`
      - _(Consider linking vehicles to the user's dealer ID if multi-dealer is a concern and update this policy)_
    - Policy: `Allow authenticated users to update vehicles` (UPDATE)
      - USING expression: `auth.role() = 'authenticated'`
      - _(Needed for consignment updates. This policy is broad; if only admins should update, use an EXISTS clause like for dealers)_
6.  **Clients, Contracts, Insurance Tables:**
    - Policy: `Allow all authenticated users to select [table_name]` (SELECT)
      - USING expression: `auth.role() = 'authenticated'`
    - Policy: `Allow all authenticated users to create [table_name]` (INSERT)
      - WITH CHECK expression: `auth.role() = 'authenticated'`
    - _(Add UPDATE/DELETE policies as needed, restricting based on `auth.uid()` or `auth.role()` or joins if necessary)_

**Step 1.4: Seed Initial Data (Manual)**

Manually insert initial data into your Supabase tables using the Data Editor for testing:

- Insert **one** row into the `dealers` table with your business information.
- Insert a few rows into the `concesionarios` table.
- Find your test user's UUID from the Supabase Authentication section (`auth.users` table). Insert a row into the `profiles` table, linking to your user's UUID, the new dealer's ID, and setting the `role` to `'admin'`.
- Insert a few `vehicles` rows.

**STOP. Generate and apply migrations. Implement RLS policies for all tables. Manually seed initial data including dealer, concesionarios, profiles (linked to your user as admin), and vehicles. Verify data and policies in the Supabase UI. SEEK FEEDBACK.**

### Phase 2: Drizzle Database Client and Server Functions

**Step 2.1: Configure Drizzle Client (Server-side)**

Set up the Drizzle database client instance (`db`) that will be used exclusively within your server-side code (Server Functions). This client uses a database driver and connects directly to the database using the full connection string (stored securely in a server environment variable).

1.  Ensure you have a compatible database driver installed (e.g., `pg`).
2.  Create a file for your Drizzle client setup, e.g., `src/db/index.ts`.

    ```typescript
    // src/db/index.ts
    import { drizzle } from "drizzle-orm/pg";
    import { Client } from "pg"; // Or your chosen driver
    import * as schema from "./schema"; // Import your Drizzle schema definitions

    // Access the secure server environment variable for the database URL
    const databaseUrl = process.env.DATABASE_URL; // Use the variable name you configured

    if (!databaseUrl) {
      // Crash the application startup if the critical DB URL is missing
      throw new Error(
        "FATAL ERROR: DATABASE_URL environment variable is not set. Cannot connect to database."
      );
    }

    // Create a new PG client instance
    const client = new Client({
      connectionString: databaseUrl,
      // Add SSL options if needed for production: ssl: { rejectUnauthorized: true },
    });

    // Connect the client (consider pooling for production)
    // For simple Server Functions, connecting per request might work depending on framework handling.
    // A better approach for production is typically a connection pool.
    // However, for this plan's clarity, we'll show a direct connection.
    client.connect().catch((err) => {
      console.error("FATAL ERROR: Failed to connect to database:", err);
      // Node.js process might exit if this initial connect fails depending on environment
    });

    // Create the Drizzle ORM client instance
    export const db = drizzle(client, { schema });

    // Optional: Export client if manual connection management is needed later
    // export { client };
    ```

**Step 2.2: Create Server Functions using `createServerFunction`**

Implement `@tanstack/start` Server Functions (`createServerFunction`) in a dedicated server file (e.g., `src/server/api.ts`). These functions will encapsulate all database logic using Drizzle. Import and use the `db` instance from `src/db/index.ts`. Implement input validation with Zod, authentication checks using your `getUser` helper, and authorization checks (`isAdmin`).

```typescript
// src/server/api.ts
import { createServerFunction } from "@tanstack/start/server";
import { z } from "zod";
import { db } from "~/db"; // Import your Drizzle client instance
import * as schema from "~/db/schema"; // Import your Drizzle schema
import { eq, and, isNull, asc } from "drizzle-orm"; // Drizzle ORM functions

// Assume you have a server-side helper to get the current user from the session
// e.g., import { getUser } from './auth'; // Needs to access cookies/headers server-side to get Supabase session

// Dummy getUser for planning purposes - REPLACE WITH REAL IMPLEMENTATION
async function getUser() {
  // In a real @tanstack/start/Supabase app, this would read the session cookie/header
  // and verify the user.
  // Example: return supabaseServerClient.auth.getUser();
  console.warn(
    "STUB: Using dummy getUser(). Auth/RLS will rely SOLELY on RLS policies if not implemented."
  );
  // For RLS to work via the Drizzle client initialized with the connection string,
  // the connection *must* be configured to pass the JWT somehow, or you need to
  // use a pattern where the Supabase client JWT is used to re-initialize a client per request.
  // The simplest pattern for server functions + RLS is often to use the
  // Supabase client's `auth.getSession()` or `auth.getUser()` *server-side*
  // and then potentially pass the JWT in the DB connection settings or
  // use a different client initialization strategy.
  // For *this plan*, we'll assume RLS policies handle the authentication check,
  // but implement *application-level* auth/role checks using a placeholder `getUser`.
  return { id: "placeholder-user-uuid" }; // Return a dummy user object for planning
  // Or return null if no user is logged in based on the assumed auth helper
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
// They should match the structure expected by your Drizzle insert/update operations.

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

// Helper to parse date strings into Date objects on the server
const parseDateServer = (
  value: string | Date | null | undefined
): Date | null => {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

const clientInsertSchema = z.object({
  cedula: z
    .string()
    .min(11, "La cédula debe tener al menos 11 dígitos")
    .max(13, "Formato de cédula inválido")
    .trim(),
  name: z.string().min(2, "El nombre es requerido").trim(),
  email: z
    .string()
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
// Note: Frontend might send strings for numbers/dates, server should parse.
const contractInsertSchema = z
  .object({
    status:
      schema.contractStatusEnum.enumValues.length > 0
        ? z.enum(schema.contractStatusEnum.enumValues)
        : z.string().min(1, "Status is required"),
    clientId: z.string().uuid("ID de cliente inválido"),
    vehicleId: z.string().uuid("ID de vehículo inválido"),
    price: z
      .union([z.number().min(0), z.string().min(1)])
      .transform(parseCurrencyServer)
      .nullable()
      .refine((val) => val !== null, { message: "El precio es requerido" }), // Expect number or string, parse to number
    date: z
      .union([z.date(), z.string().min(1)])
      .transform(parseDateServer)
      .nullable()
      .refine((val) => val !== null, { message: "La fecha es requerida" }), // Expect Date object or string, parse to Date
    financingType:
      schema.financingTypeEnum.enumValues.length > 0
        ? z.enum(schema.financingTypeEnum.enumValues)
        : z.string().min(1, "Tipo de financiamiento requerido"),
    downPayment: z
      .union([z.number().min(0), z.string()])
      .optional()
      .nullable()
      .transform(parseCurrencyServer), // Optional number or string, parse to number
    months: z
      .union([z.number().int().min(1), z.string()])
      .optional()
      .nullable()
      .transform((val) => {
        // Optional number or string, parse to int
        const parsed = parseInt(String(val), 10);
        return isNaN(parsed) ? null : parsed;
      }),
    monthlyPayment: z
      .union([z.number().min(0), z.string()])
      .optional()
      .nullable()
      .transform(parseCurrencyServer), // Optional number or string, parse to number
    notes: z
      .string()
      .optional()
      .nullable()
      .transform((n) => (n === "" ? null : n)), // Handle empty string
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
  ); // Custom error path

const insuranceInsertSchema = z
  .object({
    vehicleId: z.string().uuid("ID de vehículo inválido"),
    clientId: z
      .string()
      .uuid("ID de cliente inválido")
      .optional()
      .nullable()
      .transform((id) => (id === "" ? null : id)), // Handle empty string
    contractId: z
      .string()
      .uuid("ID de contrato inválido")
      .optional()
      .nullable()
      .transform((id) => (id === "" ? null : id)), // Handle empty string
    startDate: z
      .union([z.date(), z.string().min(1)])
      .transform(parseDateServer)
      .nullable()
      .refine((val) => val !== null, { message: "Fecha de inicio requerida" }),
    expiryDate: z
      .union([z.date(), z.string().min(1)])
      .transform(parseDateServer)
      .nullable()
      .refine((val) => val !== null, {
        message: "Fecha de vencimiento requerida",
      }),
    coverageType:
      schema.coverageTypeEnum.enumValues.length > 0
        ? z.enum(schema.coverageTypeEnum.enumValues)
        : z.string().min(1, "Tipo de cobertura requerido"),
    coverageDuration: z
      .union([z.number().int().min(1), z.string().min(1)])
      .transform((val) => {
        // Expect number or string, parse to int
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
      }), // Prima can be 0? Schema says >= 1. Let's match schema.
    status:
      schema.insuranceStatusEnum.enumValues.length > 0
        ? z.enum(schema.insuranceStatusEnum.enumValues)
        : z.string().min(1, "Status requerido"),
  })
  .refine(
    (data) => {
      // Additional date validation
      // Ensure dates are valid Date objects after transformation
      return (
        data.startDate instanceof Date &&
        !isNaN(data.startDate.getTime()) &&
        data.expiryDate instanceof Date &&
        !isNaN(data.expiryDate.getTime())
      );
    },
    { message: "Fechas inválidas", path: ["datesValid"] }
  );

const vehicleUpdateSchema = z.object({
  vehicleId: z.string().uuid("ID de vehículo inválido"),
  // Define exactly which fields are allowed to be updated via this server function
  updateData: z
    .object({
      // Example: Only allow updating concesionarioId via this specific function
      concesionarioId: z
        .string()
        .uuid("ID de concesionario inválido")
        .optional()
        .nullable()
        .transform((id) => (id === "" ? null : id)), // Handle empty string from Select
      // Add other fields here ONLY if this server function is intended to update them
      // e.g., status: schema.vehicleStatusEnum.enumValues[0] ? z.enum(schema.vehicleStatusEnum.enumValues).optional() : z.string().optional(),
      // e.g., price: z.union([z.number().min(0), z.string()]).optional().nullable().transform(parseCurrencyServer),
      // Use .partial() if all fields in updateData object are optional,
      // or define specific fields as optional like concesionarioId above.
      // We need at least one field to update, so let's ensure updateData isn't empty if needed.
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "No se proporcionaron campos para actualizar",
    }),
});

// --- Server Functions Definitions ---

// Define createServerFunction with serializable error handling
const server$ = createServerFunction({
  // Optional: Add session/user fetching logic here if not handled by a global middleware
  // or if createServerFunction provides context access.
  // This is highly dependent on @tanstack/start's specific implementation details
  // for server function context and auth.
  // For now, we use the dummy getUser/isAdmin inside the function body.
});

// Fetch Vehicles
export const fetchVehicles = server$(async () => {
  console.log("Server function: fetchVehicles called");
  // Auth Check: Only authenticated users can fetch vehicles
  const user = await getUser();
  if (!user) {
    console.warn("Server function: Unauthorized access to fetchVehicles");
    throw new Error("Unauthorized: User not authenticated."); // Throw a serializable error
  }

  try {
    // Use Drizzle to query vehicles, joining with concesionarios
    const vehiclesList = await db.query.vehicles.findMany({
      columns: {
        // Select specific vehicle columns needed on the client
        id: true,
        brand: true,
        model: true,
        year: true,
        color: true,
        vin: true,
        plate: true,
        price: true,
        status: true,
        concesionarioId: true, // Include FK
      },
      with: {
        // Define the join to fetch related concesionario data
        concesionario: {
          // Relation name in schema
          columns: { id: true, name: true }, // Select columns from concesionario
        },
      },
      orderBy: [asc(schema.vehicles.brand), asc(schema.vehicles.model)],
    });

    console.log(
      `Server function: fetchVehicles found ${vehiclesList.length} vehicles`
    );
    // Data returned by Drizzle is typically serializable
    return vehiclesList;
  } catch (error: any) {
    console.error("Server function: Error fetching vehicles:", error);
    // Re-throw a serializable error
    throw new Error("Error al cargar vehículos: " + error.message);
  }
});

// Fetch Clients
export const fetchClients = server$(async () => {
  console.log("Server function: fetchClients called");
  const user = await getUser();
  if (!user) {
    console.warn("Server function: Unauthorized access to fetchClients");
    throw new Error("Unauthorized: User not authenticated.");
  }
  try {
    const clientsList = await db.query.clients.findMany({
      columns: { id: true, name: true, cedula: true, email: true },
      orderBy: [asc(schema.clients.name)],
    });
    console.log(
      `Server function: fetchClients found ${clientsList.length} clients`
    );
    return clientsList;
  } catch (error: any) {
    console.error("Server function: Error fetching clients:", error);
    throw new Error("Error al cargar clientes: " + error.message);
  }
});

// Fetch Contracts
export const fetchContracts = server$(async () => {
  console.log("Server function: fetchContracts called");
  const user = await getUser();
  if (!user) {
    console.warn("Server function: Unauthorized access to fetchContracts");
    throw new Error("Unauthorized: User not authenticated.");
  }
  try {
    const contractsList = await db.query.contracts.findMany({
      columns: {
        // Select columns needed for dropdown
        id: true,
        contractNumber: true,
        notes: true,
        clientId: true, // Assuming notes or contractNumber used for description
      },
      orderBy: [asc(schema.contracts.contractNumber)],
    });
    console.log(
      `Server function: fetchContracts found ${contractsList.length} contracts`
    );
    return contractsList;
  } catch (error: any) {
    console.error("Server function: Error fetching contracts:", error);
    throw new Error("Error al cargar contratos: " + error.message);
  }
});

// Fetch Dealer Info
export const fetchDealerInfo = server$(async () => {
  console.log("Server function: fetchDealerInfo called");
  const user = await getUser(); // Check if user is authenticated
  if (!user) {
    console.warn("Server function: Unauthorized access to fetchDealerInfo");
    // Decide if non-authenticated users can see ANY dealer info (e.g. business name for public site)
    // For this plan, assume authenticated is required.
    throw new Error("Unauthorized: User not authenticated.");
  }

  try {
    // Fetch the single dealer row (assuming only one)
    const dealer = await db.query.dealers.findFirst();

    if (!dealer) {
      console.warn("Server function: No dealer info found in database.");
      return null; // Explicitly return null if not found
    }

    console.log("Server function: Dealer info fetched.");
    return dealer;
  } catch (error: any) {
    console.error("Server function: Error fetching dealer info:", error);
    throw new Error(
      "Error al cargar información del concesionario principal: " +
        error.message
    );
  }
});

// Fetch Concesionarios
export const fetchConcesionarios = server$(async () => {
  console.log("Server function: fetchConcesionarios called");
  const user = await getUser();
  if (!user) {
    console.warn("Server function: Unauthorized access to fetchConcesionarios");
    throw new Error("Unauthorized: User not authenticated.");
  }
  try {
    const concesionariosList = await db.query.concesionarios.findMany({
      columns: { id: true, name: true },
      orderBy: [asc(schema.concesionarios.name)],
    });
    console.log(
      `Server function: fetchConcesionarios found ${concesionariosList.length} concesionarios`
    );
    return concesionariosList;
  } catch (error: any) {
    console.error("Server function: Error fetching concesionarios:", error);
    throw new Error("Error al cargar concesionarios: " + error.message);
  }
});

// Create Client
export const createClientServer = server$(
  async (clientData: z.infer<typeof clientInsertSchema>) => {
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

    // Server-side input validation using Zod schema
    const validationResult = clientInsertSchema.safeParse(clientData);
    if (!validationResult.success) {
      console.error(
        "Server function: createClientServer validation failed",
        validationResult.error
      );
      // Throw a serializable error with validation details
      throw new Error(
        "Error de validación: " +
          validationResult.error.errors.map((e) => e.message).join(", ")
      );
    }
    const validatedData = validationResult.data;

    try {
      // Use Drizzle to insert data
      const insertedClients = await db
        .insert(schema.clients)
        .values({
          // Map validated Zod data to DB schema columns
          cedula: validatedData.cedula,
          name: validatedData.name,
          email: validatedData.email, // Zod transform handles null
          phone: validatedData.phone, // Zod transform handles null
          address: validatedData.address,
          // createdAt and updatedAt defaults are handled by Drizzle schema defaults
        })
        .returning(); // Get the inserted row(s) back

      // Check if insertion was successful
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
      // Return the inserted data (serializable)
      return insertedClients[0];
    } catch (error: any) {
      console.error("Server function: Error creating client:", error);
      // Handle common DB errors and provide user-friendly messages
      let userFriendlyMessage = "Error desconocido al crear cliente.";
      if (error.message?.includes("unique constraint")) {
        userFriendlyMessage =
          "La cédula ingresada ya existe. Por favor, verifica los datos.";
      } else {
        userFriendlyMessage = error.message; // Fallback to actual DB error message
      }
      throw new Error(userFriendlyMessage); // Throw serializable error
    }
  }
);

// Create Contract
export const createContractServer = server$(
  async (contractData: z.infer<typeof contractInsertSchema>) => {
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

    // Server-side input validation
    const validationResult = contractInsertSchema.safeParse(contractData);
    if (!validationResult.success) {
      console.error(
        "Server function: createContractServer validation failed",
        validationResult.error
      );
      throw new Error(
        "Error de validación: " +
          validationResult.error.errors.map((e) => e.message).join(", ")
      );
    }
    const validatedData = validationResult.data; // Contains parsed numbers and dates

    // Optional: Server-side generation of contract number (safer here than client-side)
    // Consider a more robust unique number generation strategy in production (e.g., DB sequence, transactional)
    const contractNumber = `CTR-${new Date().getFullYear()}-${Date.now()}`; // Simple timestamp example

    try {
      // Use Drizzle to insert data
      const insertedContracts = await db
        .insert(schema.contracts)
        .values({
          // Map validated & transformed data to DB schema
          contractNumber: contractNumber, // Use generated number
          status: validatedData.status,
          clientId: validatedData.clientId,
          vehicleId: validatedData.vehicleId,
          price: validatedData.price, // Should be number from transform
          date: validatedData.date, // Should be Date object from transform
          financingType: validatedData.financingType,
          downPayment: validatedData.downPayment, // Nullable number
          months: validatedData.months, // Nullable integer
          monthlyPayment: validatedData.monthlyPayment, // Nullable number
          notes: validatedData.notes, // Nullable string
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
      } else if (error.message?.includes("invalid input syntax")) {
        // Drizzle/DB error on parsing types
        userFriendlyMessage =
          "Error en el formato de los datos numéricos o de fecha proporcionados.";
      } else {
        userFriendlyMessage = error.message;
      }
      throw new Error(userFriendlyMessage);
    }
  }
);

// Create Insurance
export const createInsuranceServer = server$(
  async (insuranceData: z.infer<typeof insuranceInsertSchema>) => {
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

    // Server-side input validation
    const validationResult = insuranceInsertSchema.safeParse(insuranceData);
    if (!validationResult.success) {
      console.error(
        "Server function: createInsuranceServer validation failed",
        validationResult.error
      );
      throw new Error(
        "Error de validación: " +
          validationResult.error.errors.map((e) => e.message).join(", ")
      );
    }
    const validatedData = validationResult.data; // Contains parsed numbers and dates

    try {
      // Use Drizzle to insert data
      const insertedInsurance = await db
        .insert(schema.insurance)
        .values({
          vehicleId: validatedData.vehicleId,
          clientId: validatedData.clientId, // Nullable UUID
          contractId: validatedData.contractId, // Nullable UUID
          startDate: validatedData.startDate, // Date object
          expiryDate: validatedData.expiryDate, // Date object
          coverageType: validatedData.coverageType,
          coverageDuration: validatedData.coverageDuration, // Integer
          premium: validatedData.premium, // Number
          status: validatedData.status,
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
      } else if (error.message?.includes("invalid input syntax")) {
        userFriendlyMessage =
          "Error en el formato de los datos numéricos o de fecha proporcionados.";
      } else {
        userFriendlyMessage = error.message;
      }
      throw new Error(userFriendlyMessage);
    }
  }
);

// Update Vehicle (for consignment management, and potentially other vehicle updates)
export const updateVehicleServer = server$(
  async (updatePayload: z.infer<typeof vehicleUpdateSchema>) => {
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

    // Server-side input validation for the update payload
    const validationResult = vehicleUpdateSchema.safeParse(updatePayload);
    if (!validationResult.success) {
      console.error(
        "Server function: updateVehicleServer validation failed",
        validationResult.error
      );
      throw new Error(
        "Error de validación: " +
          validationResult.error.errors.map((e) => e.message).join(", ")
      );
    }
    const validatedData = validationResult.data;
    const vehicleId = validatedData.vehicleId;
    const dataToUpdate = validatedData.updateData; // Object containing fields like { concesionarioId: ... }

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

    // Ensure there's something to update (refine schema or check here)
    if (Object.keys(dataToUpdate).length === 0) {
      console.warn(
        "Server function: Update called with empty dataToUpdate object."
      );
      throw new Error("No se proporcionaron datos para actualizar.");
    }

    try {
      // Use Drizzle to update the vehicle record
      const updatedVehicles = await db
        .update(schema.vehicles)
        .set({
          // Apply the validated update data
          ...dataToUpdate, // Drizzle allows spreading the object of columns/values
          updatedAt: new Date(), // Manually update the timestamp
        })
        .where(eq(schema.vehicles.id, vehicleId)) // Filter by the vehicle ID
        .returning(); // Get the updated row(s) back

      // Check if the update was successful (at least one row returned)
      if (!updatedVehicles || updatedVehicles.length === 0) {
        // This might happen if the vehicleId didn't exist, or RLS prevented the update
        // Check if the vehicle actually exists first for a better error message
        const existingVehicle = await db.query.vehicles.findFirst({
          where: eq(schema.vehicles.id, vehicleId),
        });
        if (existingVehicle) {
          // Vehicle exists but update failed - likely RLS or other DB constraint
          throw new Error(
            "Error al actualizar el vehículo. Verifica permisos o datos."
          );
        } else {
          // Vehicle ID not found
          throw new Error("Vehículo no encontrado.");
        }
      }

      console.log(
        "Server function: updateVehicleServer successful",
        updatedVehicles[0]
      );
      return updatedVehicles[0]; // Return the updated vehicle data
    } catch (error: any) {
      console.error("Server function: Error updating vehicle:", error);
      let userFriendlyMessage = "Error desconocido al actualizar el vehículo.";
      if (error.message?.includes("foreign key constraint")) {
        userFriendlyMessage =
          "Valor inválido para la asignación (concesionario no válido).";
      } else if (error.message?.includes("Unauthorized:")) {
        // Catch the specific auth error thrown earlier
        userFriendlyMessage = error.message;
      } else {
        userFriendlyMessage = error.message; // Fallback
      }
      throw new Error(userFriendlyMessage);
    }
  }
);

// Example of fetching the user's profile (might be needed on client-side for admin checks)
export const fetchMyProfile = server$(async () => {
  console.log("Server function: fetchMyProfile called");
  const user = await getUser();
  if (!user) {
    console.warn("Server function: fetchMyProfile Unauthorized");
    return null; // Return null if not logged in
  }
  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(schema.profiles.id, user.id),
      // Optionally join dealer info here if needed on the client
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
});

// Assume you have other server functions for auth state management like login/logout, etc.
// These would use the client-side Supabase JS library directed at the Auth API.
```
