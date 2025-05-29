import { createSeedClient } from "@snaplet/seed";

const main = async () => {
  const seed = await createSeedClient();

  // Clear existing data
  await seed.$resetDatabase();

  console.log("🌱 Starting database seeding with Snaplet...");

  // Create dealers first (they are the parent entities)
  console.log("📊 Creating dealers...");
  const dealers = await seed.dealers((x) =>
    x(2, {
      businessName: (ctx) =>
        ctx.seed.helpers.arrayElement([
          "Ramona Auto Group",
          "Auto Excellence RD",
        ]),
    })
  );

  console.log("🏢 Creating concesionarios...");
  // Create concesionarios linked to dealers
  await seed.concesionarios((x) =>
    x(3, (ctx) => ({
      name: ctx.seed.helpers.arrayElement([
        "AutoVentas Premium",
        "Vehículos del Este",
        "Auto Express Santiago",
      ]),
      dealerId: ctx.seed.helpers.arrayElement(dealers.map((d) => d.id)),
    }))
  );

  console.log("🚗 Creating vehicles...");
  // Create vehicles
  await seed.vehicles((x) =>
    x(10, (ctx) => ({
      status: ctx.seed.helpers.arrayElement(["available", "sold", "reserved"]),
      vehicleType: ctx.seed.helpers.arrayElement([
        "sedan",
        "suv",
        "hatchback",
        "truck",
      ]),
      condition: ctx.seed.helpers.arrayElement(["new", "used"]),
      dealerId: ctx.seed.helpers.arrayElement(dealers.map((d) => d.id)),
    }))
  );

  console.log("👥 Creating clients...");
  // Create clients
  await seed.clients((x) =>
    x(8, (ctx) => ({
      dealerId: ctx.seed.helpers.arrayElement(dealers.map((d) => d.id)),
    }))
  );

  console.log("📋 Creating contracts...");
  // Create contracts
  await seed.contracts((x) =>
    x(5, (ctx) => ({
      status: ctx.seed.helpers.arrayElement(["active", "pending", "completed"]),
      financingType: ctx.seed.helpers.arrayElement(["cash", "financing"]),
      dealerId: ctx.seed.helpers.arrayElement(dealers.map((d) => d.id)),
    }))
  );

  console.log("🛡️ Creating insurance policies...");
  // Create insurance policies
  await seed.insurance((x) =>
    x(4, (ctx) => ({
      status: ctx.seed.helpers.arrayElement([
        "active",
        "expiring_soon",
        "expired",
      ]),
      coverageType: ctx.seed.helpers.arrayElement([
        "motor_transmission",
        "full",
        "basic",
      ]),
      dealerId: ctx.seed.helpers.arrayElement(dealers.map((d) => d.id)),
    }))
  );

  console.log("✅ Database seeding completed successfully!");
  console.log("📈 Summary:");
  console.log("  - 2 dealers");
  console.log("  - 3 concesionarios");
  console.log("  - 10 vehicles");
  console.log("  - 8 clients");
  console.log("  - 5 contracts");
  console.log("  - 4 insurance policies");

  console.log("\n📋 Next steps:");
  console.log("  1. Create an admin user through Supabase Auth");
  console.log("  2. Add the user ID to the profiles table with admin role");
  console.log("  3. Set up Row Level Security (RLS) policies");
  console.log("  4. Test the application with real data");

  process.exit();
};

main();
