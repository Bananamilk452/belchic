"use client";

import {
  ChevronDownIcon,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { group } from "node:console";

type NavMenu =
  | {
      label: string;
      path: string;
    }
  | {
      label: string;
      submenu: Array<NavMenu>;
    };

const NAV_MENU: Array<NavMenu> = [
  {
    label: "HOME",
    path: "/",
  },
  {
    label: "새로 들어온 상품",
    path: "/new",
  },
  {
    label: "드롭다운 테스트",
    submenu: [
      {
        label: "테스트 메뉴 1",
        path: "/1",
      },
      {
        label: "테스트 메뉴 2",
        path: "/2",
      },
      {
        label: "드롭다운 테스트",
        submenu: [
          {
            label: "테스트 메뉴 1",
            path: "/1",
          },
          {
            label: "테스트 메뉴 2",
            path: "/2",
          },
        ],
      },
    ],
  },
];

/**
 * 서브메뉴의 아이템을 그룹화에서 드롭다운의 하위메뉴 처리를 보조하는 함수
 * @param submenu 서브메뉴 데이터
 * @returns Array가 반환되면 Group으로 처리하고, object가 반환되면 subMenu로 처리하기.
 */
function groupSubMenu(
  submenu: Array<NavMenu>,
): Array<Array<NavMenu> | NavMenu> {
  const result = [];

  let chunk: Array<NavMenu> = [];
  for (const item of submenu) {
    if ("submenu" in item) {
      if (chunk.length > 0) {
        result.push(chunk);
        chunk = [];
      }

      result.push(item);
    } else {
      chunk.push(item);
    }
  }

  if (chunk.length > 0) result.push(chunk);

  console.log("grouped result : ", result);

  return result;
}

export function GlobalHeader() {
  const pathname = usePathname();

  const generateDropdownContent = (submenu: Array<NavMenu>) =>
    groupSubMenu(submenu).map((subItem, idx) =>
      Array.isArray(subItem) ? (
        <DropdownMenuGroup key={idx}>
          {subItem.map(
            (submenuItem) =>
              "path" in submenuItem && (
                <DropdownMenuItem key={submenuItem.label}>
                  {submenuItem.label}
                </DropdownMenuItem>
              ),
          )}
        </DropdownMenuGroup>
      ) : (
        <DropdownMenuSub key={idx}>
          <DropdownMenuSubTrigger>{subItem.label}</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="rounded-none **:rounded-none">
              {"submenu" in subItem && generateDropdownContent(subItem.submenu)}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      ),
    );

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
                {NAV_MENU.map(
                  (item) =>
                    "path" in item && (
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
                    ),
                )}
              </div>
            </SheetContent>
          </Sheet>
          <span className="text-lg">Belchic</span>
        </div>
        <div className="flex-1 hidden md:flex flex-wrap">
          {NAV_MENU.map((item) =>
            "path" in item ? (
              <Link key={item.label} className="p-2 group" href={item.path}>
                <span
                  className={cn(
                    "group-hover:border-b border-border",
                    pathname === item.path &&
                      "border-b group-hover:border-black",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            ) : (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger asChild>
                  <div className="p-2 flex items-center cursor-pointer group">
                    <span className={cn("group-hover:border-b border-border")}>
                      {item.label}
                    </span>
                    <ChevronDownIcon strokeWidth={1} className="size-5" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-none **:rounded-none">
                  {generateDropdownContent(item.submenu)}
                </DropdownMenuContent>
              </DropdownMenu>
            ),
          )}
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
