import React from 'react'
import { getProfile, getUser } from '../action'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { EllipsisVertical, Plus } from 'lucide-react'
import { getJobsByUser } from './action'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'
import { GrMap } from "react-icons/gr";
import { IoIosPin } from "react-icons/io";
import { TbCurrencyLari } from "react-icons/tb";
import { Job } from '@/app/page';
import classNames from 'classnames';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const people = [
  {
    name: 'Leslie Alexander',
    email: 'leslie.alexander@example.com',
    role: 'Co-Founder / CEO',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    name: 'Michael Foster',
    email: 'michael.foster@example.com',
    role: 'Co-Founder / CTO',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    name: 'Dries Vincent',
    email: 'dries.vincent@example.com',
    role: 'Business Relations',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: null,
  },
  {
    name: 'Lindsay Walton',
    email: 'lindsay.walton@example.com',
    role: 'Front-end Developer',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    name: 'Courtney Henry',
    email: 'courtney.henry@example.com',
    role: 'Designer',
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    role: 'Director of Product',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: null,
  },
]

const Dashboard = async () => {
  const user = await getProfile()

  if (!user) redirect('/login')

  const jobs = await getJobsByUser(user.id)

  const jobSlots = Array(user.job_limit).fill({})
  jobs?.forEach((job, i) => jobSlots[i] = job)
  console.log(jobSlots)

  return (
    <div className='max-w-7xl py-12 mx-auto w-full'>
      <div className="flex justify-between mb-4 items-center">
        <h1 className='text-xl font-semibold'>შენი განცხადებები</h1>
        <div className='text-sm flex gap-2 items-center'>
          <p>განთავსებადი განცხადება: {user.job_limit}</p>
          <Button variant='ghost' className='text-muted-foreground' ><Plus size={16} className='mr-1' />ზღვრის გაზრდა</Button>
        </div>
      </div>
      <ul role="list" className="divide-y divide-gray-200">


        {jobSlots && jobSlots.map(({ id, title, company_logo, company_name, location, salary }: any) => {
          if (id) return (
            <li key={id} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <div className="h-20 w-24">
                  <Image
                    src={company_logo || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png"}
                    alt=''
                    width={500}
                    height={1}
                    className='object-contain h-full'
                  />

                </div>
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">{title}</p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">{company_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant='outline'>ნახვა</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button size='icon' variant='link'>
                      <EllipsisVertical className='text-muted-foreground' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>შეცვლა</DropdownMenuItem>
                    <DropdownMenuItem>დამალვა</DropdownMenuItem>

                  </DropdownMenuContent>
                </DropdownMenu>

              </div>
            </li>
          )
          else return (
            <li key={id} className="flex justify-between gap-x-6 ">
              <Button variant='ghost' asChild className="w-full p-12 hover:bg-zinc-50  flex items-center justify-center text-muted-foreground font-medium">
                <Link href='/dashboard/job/create' className='flex items-center text-sm'><Plus size={14} className='mr-1' /> დაამატე განცხადება</Link>
              </Button>
            </li>
          )
        })}

      </ul>
    </div>
  )
}

export default Dashboard