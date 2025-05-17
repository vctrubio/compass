import { pgTable, serial, text, numeric, pgEnum } from "drizzle-orm/pg-core";

export const equipmentTypeEnum = pgEnum("equipment_type", [
  "kite",
  "bar",
  "board",
]);

export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  type: equipmentTypeEnum("type").notNull(),
  model: text("model").notNull(),
  size: numeric("size").notNull(),
});
