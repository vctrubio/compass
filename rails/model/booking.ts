import { z } from "zod";

// Create a Zod schema for booking validation
export const bookingSchema = z.object({
  package_id: z.number().int().positive({ message: "Package ID is required" }),
  student_id: z.number().int().positive({ message: "Student ID is required" }),
  start_date: z.string().min(1, { message: "Start date is required" }), // Changed to string format for better DB compatibility
  created_at: z.string().optional() // Optional created_at timestamp
});

// Define the Booking type from the schema
export type Booking = z.infer<typeof bookingSchema>;

// Default booking object
export const defaultBooking: Booking = {
  package_id: 0,
  student_id: 0,
  start_date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
  created_at: new Date().toISOString() // Include timestamp in ISO format
};
