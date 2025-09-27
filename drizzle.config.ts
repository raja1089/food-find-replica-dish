import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    host: "103.38.50.233",
    port: 3306,
    user: "niharsk_qookkar",
    password: "niharsk_qookkar",
    database: "niharsk_qookkar"
  },
});
