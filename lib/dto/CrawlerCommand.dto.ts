import { z } from "zod";

const CrawlerCommandDto = z.object({
  dataSource: z.string(), // Travelor or Booking
  destination: z.string(),
  checkInDate: z.date(),
  checkOutDate: z.date(),
  adult: z.number(),
  children: z.number(),
  rooms: z.number(),
});

export type CrawlerCommandDto = z.infer<typeof CrawlerCommandDto>;
