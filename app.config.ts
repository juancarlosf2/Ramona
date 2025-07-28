import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  tsr: {
    appDirectory: "src",
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
    define: {
      // Define environment variables for the client
      "process.env.SUPABASE_URL": JSON.stringify(process.env.SUPABASE_URL),
      "process.env.SUPABASE_ANON_KEY": JSON.stringify(
        process.env.SUPABASE_ANON_KEY
      ),
    },
    optimizeDeps: {
      // Exclude server-only modules from client bundling
      exclude: [
        "~/server/auth",
        "~/server/vehicles",
        "~/server/clients",
        "~/server/contracts",
        "~/server/concesionarios",
        "~/server/dealers",
        "~/server/insurance",
        "~/server/utils",
        // Also exclude database and Node.js modules
        "postgres",
        "drizzle-orm",
        "node:fs",
        "node:path",
        "node:stream",
        "node:crypto",
        "node:os",
        "fs",
        "path",
        "stream",
        "crypto",
        "os",
        "net",
        "tls",
        "perf_hooks",
      ],
    },
    build: {
      rollupOptions: {
        external: [
          // Externalize Node.js built-in modules for client build
          "node:fs",
          "node:path",
          "node:stream",
          "node:crypto",
          "node:os",
          "node:async_hooks",
          "node:stream/web",
          "fs",
          "path",
          "stream",
          "crypto",
          "os",
          "net",
          "tls",
          "perf_hooks",
          "postgres",
          "drizzle-orm",
        ],
      },
    },
  },
});
