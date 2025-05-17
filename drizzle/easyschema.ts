import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const studentsTesting = pgTable("studentsTesting", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    age: integer("age").notNull(),
    authId: text("user_id"), // For (SUPERBASE) auth system integration
  });
  