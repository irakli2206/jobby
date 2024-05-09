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
import moment from 'moment'


const Dashboard = async () => {
  const user = await getProfile()

  const jobs = await getJobsByUser(user.id)

  const jobSlots = Array(user.job_limit).fill({})
  jobs?.forEach((job, i) => jobSlots[i] = job)

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


        {jobSlots && jobSlots.map(({ id, title, company_logo, company_name, location, salary, created_at }: any, i) => {

          if (id) {
            const creationDate = moment(created_at)
            console.log(creationDate)
            //Expires in 1 month
            const expiryDate = moment(creationDate).add(1, 'M')

            return (
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
                  <div className="min-w-0 flex flex-col flex-auto h-full">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{title}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-muted-foreground">{company_name}</p>

                    <div className="flex gap-2 text-xs text-muted-foreground mt-auto">
                      წაშლის დრო: {expiryDate.format('DD/MM/YYYY')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button asChild variant='outline'>
                    <Link href={`/dashboard/job/${id}`} >
                      ნახვა
                    </Link>
                  </Button>
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
          }
          else return (
            <li key={i} className="flex justify-between ">
              <Button variant='ghost' asChild className="w-full h-[120px] hover:bg-zinc-50  flex items-center justify-center text-muted-foreground font-medium">
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