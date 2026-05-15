import { z } from "zod";
import { ko } from "zod/locales";

import { ERROR_MESSAGES } from "../error-messages";

z.config(ko());

export const searchSchema = z.object({
  query: z.string().trim().min(1, ERROR_MESSAGES.SEARCH_QUERY_REQUIRED),
});

export type SearchFormValues = z.infer<typeof searchSchema>;
