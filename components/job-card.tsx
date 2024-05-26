import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'
import { Button } from './ui/button'
import { GrMap } from "react-icons/gr";
import { IoIosPin } from "react-icons/io";
import { TbCurrencyLari } from "react-icons/tb";
import { Job } from '@/app/page';
import classNames from 'classnames';
import Link from 'next/link';
import { CalendarIcon, DotFilledIcon } from '@radix-ui/react-icons'
import moment from 'moment-with-locales-es6';
import { ArrowUpRight, Calendar, MousePointerClick, Rss, Zap } from 'lucide-react';
import { Badge } from './ui/badge';

type Props = {
    job: Job
    locateJob: (job: Job | null) => void
    setSelectedJobDetails: Function
    selectedJobDetails: any
    count: number
}

const JobCard = ({ job, locateJob, selectedJobDetails, setSelectedJobDetails, count }: Props) => {
    const { coordinates, region, min_salary, max_salary, title, created_at, views, company_logo, company_name, urgent, is_remote, id } = job

    let createdAt: any = moment(created_at)
    createdAt = createdAt.locale('ka').fromNow()

    const onCardClick = () => {
        if (selectedJobDetails && selectedJobDetails.id === id) {
            setSelectedJobDetails(null)
        } else setSelectedJobDetails(job)
    }

    return (

        <Card className={classNames("job-card  w-full rounded-md shadow-none hover:bg-primary-foreground cursor-pointer transition", {
            " bg-zinc-50 border-zinc-300 ": selectedJobDetails ? selectedJobDetails.id === id : false
        })}
            onClick={() => onCardClick()}
        >
            {/* <Link
                href={id.toString()}
                target='_blank'
            > */}

            <CardContent className='p-3  rounded-md'>

                <main className="flex gap-4 w-full items-center   ">
                    <section className="flex flex-col w-full ">
                        <header className='flex gap-4 items-center'>
                            <div className="h-14 w-14">
                                <Image
                                    src={company_logo || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png"}
                                    alt=''
                                    width={500}
                                    height={1}
                                    className='object-contain h-full'
                                />

                            </div>
                            <div className="flex flex-col ">
                                <h2 className="font-semibold text-lg">{title}</h2>
                                <p className="font-medium text-sm text-muted-foreground">{company_name}</p>

                            </div>
                            <Button aria-label='locate-btn' aria-labelledby='locate-btn' variant='outline' size='icon'
                                className={classNames('job-card-locate-btn hidden xl:flex transition ml-auto self-start rounded-full', {
                                    // 'border-green-300 bg-green-50 text-green-500 hover:text-green-500 hover:bg-green-50 hover:border-green-300 hover:opacity-75': isLocated
                                })}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    locateJob(job)
                                }}>
                                <ArrowUpRight size={18} />
                            </Button>
                        </header>
                        <main className="flex flex-wrap gap-2 mt-3 [&_svg]:mr-1 [&>div]:whitespace-nowrap">
                            <Badge variant='outline' className='bg-white' >
                                <Calendar size={14}  />
                                <time dateTime={created_at}>{createdAt}</time>
                            </Badge>
                            <Badge variant='outline' className='bg-white'>
                                <MousePointerClick size={16}  />
                                {views} მონახულება
                            </Badge>
                            <Badge variant='outline' className='bg-white' 
                            // className='bg-green-50 text-green-700 border-green-300' 
                            ><TbCurrencyLari size={14} />
                                {(min_salary && max_salary) ? `${min_salary}-${max_salary}` : "შეთანხმებით"}
                            </Badge>
                            { }
                            {urgent && <Badge variant='outline' className='bg-yellow-50 text-yellow-600 border-yellow-300' ><Zap size={14}   /> სასწრაფო</Badge>}
                            {is_remote && <Badge variant='outline' className='bg-blue-50 text-blue-600 border-blue-200' ><Rss size={14}  /> დისტანციური</Badge>}

                        </main>

                    </section>
                </main>
            </CardContent>
            {/* </Link> */}
        </Card>

    )
}

export default JobCard