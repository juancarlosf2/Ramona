CREATE TYPE "public"."enum_contract_status" AS ENUM('active', 'pending', 'completed');--> statement-breakpoint
CREATE TYPE "public"."enum_coverage_type" AS ENUM('motor_transmission', 'full', 'basic');--> statement-breakpoint
CREATE TYPE "public"."enum_financing_type" AS ENUM('cash', 'financing');--> statement-breakpoint
CREATE TYPE "public"."enum_insurance_status" AS ENUM('active', 'expiring_soon', 'expired', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."enum_vehicle_condition" AS ENUM('new', 'used');--> statement-breakpoint
CREATE TYPE "public"."enum_vehicle_status" AS ENUM('available', 'sold', 'reserved', 'in_process', 'maintenance');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cedula" varchar(13),
	"name" text NOT NULL,
	"email" text,
	"phone" varchar(20),
	"address" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_cedula_unique" UNIQUE("cedula")
);
--> statement-breakpoint
CREATE TABLE "concesionarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"contact_name" text,
	"email" text,
	"phone" varchar(20),
	"address" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_number" varchar(50),
	"status" "enum_contract_status" DEFAULT 'pending' NOT NULL,
	"client_id" uuid NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"date" date NOT NULL,
	"financing_type" "enum_financing_type" NOT NULL,
	"down_payment" numeric(10, 2),
	"months" integer,
	"monthly_payment" numeric(10, 2),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "contracts_contract_number_unique" UNIQUE("contract_number")
);
--> statement-breakpoint
CREATE TABLE "dealers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_name" text NOT NULL,
	"email" text,
	"phone" varchar(20),
	"address" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "insurance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"client_id" uuid,
	"contract_id" uuid,
	"start_date" date NOT NULL,
	"expiry_date" date NOT NULL,
	"coverage_type" "enum_coverage_type" NOT NULL,
	"coverage_duration" integer NOT NULL,
	"premium" numeric(10, 2) NOT NULL,
	"status" "enum_insurance_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"dealer_id" uuid NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand" text NOT NULL,
	"model" text NOT NULL,
	"year" integer NOT NULL,
	"trim" text,
	"vehicle_type" text NOT NULL,
	"color" text NOT NULL,
	"status" "enum_vehicle_status" NOT NULL,
	"condition" "enum_vehicle_condition" NOT NULL,
	"images" text[],
	"description" text,
	"transmission" text NOT NULL,
	"fuel_type" text NOT NULL,
	"engine_size" text NOT NULL,
	"plate" varchar(10),
	"vin" varchar(17) NOT NULL,
	"mileage" integer,
	"doors" integer NOT NULL,
	"seats" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"has_offer" boolean DEFAULT false NOT NULL,
	"offer_price" numeric(10, 2),
	"admin_status" text,
	"in_maintenance" boolean DEFAULT false NOT NULL,
	"entry_date" date,
	"concesionario_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vehicles_plate_unique" UNIQUE("plate"),
	CONSTRAINT "vehicles_vin_unique" UNIQUE("vin")
);
--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insurance" ADD CONSTRAINT "insurance_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insurance" ADD CONSTRAINT "insurance_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insurance" ADD CONSTRAINT "insurance_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_dealer_id_dealers_id_fk" FOREIGN KEY ("dealer_id") REFERENCES "public"."dealers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_concesionario_id_concesionarios_id_fk" FOREIGN KEY ("concesionario_id") REFERENCES "public"."concesionarios"("id") ON DELETE set null ON UPDATE no action;