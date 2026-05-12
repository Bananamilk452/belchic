import { z } from "zod";
import { ko } from "zod/locales";

import { ERROR_MESSAGES } from "../error-messages";

z.config(ko());

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, ERROR_MESSAGES.EMAIL_REQUIRED)
    .email(ERROR_MESSAGES.EMAIL_INVALID),
  password: z.string().min(1, ERROR_MESSAGES.PASSWORD_REQUIRED),
});

export const signUpSchema = z
  .object({
    name: z.string().trim().min(1, ERROR_MESSAGES.NAME_REQUIRED),
    email: z
      .string()
      .trim()
      .min(1, ERROR_MESSAGES.EMAIL_REQUIRED)
      .email(ERROR_MESSAGES.EMAIL_INVALID),
    password: z.string().min(8, ERROR_MESSAGES.PASSWORD_MIN_LENGTH),
    passwordConfirm: z.string().min(1, ERROR_MESSAGES.PASSWORD_CONFIRM_REQUIRED),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: ERROR_MESSAGES.PASSWORD_CONFIRM_MISMATCH,
    path: ["passwordConfirm"],
  });

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
