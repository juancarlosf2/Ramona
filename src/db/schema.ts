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
export const authUsers = pgTable("users", {
  id: uuid("id").primaryKey(), // The UUID from Supabase Auth
  email: text("email"), // Add if you need to join/reference email from auth.users
  // other fields you might need...
});

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
  // Multi-tenant: Link concesionario to dealer
  dealerId: uuid("dealer_id")
    .references(() => dealers.id, { onDelete: "restrict" })
    .notNull(), // FK to dealers
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
  // Multi-tenant: Link client to dealer
  dealerId: uuid("dealer_id")
    .references(() => dealers.id, { onDelete: "restrict" })
    .notNull(), // FK to dealers
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
  // Multi-tenant: Link vehicle to dealer
  dealerId: uuid("dealer_id")
    .references(() => dealers.id, { onDelete: "restrict" })
    .notNull(), // FK to dealers
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
  // Multi-tenant: Link contract to dealer
  dealerId: uuid("dealer_id")
    .references(() => dealers.id, { onDelete: "restrict" })
    .notNull(), // FK to dealers
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
  // Multi-tenant: Link insurance to dealer
  dealerId: uuid("dealer_id")
    .references(() => dealers.id, { onDelete: "restrict" })
    .notNull(), // FK to dealers
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Define Drizzle Relations ---
// Define relations between tables for easier querying (joins)
export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  concesionario: one(concesionarios, {
    // Relationship name 'concesionario'
    fields: [vehicles.concesionarioId], // FK column in 'vehicles'
    references: [concesionarios.id], // PK column in 'concesionarios'
  }),
  dealer: one(dealers, {
    // Relationship to dealer
    fields: [vehicles.dealerId],
    references: [dealers.id],
  }),
  contracts: many(contracts), // A vehicle can have many contracts
  insurance: many(insurance), // A vehicle can have many insurance policies
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
  dealer: one(dealers, {
    fields: [contracts.dealerId],
    references: [dealers.id],
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
  dealer: one(dealers, {
    fields: [insurance.dealerId],
    references: [dealers.id],
  }),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  dealer: one(dealers, {
    fields: [clients.dealerId],
    references: [dealers.id],
  }),
  contracts: many(contracts), // A client can have many contracts
  insurance: many(insurance), // A client can have many insurance policies
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
  concesionarios: many(concesionarios), // A dealer can have many concesionarios
  vehicles: many(vehicles), // A dealer can have many vehicles
  clients: many(clients), // A dealer can have many clients
  contracts: many(contracts), // A dealer can have many contracts
  insurance: many(insurance), // A dealer can have many insurance policies
}));

export const concesionariosRelations = relations(
  concesionarios,
  ({ one, many }) => ({
    dealer: one(dealers, {
      // Relationship to dealer
      fields: [concesionarios.dealerId],
      references: [dealers.id],
    }),
    vehicles: many(vehicles), // A concesionario can have many vehicles on consignment
  })
);
