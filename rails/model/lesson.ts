import { z } from "zod";

// Define status enum based on schema
export const lessonStatusValues = ["created", "confirmed", "cancelled", "completed"] as const;

// Create a Zod schema for lesson validation
export const lessonSchema = z.object({
  id: z.number().optional(), // Add ID field for existing lessons
  teacher_id: z.number().int().positive({ message: "Teacher ID is required" }),
  booking_id: z.number().int().positive({ message: "Booking ID is required" }),
  payment_id: z.number().int().positive({ message: "Payment ID is required" }).optional().nullable(),
  post_lesson_id: z.number().int().positive({ message: "Post Lesson ID is required" }).optional().nullable(),
  status: z.enum(lessonStatusValues).default("created"),
});

// Define the Lesson type from the schema
export type Lesson = z.infer<typeof lessonSchema>;

// Define the status type for easy access
export type LessonStatus = z.infer<typeof lessonSchema>["status"];

// Default lesson object
export const defaultLesson: Lesson = {
  teacher_id: 0,
  booking_id: 0,
  payment_id: null,
  post_lesson_id: null,
  status: "created",
};
