import { z } from "zod";

// Create a Zod schema for booking validation
export const bookingSchema = z.object({
  packageId: z.number().int().positive({ message: "Package ID is required" }),
  studentId: z.number().int().positive({ message: "Student ID is required" }),
  startDate: z.date({ required_error: "Start date is required" }),
});

// Define the Booking type from the schema
export type Booking = z.infer<typeof bookingSchema>;

// Default booking object
export const defaultBooking: Booking = {
  packageId: 0,
  studentId: 0,
  startDate: new Date()
};
