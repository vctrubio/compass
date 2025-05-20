import { z } from "zod";

export const availabilityWindowSchema = z.object({
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" })
}).refine((data) => {
  return data.endDate > data.startDate;
}, {
  message: "End date must be after start date",
  path: ["endDate"] // Path of the field that has the issue
});

export const defaultAvailabilityWindow: AvailabilityWindow = {
    startDate: new Date(),
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // Default to 2 days later
};

///
export const studentAvailabilityWindowSchema = z.object({
    studentId: z.number().int().positive({ message: "Student ID is required" }),
    availabilityWindowId: z.number().int().positive({ message: "Availability Window ID is required" })
});

export const defaultStudentAvailabilityWindow: StudentAvailabilityWindow = {
    studentId: 0,
    availabilityWindowId: 0
};

export type AvailabilityWindow = z.infer<typeof availabilityWindowSchema>;
export type StudentAvailabilityWindow = z.infer<typeof studentAvailabilityWindowSchema>;