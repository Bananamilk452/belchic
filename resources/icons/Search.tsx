import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";

export function SearchIcon({
  className,
  ...props
}: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      className={cn(
        "icon icon-search flex justify-center items-center",
        className,
      )}
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 18 19"
      width="32"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.03 11.68A5.784 5.784 0 112.85 3.5a5.784 5.784 0 018.18 8.18zm.26 1.12a6.78 6.78 0 11.72-.7l5.4 5.4a.5.5 0 11-.71.7l-5.41-5.4z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
