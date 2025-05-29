ALTER TABLE "users" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "dealer_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "concesionarios" ADD COLUMN "dealer_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "contracts" ADD COLUMN "dealer_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "insurance" ADD COLUMN "dealer_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "dealer_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_dealer_id_dealers_id_fk" FOREIGN KEY ("dealer_id") REFERENCES "public"."dealers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concesionarios" ADD CONSTRAINT "concesionarios_dealer_id_dealers_id_fk" FOREIGN KEY ("dealer_id") REFERENCES "public"."dealers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_dealer_id_dealers_id_fk" FOREIGN KEY ("dealer_id") REFERENCES "public"."dealers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insurance" ADD CONSTRAINT "insurance_dealer_id_dealers_id_fk" FOREIGN KEY ("dealer_id") REFERENCES "public"."dealers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_dealer_id_dealers_id_fk" FOREIGN KEY ("dealer_id") REFERENCES "public"."dealers"("id") ON DELETE restrict ON UPDATE no action;