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
import DashboardView from './view'



const Dashboard = async () => {
  const user = await getProfile()

  if(!user) return

  const jobs = await getJobsByUser(user.id)


  const freeSlots = user.job_limit - jobs!.length


  return (
    <>
      <DashboardView
        freeSlots={freeSlots}
        jobs={jobs!}
        user={user}
      />
    </>
  )
}

export default Dashboard