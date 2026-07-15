import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "../shared/schema";

const connectionString = process.env.DATABASE_URL?.trim();

// For migrations and queries
const migrationClient = connectionString ? postgres(connectionString, { max: 1 }) : null;

// For regular queries
const queryClient = connectionString ? postgres(connectionString) : null;

export const db = queryClient ? drizzle(queryClient, { schema }) : null as any;

// Run migrations (uncomment this if you want to run migrations on startup)
// export const runMigrations = async () => {
//   try {
//     console.log("Running migrations...");
//     await migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" });
//     console.log("Migrations completed successfully");
//   } catch (error) {
//     console.error("Error running migrations:", error);
//     throw error;
//   } finally {
//     await migrationClient.end();
//   }
// };