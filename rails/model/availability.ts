import { z } from "zod";

export const availabilityWindowSchema = z.object({
  start_date: z.date({ required_error: "Start date is required" }),
  end_date: z.date({ required_error: "End date is required" })
}).refine((data) => {
  return data.end_date > data.start_date;
}, {
  message: "End date must be after start date",
  path: ["end_date"] // Path of the field that has the issue
});

export const defaultAvailabilityWindow: AvailabilityWindow = {
    start_date: new Date(),
    end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // Default to 2 days later
};

///
export const studentAvailabilityWindowSchema = z.object({
    student_id: z.number().int().positive({ message: "Student ID is required" }),
    availability_window_id: z.number().int().positive({ message: "Availability Window ID is required" })
});

export const defaultStudentAvailabilityWindow: StudentAvailabilityWindow = {
    student_id: 0,
    availability_window_id: 0
};

export type AvailabilityWindow = z.infer<typeof availabilityWindowSchema>;
export type StudentAvailabilityWindow = z.infer<typeof studentAvailabilityWindowSchema>;