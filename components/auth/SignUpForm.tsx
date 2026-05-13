"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import { Button } from "../ui/button";
import { Field, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { authClient } from "@/lib/auth-client";
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
  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: SignUpFormValues) => {
    const { error } = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
    });

    if (error) {
      form.setError("root", { message: error.message });
      return;
    }

    router.push("/");
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
              type="email"
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

      {form.formState.errors.root && <FieldError errors={[form.formState.errors.root]} />}

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "계정 생성 중..." : "계정 생성"}
      </Button>
    </form>
  );
}
