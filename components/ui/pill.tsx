import { cn } from "@/lib/utils";

export function Pill({
  children,
  active = false,
}: {
  children?: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full border border-black px-4 py-2 text-sm", {
        "bg-black text-white": active,
        "bg-white text-black": !active,
      })}
    >
      {children}
    </span>
  );
}
