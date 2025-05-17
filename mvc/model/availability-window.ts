import { pgTable, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { students } from "./student";

export const availabilityWindows = pgTable("availability_windows", {
  id: serial("id").primaryKey(),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const studentAvailabilityWindows = pgTable("student_availability_windows", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  availabilityWindowId: integer("availability_window_id").notNull().references(() => availabilityWindows.id),
});

export const studentAvailabilityWindowsRelations = relations(studentAvailabilityWindows, ({ one }) => ({
  student: one(students, {
    fields: [studentAvailabilityWindows.studentId],
    references: [students.id],
  }),
  availabilityWindow: one(availabilityWindows, {
    fields: [studentAvailabilityWindows.availabilityWindowId],
    references: [availabilityWindows.id],
  }),
}));

export const availabilityWindowsRelations = relations(availabilityWindows, ({ many }) => ({
  students: many(studentAvailabilityWindows),
}));
