import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type Database = ReturnType<typeof create>;

function create() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  // `casing: snake_case` lets the schema use camelCase JS names.
  const client = postgres(connectionString);
  return drizzle(client, { schema, casing: "snake_case" });
}

// Lazy singleton: the connection is created on first use, not at import — so
// importing @classroom/db during a build (page-data collection, bundling) never
// requires DATABASE_URL to be set.
let instance: Database | undefined;

export const db: Database = new Proxy({} as Database, {
  get(_target, prop, receiver) {
    if (!instance) instance = create();
    return Reflect.get(instance, prop, receiver);
  },
});

export { schema };
export * from "./schema";
