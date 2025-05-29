#!/usr/bin/env tsx
// Apply RLS policies to the database
import { Pool } from "pg";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

async function applyRLSPolicies() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });

  try {
    console.log("🔒 Applying Row Level Security policies...");

    // Read the RLS policies SQL file
    const rlsPoliciesPath = join(
      __dirname,
      "..",
      "supabase",
      "rls-policies.sql"
    );
    const rlsPoliciesSQL = readFileSync(rlsPoliciesPath, "utf-8");

    // Execute the RLS policies
    await pool.query(rlsPoliciesSQL);

    console.log("✅ Row Level Security policies applied successfully!");

    // Test that RLS is enabled
    console.log("\n🧪 Testing RLS setup...");

    const tablesWithRLS = [
      "profiles",
      "dealers",
      "concesionarios",
      "vehicles",
      "clients",
      "contracts",
      "insurance",
    ];

    for (const table of tablesWithRLS) {
      const result = await pool.query(
        `
        SELECT relname, relrowsecurity 
        FROM pg_class 
        WHERE relname = $1 AND relrowsecurity = true
      `,
        [table]
      );

      if (result.rows.length > 0) {
        console.log(`✅ RLS enabled on table: ${table}`);
      } else {
        console.log(`❌ RLS NOT enabled on table: ${table}`);
      }
    }

    // Check if helper functions exist
    const functionsResult = await pool.query(`
      SELECT proname 
      FROM pg_proc 
      WHERE proname IN ('get_user_dealer_id', 'is_user_admin')
    `);

    console.log(
      `\n📋 Helper functions created: ${functionsResult.rows.length}/2`
    );
    functionsResult.rows.forEach((row) => {
      console.log(`✅ Function: ${row.proname}`);
    });

    // Check number of policies created
    const policiesResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM pg_policies 
      WHERE schemaname = 'public'
    `);

    console.log(
      `\n🛡️  Total RLS policies created: ${policiesResult.rows[0].count}`
    );
  } catch (error) {
    console.error("❌ Error applying RLS policies:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  applyRLSPolicies();
}

export { applyRLSPolicies };
