#!/usr/bin/env tsx
// Simple database seeding script using Drizzle ORM
import { db } from "~/db";
import * as schema from "~/db/schema";

async function simpleSeed() {
  try {
    console.log("🌱 Starting simple database seeding...");

    // Clear existing data (in reverse order to avoid foreign key constraints)
    console.log("🧹 Clearing existing data...");
    await db.delete(schema.insurance);
    await db.delete(schema.contracts);
    await db.delete(schema.clients);
    await db.delete(schema.vehicles);
    await db.delete(schema.concesionarios);
    await db.delete(schema.profiles);
    await db.delete(schema.dealers);

    // Create dealers first
    console.log("📊 Creating dealers...");
    const dealers = await db
      .insert(schema.dealers)
      .values([
        {
          businessName: "Ramona Auto Group",
          email: "info@ramonaauto.com",
          phone: "809-555-0101",
          address: "Av. Winston Churchill 123, Santo Domingo",
          city: "Santo Domingo",
          country: "Dominican Republic",
        },
        {
          businessName: "Auto Excellence RD",
          email: "ventas@autoexcellence.do",
          phone: "809-555-0202",
          address: "Av. 27 de Febrero 456, Santiago",
          city: "Santiago",
          country: "Dominican Republic",
        },
      ])
      .returning();

    console.log(`✅ Created ${dealers.length} dealers`);

    // Create concesionarios
    console.log("🏢 Creating concesionarios...");
    const concesionarios = await db
      .insert(schema.concesionarios)
      .values([
        {
          name: "AutoVentas Premium",
          contactPerson: "Carlos Rodriguez",
          phone: "809-555-1001",
          email: "carlos@autoventas.com",
          commission: 5.5,
          dealerId: dealers[0].id,
        },
        {
          name: "Vehículos del Este",
          contactPerson: "María González",
          phone: "809-555-1002",
          email: "maria@vehiculoseste.com",
          commission: 6.0,
          dealerId: dealers[0].id,
        },
        {
          name: "Auto Express Santiago",
          contactPerson: "Juan Pérez",
          phone: "829-555-1003",
          email: "juan@autoexpress.com",
          commission: 5.0,
          dealerId: dealers[1].id,
        },
      ])
      .returning();

    console.log(`✅ Created ${concesionarios.length} concesionarios`);

    // Create vehicles
    console.log("🚗 Creating vehicles...");
    const vehicles = await db
      .insert(schema.vehicles)
      .values([
        {
          make: "Toyota",
          model: "Corolla",
          year: 2023,
          color: "Blanco",
          vin: "JTDKAMFU9N3123456",
          licensePlate: "A123456",
          status: "available",
          vehicleType: "sedan",
          condition: "new",
          salePrice: 2800000,
          costPrice: 2500000,
          dealerId: dealers[0].id,
        },
        {
          make: "Honda",
          model: "CR-V",
          year: 2022,
          color: "Azul",
          vin: "JHLRD78866C123457",
          licensePlate: "B234567",
          status: "available",
          vehicleType: "suv",
          condition: "used",
          salePrice: 3200000,
          costPrice: 2900000,
          dealerId: dealers[0].id,
        },
        {
          make: "Nissan",
          model: "Sentra",
          year: 2023,
          color: "Gris",
          vin: "KNMAT2MT5NP123458",
          licensePlate: "C345678",
          status: "sold",
          vehicleType: "sedan",
          condition: "new",
          salePrice: 2600000,
          costPrice: 2300000,
          dealerId: dealers[1].id,
        },
        {
          make: "Ford",
          model: "Explorer",
          year: 2021,
          color: "Negro",
          vin: "1FM5K8D84MGA12459",
          licensePlate: "D456789",
          status: "reserved",
          vehicleType: "suv",
          condition: "used",
          salePrice: 4500000,
          costPrice: 4000000,
          dealerId: dealers[1].id,
        },
        {
          make: "Chevrolet",
          model: "Spark",
          year: 2024,
          color: "Rojo",
          vin: "KL8CB6SA3PC123460",
          licensePlate: "E567890",
          status: "available",
          vehicleType: "hatchback",
          condition: "new",
          salePrice: 1800000,
          costPrice: 1600000,
          dealerId: dealers[0].id,
        },
      ])
      .returning();

    console.log(`✅ Created ${vehicles.length} vehicles`);

    // Create clients
    console.log("👥 Creating clients...");
    const clients = await db
      .insert(schema.clients)
      .values([
        {
          cedula: "40212345678",
          name: "Ana María Rodríguez",
          email: "ana.rodriguez@email.com",
          phone: "809-555-2001",
          address: "Calle Primera 123, Gazcue",
          dealerId: dealers[0].id,
        },
        {
          cedula: "40298765432",
          name: "Luis Fernando García",
          email: "luis.garcia@email.com",
          phone: "829-555-2002",
          address: "Av. Independencia 456, Santo Domingo",
          dealerId: dealers[0].id,
        },
        {
          cedula: "40287654321",
          name: "Carmen Dolores Martínez",
          email: "carmen.martinez@email.com",
          phone: "849-555-2003",
          address: "Calle Central 789, Santiago",
          dealerId: dealers[1].id,
        },
        {
          cedula: "40276543210",
          name: "Roberto Carlos Jiménez",
          email: "roberto.jimenez@email.com",
          phone: "809-555-2004",
          address: "Av. Máximo Gómez 321, Santo Domingo",
          dealerId: dealers[1].id,
        },
      ])
      .returning();

    console.log(`✅ Created ${clients.length} clients`);

    // Create contracts
    console.log("📋 Creating contracts...");
    const contracts = await db
      .insert(schema.contracts)
      .values([
        {
          clientId: clients[0].id,
          vehicleId: vehicles[2].id, // Sold Nissan Sentra
          salePrice: 2600000,
          downPayment: 600000,
          financingAmount: 2000000,
          interestRate: 12.5,
          termMonths: 48,
          monthlyPayment: 52000,
          status: "active",
          financingType: "financing",
          dealerId: dealers[1].id,
        },
        {
          clientId: clients[1].id,
          vehicleId: vehicles[3].id, // Reserved Ford Explorer
          salePrice: 4500000,
          downPayment: 1500000,
          financingAmount: 3000000,
          interestRate: 11.0,
          termMonths: 60,
          monthlyPayment: 65000,
          status: "pending",
          financingType: "financing",
          dealerId: dealers[1].id,
        },
      ])
      .returning();

    console.log(`✅ Created ${contracts.length} contracts`);

    // Create insurance policies
    console.log("🛡️ Creating insurance policies...");
    const insurance = await db
      .insert(schema.insurance)
      .values([
        {
          vehicleId: vehicles[2].id,
          clientId: clients[0].id,
          contractId: contracts[0].id,
          policyNumber: "POL-2024-001",
          provider: "Seguros Universal",
          coverageType: "full",
          premium: 45000,
          startDate: new Date("2024-01-15"),
          endDate: new Date("2025-01-15"),
          status: "active",
          dealerId: dealers[1].id,
        },
        {
          vehicleId: vehicles[3].id,
          clientId: clients[1].id,
          contractId: contracts[1].id,
          policyNumber: "POL-2024-002",
          provider: "Mapfre BHD",
          coverageType: "motor_transmission",
          premium: 60000,
          startDate: new Date("2024-02-01"),
          endDate: new Date("2025-02-01"),
          status: "active",
          dealerId: dealers[1].id,
        },
      ])
      .returning();

    console.log(`✅ Created ${insurance.length} insurance policies`);

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("📈 Summary:");
    console.log(`  - ${dealers.length} dealers`);
    console.log(`  - ${concesionarios.length} concesionarios`);
    console.log(`  - ${vehicles.length} vehicles`);
    console.log(`  - ${clients.length} clients`);
    console.log(`  - ${contracts.length} contracts`);
    console.log(`  - ${insurance.length} insurance policies`);

    console.log("\n📋 Next steps:");
    console.log("  1. Run: pnpm run db:create-admin");
    console.log("  2. Test the application with real data");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  simpleSeed();
}

export { simpleSeed };
