import { z } from "zod";

// Define status enum based on schema
export const lessonStatusValues = ["created", "confirmed", "cancelled", "completed"] as const;

// Create a Zod schema for lesson validation
export const lessonSchema = z.object({
  teacherId: z.number().int().positive({ message: "Teacher ID is required" }),
  bookingId: z.number().int().positive({ message: "Booking ID is required" }),
  paymentId: z.number().int().positive({ message: "Payment ID is required" }).optional().nullable(),
  postLessonId: z.number().int().positive({ message: "Post Lesson ID is required" }).optional().nullable(),
  status: z.enum(lessonStatusValues).default("created"),
});

// Define the Lesson type from the schema
export type Lesson = z.infer<typeof lessonSchema>;

// Define the status type for easy access
export type LessonStatus = z.infer<typeof lessonSchema>["status"];

// Default lesson object
export const defaultLesson: Lesson = {
  teacherId: 0,
  bookingId: 0,
  paymentId: null,
  postLessonId: null,
  status: "created",
};
