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

import JobsTable from './components/jobs-table'

type Props = {
    user: any
    jobs: any[]
    freeSlots: number
}

const DashboardView = ({ user, jobs, freeSlots }: Props) => {
    return (
        <div className='max-w-7xl py-12 mx-auto w-full'>
            <div className="flex justify-between mb-4 items-center">
                <h1 className='text-xl font-semibold'>შენი განცხადებები</h1>
                <div className='text-sm flex gap-2 items-center'>
                    <p>განთავსებადი განცხადება: {user.job_limit}</p>
                    <Button variant='ghost' className='text-muted-foreground' asChild >
                        <Link href='pricing'><Plus size={16} className='mr-1' />ზღვრის გაზრდა</Link>
                    </Button>
                </div>
            </div>



            <div className="container mx-auto px-0 py-4">
                <JobsTable user={user} data={jobs} freeSlots={freeSlots} />

                <div className="flex flex-col divide-y border-t">
                    {Array.from({ length: freeSlots }).map(slot => {
                        return (
                            <Button asChild variant='ghost' className="w-full h-20 hover:bg-gray-50 text-muted-foreground">
                                <Link href='/dashboard/job/create' className='flex items-center text-sm'><Plus size={14} className='mr-1' /> დაამატე განცხადება</Link>
                            </Button>
                        )
                    })}
                </div>
            </div>


        </div>
    )
}

export default DashboardView