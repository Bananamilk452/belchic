import { HeartIcon, SearchIcon, ShoppingBagIcon, UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const NAV_MENU: Array<{ label: string; path: string }> = [
  {
    label: "HOME",
    path: "/",
  },
  {
    label: "새로 들어온 상품",
    path: "/",
  },
];

export function GlobalHeader() {
  return (
    <div className="w-full flex justify-center items-center bg-white border-b border-border">
      <div className="flex gap-8 justify-between items-center py-5 px-4 md:px-12 w-full max-w-7xl">
        <div>
          <span className="text-lg">belchic</span>
        </div>
        <div className="flex-1 hidden md:flex flex-wrap">
          {NAV_MENU.map((item) => (
            <Link key={item.label} className="p-2 group" href={item.path}>
              <span className="group-hover:border-b border-border">
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
