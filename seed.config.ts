import { SeedPostgres } from "@snaplet/seed/adapter-postgres";
import { defineConfig } from "@snaplet/seed/config";
import postgres from "postgres";

export default defineConfig({
  adapter: () => {
    const client = postgres(process.env.DATABASE_URL!, {
      // Configure connection to avoid issues with Supabase internal schemas
      prepare: false,
      transform: {
        undefined: null,
      },
    });

    return new SeedPostgres(client);
  },
});
