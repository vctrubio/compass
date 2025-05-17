import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { students } from "./student";
import { packages } from "./package";
import { lessons } from "./lesson";

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  packageId: integer("package_id").notNull().references(() => packages.id),
  studentId: integer("student_id").notNull().references(() => students.id),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  package: one(packages, {
    fields: [bookings.packageId],
    references: [packages.id],
  }),
  student: one(students, {
    fields: [bookings.studentId],
    references: [students.id],
  }),
  lessons: many(lessons),
}));