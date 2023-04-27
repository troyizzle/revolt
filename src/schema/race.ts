import { z } from "zod";

export const addRaceResultsSchema = z.object({
  map: z.string(),
  laps: z.number(),
  date: z.string(),
  results: z.array(z.object({
    position: z.number(),
    player: z.string(),
    car: z.string(),
    time: z.string(),
    bestLap: z.string(),
    finished: z.boolean(),
    cheating: z.boolean(),
  })),
})

export type addRaceResultsInput = z.infer<typeof addRaceResultsSchema>;
