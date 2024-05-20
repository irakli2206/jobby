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
  MoveRight,
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
import { XMarkIcon } from '@heroicons/react/20/solid'
import { ArrowRightIcon } from "lucide-react"

type Props = {
  user: any
}

const Header = ({ user }: Props) => {
  const path = usePathname()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBannerVisible, setIsBannerVisible] = useState(false)

  useEffect(() => {
    const isBannerVisibleS = localStorage.getItem('isBannerVisible');
    if (isBannerVisibleS == null) {
      localStorage.setItem('isBannerVisible', 'true');
      setIsBannerVisible(true)
    }
    setIsBannerVisible(isBannerVisibleS === 'true');
  }, [])

  const onBannerClose = () => {
    localStorage.setItem('isBannerVisible', 'false');
    setIsBannerVisible(false);
  };

  useEffect(() => {
    setIsMenuOpen(false)
  }, [path])

  return (
    <header className={classNames("sticky z-[50] backdrop-blur-sm top-0 flex h-16 items-center gap-4 border-b bg-background/50 px-4 md:px-6", {

    })}>
      <nav className="w-full">
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
        {isBannerVisible && <div className="fixed top-16  left-0 w-full isolate flex items-center gap-x-6 overflow-hidden bg-primary text-white px-6 py-1.5 sm:px-3.5 sm:before:flex-1">

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-sm leading-6 ">
              <strong className="font-semibold">პირველი განცხადება უფასოა!</strong>
              <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
                <circle cx={1} cy={1} r={1} />
              </svg>
              შექმენი ანგარიში და განათავსე განცხადება უფასოდ
            </p>
            <Button
              variant='secondary'
              asChild
              size='sm'
              className="flex-none rounded-full  text-sm  shadow-sm "
              onClick={() => {
                onBannerClose()
              }}
            >
              <Link href='/signup'  >
                ანგარიშის შექმნა <MoveRight className="ml-2" size={20} />  
              </Link>
            </Button>
          </div>
          <div className="flex flex-1 justify-end">
            <button onClick={onBannerClose} type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>}
      </nav>


      <nav className="flex md:hidden max-w-7xl w-full mx-auto flex-col gap-6 text-sm font-medium ">

        <Sheet open={isMenuOpen} onOpenChange={(e) => setIsMenuOpen(e)}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 self-end md:hidden"
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