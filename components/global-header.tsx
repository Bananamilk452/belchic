"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
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
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@/resources/icons/ArrowRight";
import { ArrowLeftIcon } from "@/resources/icons/ArrowLeft";
import { MenuIcon } from "@/resources/icons/Menu";
import { SearchIcon } from "@/resources/icons/Search";
import { AccountIcon } from "@/resources/icons/Account";
import { WishlistIcon } from "@/resources/icons/Wishlist";
import { CartIcon } from "@/resources/icons/Cart";
import { ChevronDownIcon } from "lucide-react";

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

  return result;
}

function DesktopNavMenu({ menus }: { menus: Array<NavMenu> }) {
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
    <div className="flex-1 hidden md:flex flex-wrap">
      {menus.map((item, idx) =>
        "path" in item ? (
          <Link key={idx} className="p-2 group" href={item.path}>
            <span
              className={cn(
                "group-hover:border-b border-border",
                pathname === item.path && "border-b group-hover:border-black",
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
  );
}

function MobileNavSheet({
  menus,
  subtitle,
  Trigger,
}: {
  menus: Array<NavMenu>;
  subtitle?: string;
  Trigger?: () => React.ReactNode;
}) {
  const pathname = usePathname();

  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      {Trigger ? (
        <Trigger />
      ) : (
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon-lg" className="flex md:hidden">
            <MenuIcon className="size-5" />
          </Button>
        </SheetTrigger>
      )}
      <SheetContent side="left" showCloseButton={false}>
        <SheetHeader>
          <SheetTitle asChild>
            <div className="w-[100px]">
              <img src="/images/belchic_logo.png" alt="belchic logo" />
            </div>
          </SheetTitle>
          <SheetDescription />
        </SheetHeader>
        <div className="flex flex-col h-full w-full overflow-y-auto">
          {subtitle && (
            <button
              className="py-3 px-4.5 flex items-center gap-2"
              onClick={() => {
                setSheetOpen(false);
              }}
            >
              <ArrowLeftIcon className="size-4" />
              <span className="text-sm">{subtitle}</span>
            </button>
          )}
          {menus.map((item, idx) =>
            "path" in item ? (
              <Link
                key={idx}
                className={cn(
                  "py-2 px-6",
                  pathname === item.path && "bg-secondary",
                )}
                href={item.path}
                onClick={() => {
                  setSheetOpen(false);
                }}
              >
                <span className="text-lg">{item.label}</span>
              </Link>
            ) : (
              <MobileNavSheet
                key={idx}
                menus={item.submenu}
                subtitle={item.label}
                Trigger={() => (
                  <SheetTrigger className="py-2 px-6 w-full flex justify-between items-center">
                    <span className="text-lg">{item.label}</span>
                    <ArrowRightIcon className="size-4" />
                  </SheetTrigger>
                )}
              />
            ),
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function GlobalHeader() {
  return (
    <div className="w-full flex justify-center items-center bg-white border-b border-border">
      <div className="flex gap-6 justify-between items-center py-5 px-4 md:px-12 w-full max-w-7xl">
        <div className="flex items-center justify-center gap-2">
          <MobileNavSheet menus={NAV_MENU} />
          <Link href="/" className="w-[100px]">
            <img src="/images/belchic_logo.png" alt="belchic logo" />
          </Link>
        </div>
        <DesktopNavMenu menus={NAV_MENU} />
        <div className="flex items-center justify-center">
          <Button variant="ghost" size="icon-lg">
            <SearchIcon className="size-5" />
          </Button>
          <Button variant="ghost" className="hidden md:flex" size="icon-lg">
            <AccountIcon className="size-5" />
          </Button>
          <Button variant="ghost" size="icon-lg">
            <WishlistIcon className="size-5" />
          </Button>
          <Button variant="ghost" size="icon-lg">
            <CartIcon className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
