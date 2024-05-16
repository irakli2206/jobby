'use client'

import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  FilePlus2,
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
import Image from "next/image"

type Props = {
  user: any
}

const Header = ({ user }: Props) => {
  const path = usePathname()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  useEffect(() => {
    setIsMenuOpen(false)
  }, [path])

  return (
    <header className={classNames("sticky z-[50] backdrop-blur-sm top-0 flex h-16 items-center gap-4 border-b bg-background/50 px-4 md:px-6", {

    })}>
      <nav className="hidden max-w-7xl w-full mx-auto flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex w-11 h-11 items-center gap-2 text-lg font-semibold md:text-base relative"
        >
          {/* < FaReact className="h-8 w-8" /> */}
          <Image
            src='/logo.svg'
            alt=''
            fill
          // className='h-6 w-auto'
          />
          <span className="sr-only">Jobby.ge</span>
        </Link>
        <div className="mx-auto flex gap-8">
          <Link
            href="/pricing"
            className={classNames("text-muted-foreground transition-colors hover:text-foreground", {
              "!text-black": path.includes('pricing')
            })}
          >
            ფასი
          </Link>
          <Link
            href="/faq"
            className={classNames("text-muted-foreground transition-colors hover:text-foreground", {
              "!text-black": path.includes('faq')
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
            <Link href={user ? '/dashboard' : '/login'} ><FilePlus2 size={16} className="mr-2" /> განათავსე განცხადება </Link>
          </Button>

        </div>
      </nav>

      <nav className="flex md:hidden max-w-7xl w-full mx-auto flex-col gap-6 text-sm font-medium ">

        <Sheet open={isMenuOpen} onOpenChange={(e) => setIsMenuOpen(e)}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="z-[1000]" side="left">
            <nav className="grid gap-6 text-base font-medium">
              {/* <Link
                href="/"
                className=" flex w-11 h-11 items-center gap-2 text-lg font-semibold md:text-base relative"
              >
                <Image
                  src='/logo.svg'
                  alt=''
                  fill
                // className='h-6 w-auto'
                />
                <span className="sr-only">Jobby.ge</span>
              </Link> */}
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground"
              >
                მთავარი
              </Link>
              <Link
                href="/pricing"
                className="text-muted-foreground hover:text-foreground"
              >
                ფასი
              </Link>
              <Link
                href="/faq"
                className="text-muted-foreground hover:text-foreground"
              >
                კითხვები
              </Link>

              <div className="flex flex-col   gap-4  md:gap-2 lg:gap-4">
                {user ?
                  <Button size='lg' variant='outline' className='' onClick={() => {
                    signout()
                  }} >
                    <ExitIcon className="rotate-180 mr-2" /> გამოსვლა
                  </Button>
                  :
                  null
                }
                <Button size='lg' asChild className='' >
                  <Link href={user ? '/dashboard' : '/login'} ><FilePlus2 size={16} className="mr-2" /> განათავსე განცხადება </Link>
                </Button>

              </div>
            </nav>
          </SheetContent>
        </Sheet>

      </nav>
    </header>
  )
}

export default Header