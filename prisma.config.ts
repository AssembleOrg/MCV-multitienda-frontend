import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use direct connection for CLI operations (migrations, push, seed)
    // PgBouncer (DATABASE_URL) is used at runtime by the app
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});
