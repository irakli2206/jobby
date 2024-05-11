'use client'

import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useParams, usePathname, useRouter } from "next/navigation"
import classNames from "classnames"
import { useEffect, useState } from "react"
import { getUser, signout } from "@/app/action"
import { ExitIcon } from '@radix-ui/react-icons'
import { createClient } from "@/utils/supabase/client"

type Props = {
  user: any
}

const Header = ({ user }: Props) => {
  const path = usePathname()


  return (
    <header className="sticky z-[1000] backdrop-blur-sm top-0 flex h-16 items-center gap-4 border-b bg-background/50  px-4 md:px-6">
      <nav className="hidden max-w-7xl w-full mx-auto flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <div className="mx-auto flex gap-8">
          <Link
            href="/pricing"
            className={classNames("text-muted-foreground transition-colors hover:text-foreground", {
              "text-black": path.includes('pricing')
            })}
          >
            ფასი
          </Link>
          <Link
            href="/faq"
            className={classNames("text-muted-foreground transition-colors hover:text-foreground", {
              "text-foreground": path.includes('faq')
            })}
          >
            კითხვები
          </Link>
        </div>
        <div className="flex justify-self-end items-center gap-4  md:gap-2 lg:gap-4">
          {user ?
            <Button variant='outline' className='' onClick={() => {
              signout()
            }} >
              <ExitIcon className="rotate-180 mr-2" /> გამოსვლა
            </Button>
            :
            null
          }
          <Button asChild className=' ' >
            <Link href={user ? '/dashboard' : '/login'} >განათავსე განცხადება </Link>
          </Button>

        </div>
      </nav>

    </header>
  )
}

export default Header