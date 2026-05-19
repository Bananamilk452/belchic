"use client";

import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

import { SearchBar } from "./SearchBar";
import { Dimmer } from "./ui/dimmer";

import type { SearchFormValues } from "@/lib/schemas/search.schema";

type SearchTabProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SearchTab({ open, onOpenChange }: SearchTabProps) {
  const router = useRouter();

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  const handleSubmit = (values: SearchFormValues) => {
    router.push(`/search?q=${encodeURIComponent(values.query)}`);
    handleClose();
  };

  return (
    open && (
      <Dimmer onClick={handleClose}>
        <div className="relative flex h-[65px] animate-slide-in-bottom items-center justify-center bg-white px-[60px] md:min-h-[180px]">
          <button className="cursor-pointer" onClick={handleClose}>
            <XIcon className="absolute top-1/2 right-3 -translate-y-1/2 md:top-3 md:right-3 md:translate-0" />
          </button>

          <SearchBar onSubmit={handleSubmit} />
        </div>
      </Dimmer>
    )
  );
}
