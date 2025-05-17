import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { bookings } from "./booking";

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  price: integer("price").notNull(), // In euros
  hours: integer("hours").notNull(),
  capacity: integer("capacity").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const packagesRelations = relations(packages, ({ many }) => ({
  bookings: many(bookings),
}));