import { z } from 'zod';

const BookingSchema = z.object({
    id: z.number().int().positive(),
    studentId: z.number().int().positive(),
    priceId: z.number().int().positive(),
    createdAt: z.date().default(() => new Date()),
});

export type Booking = z.infer<typeof BookingSchema>;
export { BookingSchema };