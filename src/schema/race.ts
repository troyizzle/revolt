import { z } from "zod";

export const raceCsvResult = z.object({
  position: z.number(),
  player: z.string(),
  car: z.string(),
  time: z.string(),
  bestLap: z.string(),
  finished: z.boolean(),
  cheating: z.boolean(),
})

export const raceCsvResultsSchema = z.object({
  map: z.string(),
  laps: z.number(),
  results: z.array(raceCsvResult)
})

export type RaceCsvResults = z.infer<typeof raceCsvResultsSchema>

export const addRaceResultsInput = raceCsvResultsSchema.extend({
  eventId: z.string(),
  file: z.string().optional(),
})

export type AddRaceResultsInput = z.infer<typeof addRaceResultsInput>
