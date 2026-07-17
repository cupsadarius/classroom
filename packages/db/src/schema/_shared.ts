import { timestamp, uuid } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

// UUID v7 primary key — time-sortable for good index locality (#5), generated app-side.
export const primaryId = () =>
  uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7());

// createdAt + updatedAt on every domain table (timestamptz, default now).
export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

// Soft-delete marker for domain entities (the append-only events table is hard-only).
export const softDelete = {
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
};
