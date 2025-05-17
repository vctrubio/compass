import { pgTable, serial, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { lessons } from "./lesson";

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  cash: boolean("cash").notNull(), // If false, it's a bank transfer
  createdDate: timestamp("created_date", { withTimezone: true }).notNull(),
  amount: integer("amount").notNull(), // In euros
});

export const paymentsRelations = relations(payments, ({ many }) => ({
  lessons: many(lessons),
}));