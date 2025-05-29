#!/usr/bin/env tsx
// Create Admin User Profile Script
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function createAdminUser() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Missing required environment variables:");
    console.error("   SUPABASE_URL and SUPABASE_ANON_KEY");
    console.error("   Please check your .env file");
    return;
  }

  // Create Supabase client with anon key
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    console.log("🔍 Fetching available dealers...");

    // Get available dealers
    const { data: dealers, error: dealersError } = await supabase
      .from("dealers")
      .select("id, business_name");

    if (dealersError) {
      console.error("❌ Error fetching dealers:", dealersError);
      return;
    }

    if (!dealers || dealers.length === 0) {
      console.error(
        "❌ No dealers found. Please run the seeding script first."
      );
      return;
    }

    console.log("📋 Available dealers:");
    dealers.forEach((dealer, index) => {
      console.log(
        `   ${index + 1}. ${dealer.business_name} (ID: ${dealer.id})`
      );
    });

    // For this example, we'll use the first dealer
    const selectedDealer = dealers[0];
    console.log(`\n🎯 Using dealer: ${selectedDealer.business_name}`);

    // Create a test admin user in auth.users
    console.log("\n👤 Creating admin user in auth.users...");

    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email: "admin@ramona.com",
        password: "admin123!", // Change this to a secure password
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: "Admin User",
        },
      });

    if (authError) {
      console.error("❌ Error creating auth user:", authError);
      return;
    }

    console.log(`✅ Auth user created with ID: ${authUser.user?.id}`);

    // Create profile for the admin user
    console.log("\n📝 Creating admin profile...");

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: authUser.user!.id,
        email: "admin@ramona.com",
        full_name: "Admin User",
        role: "admin",
        dealer_id: selectedDealer.id,
      })
      .select()
      .single();

    if (profileError) {
      console.error("❌ Error creating profile:", profileError);
      return;
    }

    console.log("✅ Admin profile created successfully!");

    // Verify the setup
    console.log("\n🧪 Verifying admin setup...");

    const { data: verifyProfile, error: verifyError } = await supabase
      .from("profiles")
      .select(
        `
        id,
        email,
        full_name,
        role,
        dealer_id,
        dealers!inner(business_name)
      `
      )
      .eq("id", authUser.user!.id)
      .single();

    if (verifyError) {
      console.error("❌ Error verifying profile:", verifyError);
      return;
    }

    console.log("✅ Admin user setup complete!");
    console.log("\n📋 Admin User Details:");
    console.log(`   Email: ${verifyProfile.email}`);
    console.log(`   Name: ${verifyProfile.full_name}`);
    console.log(`   Role: ${verifyProfile.role}`);
    console.log(`   Dealer: ${(verifyProfile.dealers as any).business_name}`);
    console.log(`   User ID: ${verifyProfile.id}`);

    console.log("\n🔐 Login Credentials:");
    console.log("   Email: admin@ramona.com");
    console.log("   Password: admin123!");
    console.log("\n⚠️  Remember to change the password after first login!");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  createAdminUser();
}

export { createAdminUser };
