import { z } from "zod";

// Create a Zod schema for availability window validation
export const availabilityWindowSchema = z.object({
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" })
}).refine((data) => {
  return data.endDate > data.startDate;
}, {
  message: "End date must be after start date",
  path: ["endDate"] // Path of the field that has the issue
});

// Define the AvailabilityWindow type from the schema
export type AvailabilityWindow = z.infer<typeof availabilityWindowSchema>;

// Default availability window object
export const defaultAvailabilityWindow: AvailabilityWindow = {
  startDate: new Date(),
  endDate: new Date(Date.now() + 3600000) // Default to 1 hour later
};

// Create a Zod schema for student availability window junction
export const studentAvailabilityWindowSchema = z.object({
  studentId: z.number().int().positive({ message: "Student ID is required" }),
  availabilityWindowId: z.number().int().positive({ message: "Availability Window ID is required" })
});

// Define the StudentAvailabilityWindow type from the schema
export type StudentAvailabilityWindow = z.infer<typeof studentAvailabilityWindowSchema>;

// Default student availability window object
export const defaultStudentAvailabilityWindow: StudentAvailabilityWindow = {
  studentId: 0,
  availabilityWindowId: 0
};
