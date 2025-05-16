import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Define status enum for lessons
const statusEnum = pgEnum("status", [
  "created",
  "confirmed",
  "cancelled",
  "completed",
]);
const languagesEnum = pgEnum("languages", [
  "english",
  "german",
  "french",
  "spanish",
]);

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  languages: languagesEnum("languages").array().notNull(),
});

// Teachers table
export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  languages: languagesEnum("languages").array().notNull(),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  price: integer("price").notNull(),
  studentId: integer("student_id")
    .notNull()
    .references(() => students.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Lessons table
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id")
    .notNull()
    .references(() => bookings.id),
  teacherId: integer("teacher_id")
    .notNull()
    .references(() => teachers.id),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  status: statusEnum("status").notNull(),
});

// Define relationships /////////////////////////////////////////////
export const studentsRelations = relations(students, ({ many }) => ({
  bookings: many(bookings),
}));

export const teachersRelations = relations(teachers, ({ many }) => ({
  lessons: many(lessons),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  student: one(students, {
    fields: [bookings.studentId],
    references: [students.id],
  }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
  booking: one(bookings, {
    fields: [lessons.bookingId],
    references: [bookings.id],
  }),
  teacher: one(teachers, {
    fields: [lessons.teacherId],
    references: [teachers.id],
  }),
}));

// Example query (not part of schema):
// const result = await db.query.lessons.findMany({
//   with: {
//     booking: {
//       with: {
//         student: true
//       }
//     }
//   }
// });
