'use client'


import Image from "next/image"
import { MoreHorizontal, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { TbCurrencyLari } from "react-icons/tb";
import moment from "moment"
import Link from "next/link"
import { changeJobVisibility } from "../action"

type Props = {
    user: any
    data: any[]
    freeSlots: number
}

export const JobsTable = ({ user, freeSlots, data }: Props) => {
    const createEndpoint = freeSlots ? '/dashboard/job/create' : '/pricing'
    // console.log(data)
    return (
        <>
            {data.length ?
                <Table className="">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">
                                <span className="sr-only">Image</span>
                            </TableHead>
                            <TableHead>სახელწოდება</TableHead>
                            <TableHead>კომპანია</TableHead>
                            <TableHead>ანაზღაურება</TableHead>
                            <TableHead className="hidden md:table-cell">
                                მონახულება
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                ხილვადობა
                            </TableHead>
                            <TableHead className="hidden md:table-cell">შექმნის დრო</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map(job => {
                            return (
                                < Row key={job.id} job={job} />
                            )
                        })}


                    </TableBody>
                </Table>
                :
                <Button asChild variant='ghost' className="w-full h-20 hover:bg-gray-50 text-muted-foreground border-t">
                    <Link href={createEndpoint} className='flex items-center text-sm'><Plus size={14} className='mr-1' /> შექმენი შენი პირველი განცხადება</Link>
                </Button>
            }
        </>


    )
}


type RowProps = {
    job: any
}


const Row = ({ job }: RowProps) => {


    return (
        <TableRow > 

            <TableCell className="hidden sm:table-cell">
                <Image
                    alt="Product image"
                    className="aspect-square object-contain"
                    height="64"
                    src={job.company_logo || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png"}
                    width="64"
                />
            </TableCell>
            <TableCell className="font-medium">
                {job.title}
            </TableCell>
            <TableCell className="font-medium">
                {job.company_name}
            </TableCell>
            {job.salary ? <TableCell className=""><TbCurrencyLari className="inline" /> {`${job.salary[0]}-${job.salary[1]}`}</TableCell>
                :
                <TableCell>შეთანხმებით</TableCell>
            }


            <TableCell className="hidden md:table-cell">{job.views}</TableCell>
            <TableCell>
                <Badge variant="outline">{job.hidden ? "დამალული" : "ხილვადი"}</Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
                {moment(job.created_at).format('DD/MM/YY')}
            </TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>ქმედებები</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/job/${job.id}`}>ნახვა</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/job/${job.id}/edit`}>შეცვლა</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            changeJobVisibility(job.id, !job.hidden)
                        }}>{job.hidden ? 'გამოჩენა' : 'დამალვა'}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}


export default JobsTable