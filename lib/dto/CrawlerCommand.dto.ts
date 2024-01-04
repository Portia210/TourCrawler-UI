import { z } from "zod";

export const CrawlerCommandZSchema = z.object({
  dataSource: z.string().optional(), // Travelor or Booking
  destination: z.string(),
  checkInDate: z.string().pipe(z.coerce.date()),
  checkOutDate: z.string().pipe(z.coerce.date()),
  adult: z.number(),
  children: z.number(),
  rooms: z.number(),
  status: z.string().optional().default("PENDING"),
  assignedTo: z.string().optional(),
});

export type CrawlerCommandDto = z.infer<typeof CrawlerCommandZSchema>;
