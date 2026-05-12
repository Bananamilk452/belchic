"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import { Button } from "../ui/button";
import { Field, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { authClient } from "@/lib/auth-client";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { signUpSchema, type SignUpFormValues } from "@/lib/schemas/auth.schema";

export function SignUpForm() {
  const router = useRouter();
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    const { error } = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
    });

    if (error) {
      if (error.status === 409) {
        form.setError("email", { message: ERROR_MESSAGES.EMAIL_ALREADY_IN_USE });
      } else {
        form.setError("email", { message: ERROR_MESSAGES.FAILED_TO_SIGN_UP });
      }
      return;
    }

    router.push("/sign-in");
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              className="mb-4"
              placeholder="이름"
              autoComplete="name"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
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
              className="mb-4"
              placeholder="비밀번호"
              type="password"
              autoComplete="new-password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="passwordConfirm"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              className="mb-6"
              placeholder="비밀번호 확인"
              type="password"
              autoComplete="new-password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button type="submit" size="lg">
        회원가입
      </Button>
    </form>
  );
}
