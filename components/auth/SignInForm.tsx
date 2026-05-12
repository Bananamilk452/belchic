"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import { Button } from "../ui/button";
import { Field, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { authClient } from "@/lib/auth-client";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { signInSchema, type SignInFormValues } from "@/lib/schemas/auth.schema";

export function SignInForm() {
  const router = useRouter();
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      if (error.status === 400) {
        form.setError("email", { message: ERROR_MESSAGES.EMAIL_OR_PASSWORD_INVALID });
      } else {
        form.setError("email", { message: ERROR_MESSAGES.FAILED_TO_SIGN_IN });
      }
      return;
    }

    router.push("/");
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center">
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              className="mb-4"
              placeholder="이메일"
              autoComplete="email"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              className="mb-6"
              placeholder="비밀번호"
              type="password"
              autoComplete="current-password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button type="submit" size="lg">
        로그인
      </Button>
    </form>
  );
}
