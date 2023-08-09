import { z } from "zod";

export const suggestionNewSchema = z.object({
  name: z.string().optional(),
  message: z.string({
    required_error: "Please enter a message",
  }).min(5, "Message must be at least 5 characters")
})

export type SuggestionNewInput = z.infer<typeof suggestionNewSchema>;
