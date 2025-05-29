import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  dealers,
  concesionarios,
  vehicles,
  clients,
  contracts,
  insurance,
  profiles,
} from "../src/db/schema";

async function seed() {
  // Get database URL from environment
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is required");
    process.exit(1);
  }

  // Create database connection
  const sql = postgres(databaseUrl);
  const db = drizzle(sql);

  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data first (in reverse order of dependencies)
    console.log("🧹 Clearing existing data...");
    await db.delete(insurance);
    await db.delete(contracts);
    await db.delete(clients);
    await db.delete(vehicles);
    await db.delete(concesionarios);
    await db.delete(dealers);
    console.log("✅ Existing data cleared");

    // Insert Dealers
    console.log("📊 Inserting dealers...");
    await db.insert(dealers).values([
      {
        id: "d1234567-89ab-4cde-f012-3456789abcde",
        businessName: "Ramona Auto Group",
        address: "Av. Winston Churchill #123, Piantini, Santo Domingo",
        phone: "809-555-0100",
        email: "info@ramonaauto.com",
      },
      {
        id: "d2345678-9abc-4def-0123-456789abcdef",
        businessName: "Auto Excellence RD",
        address: "Av. Abraham Lincoln #456, La Julia, Santo Domingo",
        phone: "809-555-0200",
        email: "ventas@autoexcellence.com.do",
      },
    ]);

    // Insert Concesionarios (Consignment partners)
    console.log("🏢 Inserting concesionarios...");
    await db.insert(concesionarios).values([
      {
        id: "c1111111-2222-3333-4444-555566667777",
        name: "AutoVentas Premium",
        contactName: "Carlos Rodríguez",
        phone: "809-777-1001",
        email: "carlos@autoventaspremium.com",
        address: "Av. 27 de Febrero #789, Gazcue, Santo Domingo",
        dealerId: "d1234567-89ab-4cde-f012-3456789abcde", // Link to Ramona Auto Group
      },
      {
        id: "c2222222-3333-4444-5555-666677778888",
        name: "Vehículos del Este",
        contactName: "María González",
        phone: "809-777-2002",
        email: "maria@vehiculosdeleste.com",
        address: "Autopista del Este Km 15, San Pedro de Macorís",
        dealerId: "d1234567-89ab-4cde-f012-3456789abcde", // Link to Ramona Auto Group
      },
      {
        id: "c3333333-4444-5555-6666-777788889999",
        name: "Auto Express Santiago",
        contactName: "Pedro Martínez",
        phone: "809-777-3003",
        email: "pedro@autoexpress.com",
        address: "Av. Juan Pablo Duarte #234, Santiago",
        dealerId: "d2345678-9abc-4def-0123-456789abcdef", // Link to Auto Excellence RD
      },
    ]);

    // Insert sample Vehicles
    console.log("🚗 Inserting vehicles...");
    await db.insert(vehicles).values([
      {
        id: "11111111-aaaa-4bbb-8ccc-ddddeeeeeeee",
        brand: "Toyota",
        model: "Corolla",
        year: 2022,
        vehicleType: "Sedan",
        color: "Blanco",
        status: "available",
        condition: "used",
        vin: "1HGCM82633A123456",
        plate: "A123456",
        price: "950000",
        dealerId: "d1234567-89ab-4cde-f012-3456789abcde", // Link to Ramona Auto Group
        concesionarioId: "c1111111-2222-3333-4444-555566667777",
        mileage: 1500,
        fuelType: "Gasolina",
        transmission: "Automática",
        engineSize: "1.8L",
        doors: 4,
        seats: 5,
      },
      {
        id: "22222222-bbbb-4ccc-8ddd-eeeeeeeeffff",
        brand: "Honda",
        model: "Civic",
        year: 2021,
        vehicleType: "Sedan",
        color: "Negro",
        status: "available",
        condition: "used",
        vin: "2HGFG12567H789012",
        plate: "B789012",
        price: "875000",
        dealerId: "d1234567-89ab-4cde-f012-3456789abcde", // Link to Ramona Auto Group
        concesionarioId: "c2222222-3333-4444-5555-666677778888",
        mileage: 2800,
        fuelType: "Gasolina",
        transmission: "Manual",
        engineSize: "2.0L",
        doors: 4,
        seats: 5,
      },
      {
        id: "33333333-cccc-4ddd-8eee-ffffffffffff",
        brand: "Hyundai",
        model: "Tucson",
        year: 2023,
        vehicleType: "SUV",
        color: "Gris",
        status: "available",
        condition: "used",
        vin: "5NPE24AF1FH123789",
        plate: "C456789",
        price: "1250000",
        dealerId: "d2345678-9abc-4def-0123-456789abcdef", // Link to Auto Excellence RD
        concesionarioId: "c3333333-4444-5555-6666-777788889999",
        mileage: 800,
        fuelType: "Gasolina",
        transmission: "Automática",
        engineSize: "2.4L",
        doors: 4,
        seats: 7,
      },
      {
        id: "44444444-dddd-4eee-8fff-000000001111",
        brand: "Kia",
        model: "Sportage",
        year: 2022,
        vehicleType: "SUV",
        color: "Rojo",
        status: "available",
        condition: "used",
        vin: "KNDPB3AC8F7123456",
        plate: "D123456",
        price: "1050000",
        dealerId: "d1234567-89ab-4cde-f012-3456789abcde", // Link to Ramona Auto Group
        concesionarioId: "c1111111-2222-3333-4444-555566667777",
        mileage: 1200,
        fuelType: "Gasolina",
        transmission: "Automática",
        engineSize: "2.4L",
        doors: 4,
        seats: 5,
      },
      {
        id: "55555555-eeee-4fff-8000-111111112222",
        brand: "Nissan",
        model: "Sentra",
        year: 2021,
        vehicleType: "Sedan",
        color: "Azul",
        status: "sold",
        condition: "used",
        vin: "3N1AB7AP5LY123456",
        plate: "E987654",
        price: "780000",
        dealerId: "d1234567-89ab-4cde-f012-3456789abcde", // Link to Ramona Auto Group
        concesionarioId: "c2222222-3333-4444-5555-666677778888",
        mileage: 15000,
        fuelType: "Gasolina",
        transmission: "CVT",
        engineSize: "1.8L",
        doors: 4,
        seats: 5,
      },
    ]);

    // Insert sample Clients
    console.log("👥 Inserting clients...");
    await db.insert(clients).values([
      {
        id: "cl111111-1111-4222-8333-444455556666",
        cedula: "00112345678",
        name: "Juan Carlos Pérez López",
        email: "juan.perez@email.com",
        phone: "8095551234",
        address: "Calle Primera #123, Los Alcarrizos, Santo Domingo Oeste",
        dealerId: "d1234567-89ab-4cde-f012-3456789abcde", // Link to Ramona Auto Group
      },
      {
        id: "cl222222-2222-4333-8444-555566667777",
        cedula: "00223456789",
        name: "María Elena Rodríguez García",
        email: "maria.rodriguez@email.com",
        phone: "8095552345",
        address: "Av. Independencia #456, Villa Duarte, Santo Domingo Este",
        dealerId: "d1234567-89ab-4cde-f012-3456789abcde", // Link to Ramona Auto Group
      },
      {
        id: "cl333333-3333-4444-8555-666677778888",
        cedula: "00334567890",
        name: "Carlos Antonio Gómez Santana",
        email: "carlos.gomez@email.com",
        phone: "8095553456",
        address: "Calle 27 de Febrero #789, Santiago",
        dealerId: "d2345678-9abc-4def-0123-456789abcdef", // Link to Auto Excellence RD
      },
      {
        id: "cl444444-4444-4555-8666-777788889999",
        cedula: "00445678901",
        name: "Laura Isabel Sánchez Fernández",
        email: "laura.sanchez@email.com",
        phone: "8095554567",
        address: "Av. Sarasota #321, Bella Vista, Santo Domingo",
        dealerId: "d1234567-89ab-4cde-f012-3456789abcde", // Link to Ramona Auto Group
      },
      {
        id: "cl555555-5555-4666-8777-888899990000",
        cedula: "00556789012",
        name: "Roberto Miguel Méndez Castro",
        email: "roberto.mendez@email.com",
        phone: "8095555678",
        address: "Calle Gustavo Mejía Ricart #654, Piantini, Santo Domingo",
        dealerId: "d1234567-89ab-4cde-f012-3456789abcde", // Link to Ramona Auto Group
      },
    ]);

    // Insert sample Contracts
    console.log("📋 Inserting contracts...");
    await db.insert(contracts).values([
      {
        id: "c0111111-aaaa-4bbb-8ccc-dddddddddddd",
        clientId: "cl555555-5555-4666-8777-888899990000",
        vehicleId: "55555555-eeee-4fff-8000-111111112222",
        price: "780000",
        status: "completed",
        financingType: "cash",
        downPayment: null,
        months: null,
        monthlyPayment: null,
        notes: "Venta al contado completada",
        date: new Date("2024-12-15"),
        dealerId: "d1234567-89ab-4cde-f012-3456789abcde", // Link to Ramona Auto Group
      },
      {
        id: "c0222222-bbbb-4ccc-8ddd-eeeeeeeeeeee",
        clientId: "cl111111-1111-4222-8333-444455556666",
        vehicleId: "11111111-aaaa-4bbb-8ccc-ddddeeeeeeee",
        price: "950000",
        status: "active",
        financingType: "financing",
        downPayment: "190000",
        months: 48,
        monthlyPayment: "15833",
        notes: "Financiamiento a 48 meses",
        date: new Date("2025-01-10"),
        dealerId: "d1234567-89ab-4cde-f012-3456789abcde", // Link to Ramona Auto Group
      },
      {
        id: "c0333333-cccc-4ddd-8eee-ffffffffffff",
        clientId: "cl222222-2222-4333-8444-555566667777",
        vehicleId: "22222222-bbbb-4ccc-8ddd-eeeeeeeeffff",
        price: "875000",
        status: "pending",
        financingType: "financing",
        downPayment: "175000",
        months: 36,
        monthlyPayment: "19444",
        notes: "Pendiente de documentación",
        date: new Date("2025-01-20"),
        dealerId: "d1234567-89ab-4cde-f012-3456789abcde", // Link to Ramona Auto Group
      },
    ]);

    // Insert sample Insurance policies
    console.log("🛡️ Inserting insurance policies...");
    await db.insert(insurance).values([
      {
        id: "i1111111-aaaa-4bbb-8ccc-dddddddddddd",
        vehicleId: "55555555-eeee-4fff-8000-111111112222",
        clientId: "cl555555-5555-4666-8777-888899990000",
        contractId: "c0111111-aaaa-4bbb-8ccc-dddddddddddd",
        startDate: new Date("2024-12-15"),
        expiryDate: new Date("2025-12-15"),
        coverageType: "full",
        coverageDuration: 12,
        premium: "45000",
        status: "active",
        dealerId: "d1234567-89ab-4cde-f012-3456789abcde", // Link to Ramona Auto Group
      },
      {
        id: "i2222222-bbbb-4ccc-8ddd-eeeeeeeeeeee",
        vehicleId: "11111111-aaaa-4bbb-8ccc-ddddeeeeeeee",
        clientId: "cl111111-1111-4222-8333-444455556666",
        contractId: "c0222222-bbbb-4ccc-8ddd-eeeeeeeeeeee",
        startDate: new Date("2025-01-10"),
        expiryDate: new Date("2026-01-10"),
        coverageType: "motor_transmission",
        coverageDuration: 12,
        premium: "38000",
        status: "active",
        dealerId: "d1234567-89ab-4cde-f012-3456789abcde", // Link to Ramona Auto Group
      },
    ]);

    console.log("✅ Database seeding completed successfully!");
    console.log("📈 Summary:");
    console.log("  - 2 dealers");
    console.log("  - 3 concesionarios");
    console.log("  - 5 vehicles");
    console.log("  - 5 clients");
    console.log("  - 3 contracts");
    console.log("  - 2 insurance policies");

    console.log("\n📋 Next steps:");
    console.log("  1. Create an admin user through Supabase Auth");
    console.log("  2. Add the user ID to the profiles table with admin role");
    console.log("  3. Set up Row Level Security (RLS) policies");
    console.log("  4. Test the application with real data");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run the seed script
seed();
