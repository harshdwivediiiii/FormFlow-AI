import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./configs/schema.js",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_RKWZwgYE0o8M@ep-ancient-water-a5us8suh-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'
  }
});