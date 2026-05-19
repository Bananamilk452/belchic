"use client";

import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { SearchTab } from "./SearchTab";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { cn } from "@/lib/utils";
import { AccountIcon } from "@/resources/icons/Account";
import { ArrowLeftIcon } from "@/resources/icons/ArrowLeft";
import { ArrowRightIcon } from "@/resources/icons/ArrowRight";
import { CartIcon } from "@/resources/icons/Cart";
import { MenuIcon } from "@/resources/icons/Menu";
import { SearchIcon } from "@/resources/icons/Search";
import { WishlistIcon } from "@/resources/icons/Wishlist";

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
    path: "/collections/new",
  },
  {
    label: "Belchic",
    path: "/collections/belchic",
  },
  {
    label: "👑랭킹👑",
    path: "/collections/best",
  },
  {
    label: "지뢰계",
    path: "/collections/jirai",
  },
  {
    label: "로리타",
    path: "/collections/lolita",
  },
  {
    label: "차이나",
    path: "/collections/china",
  },
  {
    label: "고딕",
    path: "/collections/gothic",
  },
  {
    label: "서브컬쳐",
    path: "/collections/subculture",
  },
  // {
  //   label: "드롭다운 테스트",
  //   submenu: [
  //     {
  //       label: "테스트 메뉴 1",
  //       path: "/1",
  //     },
  //     {
  //       label: "테스트 메뉴 2",
  //       path: "/2",
  //     },
  //     {
  //       label: "드롭다운 테스트",
  //       submenu: [
  //         {
  //           label: "테스트 메뉴 1",
  //           path: "/1",
  //         },
  //         {
  //           label: "테스트 메뉴 2",
  //           path: "/2",
  //         },
  //       ],
  //     },
  //   ],
  // },
];

/**
 * 서브메뉴의 아이템을 그룹화에서 드롭다운의 하위메뉴 처리를 보조하는 함수
 * @param submenu 서브메뉴 데이터
 * @returns Array가 반환되면 Group으로 처리하고, object가 반환되면 subMenu로 처리하기.
 */
function groupSubMenu(submenu: Array<NavMenu>): Array<Array<NavMenu> | NavMenu> {
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
                <DropdownMenuItem key={submenuItem.label}>{submenuItem.label}</DropdownMenuItem>
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
    <div className="hidden flex-1 flex-wrap gap-3 md:flex">
      {menus.map((item, idx) =>
        "path" in item ? (
          <Link key={idx} className="group p-2" href={item.path}>
            <span
              className={cn(
                "border-border group-hover:border-b",
                pathname === item.path && "border-b group-hover:border-black",
              )}
            >
              {item.label}
            </span>
          </Link>
        ) : (
          <DropdownMenu key={item.label}>
            <DropdownMenuTrigger asChild>
              <div className="group flex cursor-pointer items-center p-2">
                <span className={cn("border-border group-hover:border-b")}>{item.label}</span>
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
        <div className="flex h-full w-full flex-col overflow-y-auto">
          {subtitle && (
            <button
              className="flex items-center gap-2 px-4.5 py-3"
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
                className={cn("px-6 py-2", pathname === item.path && "bg-secondary")}
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
                  <SheetTrigger className="flex w-full items-center justify-between px-6 py-2">
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
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex w-full flex-col items-center justify-center border-b border-border bg-white">
      <aside className="w-full bg-black py-2 text-center text-xs text-white">
        정보: 프론트엔드 기술 데모 및 포트폴리오를 위한 사이트입니다. 실제 서비스가 아니며, 모든
        상품과 정보는{" "}
        <Link
          href="https://belchic.shop/"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Belchic 쇼핑몰
        </Link>
        에서 확인해주세요.
      </aside>
      <div className="flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-5 md:px-12">
        <div className="flex items-center justify-center gap-2">
          <MobileNavSheet menus={NAV_MENU} />
          <Link href="/" className="w-[100px]">
            <img src="/images/belchic_logo.png" alt="belchic logo" />
          </Link>
        </div>
        <DesktopNavMenu menus={NAV_MENU} />
        <div className="flex items-center justify-center">
          <SearchTab open={isSearchOpen} onOpenChange={setIsSearchOpen} />
          <Button variant="ghost" size="icon-lg" onClick={() => setIsSearchOpen(true)}>
            <SearchIcon className="size-5" />
          </Button>
          <Button variant="ghost" className="hidden md:flex" size="icon-lg">
            <AccountIcon className="size-5" />
          </Button>
          <Button variant="ghost" size="icon-lg" onClick={() => router.push("/favorite")}>
            <WishlistIcon className="size-5" />
          </Button>
          <Button variant="ghost" size="icon-lg" onClick={() => router.push("/cart")}>
            <CartIcon className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
