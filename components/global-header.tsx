"use client";

import {
  HeartIcon,
  MenuIcon,
  SearchIcon,
  ShoppingBagIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_MENU: Array<{ label: string; path: string }> = [
  {
    label: "HOME",
    path: "/",
  },
  {
    label: "새로 들어온 상품",
    path: "/new",
  },
];

export function GlobalHeader() {
  const pathname = usePathname();

  return (
    <div className="w-full flex justify-center items-center bg-white border-b border-border">
      <div className="flex gap-8 justify-between items-center py-5 px-4 md:px-12 w-full max-w-7xl">
        <div className="flex items-center justify-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" className="flex md:hidden">
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" showCloseButton={false}>
              <SheetHeader>
                <SheetTitle>Belchic</SheetTitle>
                <SheetDescription />
              </SheetHeader>
              <div className="flex-1 flex flex-col">
                {NAV_MENU.map((item) => (
                  <Link
                    key={item.label}
                    className={cn(
                      "py-2 px-6 group",
                      pathname === item.path && "bg-secondary",
                    )}
                    href={item.path}
                  >
                    <span className="text-lg">{item.label}</span>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <span className="text-lg">Belchic</span>
        </div>
        <div className="flex-1 hidden md:flex flex-wrap">
          {NAV_MENU.map((item) => (
            <Link key={item.label} className="p-2 group" href={item.path}>
              <span
                className={cn(
                  "group-hover:border-b border-border",
                  pathname === item.path && "border-b group-hover:border-black",
                )}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-center">
          <Button variant="ghost" size="icon-lg">
            <SearchIcon className="size-5" />
          </Button>
          <Button variant="ghost" className="hidden md:flex" size="icon-lg">
            <UserIcon className="size-5" />
          </Button>
          <Button variant="ghost" size="icon-lg">
            <HeartIcon className="size-5" />
          </Button>
          <Button variant="ghost" size="icon-lg">
            <ShoppingBagIcon className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
