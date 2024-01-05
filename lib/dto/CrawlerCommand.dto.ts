import { z } from "zod";

export const CrawlerCommandZSchema = z.object({
  dataSource: z.string().optional(), // Travelor or Booking
  destination: z.object({
    placeId: z.string().optional(),
    destination: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
  checkInDate: z.string().pipe(z.coerce.date()),
  checkOutDate: z.string().pipe(z.coerce.date()),
  guests: z.string().optional(),
  status: z.string().optional().default("PENDING"),
  assignedTo: z.string().optional(),
});

export type CrawlerCommandDto = z.infer<typeof CrawlerCommandZSchema>;
