import { z } from "zod";

export const CrawlerCommandZSchema = z.object({
  dataSource: z.string().optional(), // Travelor or Booking
  sessionId: z.string().optional(),
  destination: z.object({
    placeId: z.string().optional(),
    destination: z.string().optional(),
    dest_type: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
  checkInDate: z.any().optional(),
  checkOutDate: z.any().optional(),
  rooms: z.number().optional(),
  adult: z.number().optional(),
  children: z.number().optional(),
  childrenAges: z.array(z.number()).optional(),
  guests: z.string().optional(),
  status: z.string().optional().default("PENDING"),
  message: z.any().optional(),
  assignedTo: z.string().optional(),
});

export type CrawlerCommandDto = z.infer<typeof CrawlerCommandZSchema>;
