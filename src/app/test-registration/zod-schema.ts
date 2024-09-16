import { z } from "zod";

const bookingTimeSchema = z.object({
    date: z.date(),
    time: z.string(),
});

export { bookingTimeSchema }