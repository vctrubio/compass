import { pgTable, serial, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { lessons } from "./lesson";

export const postLessons = pgTable("post_lessons", {
  id: serial("id").primaryKey(),
  studentConfirmation: boolean("student_confirmation").notNull(),
});

export const postLessonsRelations = relations(postLessons, ({ many }) => ({
  lessons: many(lessons),
}));