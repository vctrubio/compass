import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { languagesEnum } from "./enums";
import { lessons } from "./lesson";

export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  languages: languagesEnum("languages").array().notNull(),
  userId: text("user_id"), // For auth system integration
});

export const teachersRelations = relations(teachers, ({ many }) => ({
  lessons: many(lessons),
}));