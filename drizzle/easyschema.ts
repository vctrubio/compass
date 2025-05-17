import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { languagesEnum } from "@/mvc/model/enums";

export const students = pgTable("students", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    languages: languagesEnum("languages").array().notNull(),
    age: integer("age").notNull(),
    authId: text("user_id"), // For (SUPERBASE) auth system integration
  });
  