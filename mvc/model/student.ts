import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { languagesEnum } from "./enums";
import { studentAvailabilityWindows } from "./student-availability-window";
import { bookings } from "./booking";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  languages: languagesEnum("languages").array().notNull(),
  age: integer("age").notNull(),
  userId: text("user_id"), // For auth system integration
});

export const studentsRelations = relations(students, ({ many }) => ({
  availabilityWindows: many(studentAvailabilityWindows),
  bookings: many(bookings), // Direct relation to bookings
}));