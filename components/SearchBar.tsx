"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Field, FieldError } from "./ui/field";
import { Input } from "./ui/input";
import { searchSchema, type SearchFormValues } from "@/lib/schemas/search.schema";

type SearchBarProps = {
  onSubmit: (values: SearchFormValues) => void;
  defaultValue?: string;
};

export function SearchBar({ onSubmit, defaultValue }: SearchBarProps) {
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: defaultValue || "",
    },
  });

  useEffect(() => {
    if (defaultValue) {
      form.setValue("query", defaultValue);
    }
  }, [defaultValue, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="relative w-[768px]">
      <Controller
        name="query"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              placeholder="검색"
              className="w-full"
              autoComplete="off"
            />
            <button
              type="submit"
              className="absolute top-1/2 right-3 w-auto! -translate-y-1/2 cursor-pointer"
            >
              <SearchIcon className="size-5" />
            </button>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
}
