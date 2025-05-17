import { pgTable, serial, integer, timestamp, pgEnum} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { teachers } from "./teacher";
import { bookings } from "./booking";
import { payments } from "./payment";
import { postLessons } from "./post-lesson";
import { lessonSessions } from "./lesson-session";

export const statusEnum = pgEnum("status", [
  "created",
  "confirmed",
  "cancelled",
  "completed",
]);

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull().references(() => teachers.id),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  paymentId: integer("payment_id").references(() => payments.id),
  postLessonId: integer("post_lesson_id").references(() => postLessons.id),
  status: statusEnum("status").notNull().default("created"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  teacher: one(teachers, {
    fields: [lessons.teacherId],
    references: [teachers.id],
  }),
  booking: one(bookings, {
    fields: [lessons.bookingId],
    references: [bookings.id],
  }),
  payment: one(payments, {
    fields: [lessons.paymentId],
    references: [payments.id],
  }),
  postLesson: one(postLessons, {
    fields: [lessons.postLessonId],
    references: [postLessons.id],
  }),
  sessions: many(lessonSessions),
}));