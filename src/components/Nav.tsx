"use client"

import Link from "next/link"
import Image from "next/image"
import { signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { useAuth } from "@/context/AuthContext"
import { Button } from "./ui/button"
import { ChevronsUpDown, MenuIcon, Package2 } from "lucide-react"
import { dashboardLinks, inventoryLinks } from "@/constants"
import { usePathname } from "next/navigation"

const Nav = () => {
  const { session } = useAuth()
  const pathname = usePathname()
  const firstSegment = pathname.split("/")[1]

  return (
    <nav className="sm:px-6 px-4 border mt-2 rounded-t-lg">
      <div className="w-full py-4">
        {session?.user ? (
          <div className="flex items-center justify-between gap-2">
            <div className="hidden md:flex items-center justify-center gap-4">
              <Package2 size={30} />
              <ul className="flex gap-4 text-sm font-medium text-muted-foreground">
                {firstSegment === "inventory" ? (
                  <>
                    {inventoryLinks.map((link) => (
                      <li
                        key={link.label}
                        className={`cursor-pointer ${
                          link.label === "All" && "text-black"
                        }`}
                      >
                        {link.label}
                      </li>
                    ))}
                  </>
                ) : (
                  <>
                    {dashboardLinks.map((link) => (
                      <li
                        key={link.label}
                        className={`cursor-pointer ${
                          link.label === "Overview" && "text-black"
                        }`}
                      >
                        {link.label}
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size={"sm"}
                  className="block md:hidden"
                >
                  <MenuIcon size={25} />
                </Button>
              </SheetTrigger>
              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle>
                    <Package2 size={30} />
                  </SheetTitle>
                </SheetHeader>
                <ul className="flex flex-col gap-4 text-lg font-medium text-muted-foreground pt-4">
                  {firstSegment === "inventory" ? (
                    <>
                      {inventoryLinks.map((link) => (
                        <li
                          key={link.label}
                          className={`cursor-pointer ${
                            link.label === "All" && "text-black"
                          }`}
                        >
                          {link.label}
                        </li>
                      ))}
                    </>
                  ) : (
                    <>
                      {dashboardLinks.map((link) => (
                        <li
                          key={link.label}
                          className={`cursor-pointer ${
                            link.label === "Overview" && "text-black"
                          }`}
                        >
                          {link.label}
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </SheetContent>
            </Sheet>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-center gap-2 border py-1 px-2 rounded-lg focus-visible:outline-none  hover:bg-slate-100 ">
                <Image
                  src={session?.user.image ?? "/icons/user.svg"}
                  alt="user image"
                  width={40}
                  height={40}
                  className="size-6 rounded-full"
                />
                <div className="text-sm font-medium">
                  {session?.user.name || "User"}
                </div>
                <ChevronsUpDown width={15} height={15} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="cursor-default">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href={`/dashboard/${session.user.name}`}>
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/inventory/${session.user.name}`}>
                    Inventory
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Link href="/login" className="flex justify-end">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Nav
