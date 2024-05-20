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
import { MousePointerClick } from 'lucide-react';

type Props = {
    job: Job
    locateJob: (job: Job | null) => void
    setSelectedJobDetails: Function
    selectedJobDetails: any
}

const JobCard = ({ job, locateJob,  selectedJobDetails, setSelectedJobDetails }: Props) => {
    const { coordinates, region, salary, title, created_at, views, company_logo, company_name, id } = job

    let createdAt: any = moment(created_at)
    createdAt = createdAt.locale('ka').fromNow()

    const onCardClick = () => {
        if (selectedJobDetails && selectedJobDetails.id === id) {
            setSelectedJobDetails(null)
        } else setSelectedJobDetails(job)
    }

    return (

        <Card className={classNames("w-full rounded-md shadow-none hover:bg-primary-foreground cursor-pointer transition", {
            " bg-gray-50 border-gray-300 ": selectedJobDetails ? selectedJobDetails.id === id : false
        })}
            onClick={() => onCardClick()}
        >
            {/* <Link
                href={id.toString()}
                target='_blank'
            > */}

            <CardContent className='py-4 px-6'>
                <div className="flex gap-4 w-full items-center">
                    <div className="h-20 w-20">
                        <Image
                            src={company_logo || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png"}
                            alt=''
                            width={500}
                            height={1}
                            className='object-contain h-full'
                        />

                    </div>
                    <section className="flex flex-col w-full">
                        <header className='flex justify-between'>
                            <div className="flex flex-col ">
                                <p className="font-semibold text-sm text-muted-foreground">{company_name}</p>
                                <h2 className="font-semibold text-lg">{title}</h2>
                            </div>
                            <Button aria-label='locate-btn' aria-labelledby='locate-btn' variant='outline' size='icon'
                                className={classNames('hidden xl:flex transition', {
                                    // 'border-green-300 bg-green-50 text-green-500 hover:text-green-500 hover:bg-green-50 hover:border-green-300 hover:opacity-75': isLocated
                                })}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    locateJob(job)
                                }}>
                                <GrMap size={18} className='' />
                            </Button>
                        </header>
                        <footer className='flex items-center gap-1 mt-2 text-sm text-muted-foreground'>
                            {/* <div className="flex gap-1 items-center ">
                                    <IoIosPin />
                                    {region}
                                </div>
                                <DotFilledIcon className=' ' orientation='vertical' /> */}
                            <div className="flex gap-1 items-center ">
                                <CalendarIcon />
                                <time dateTime={created_at}>{createdAt}</time>

                            </div>
                            <DotFilledIcon className=' ' orientation='vertical' />

                            <div className="flex gap-1 items-center ">
                                <TbCurrencyLari />
                                {salary ? `${salary[0]}-${salary[1]}` : "შეთანხმებით"}

                            </div>
                            <DotFilledIcon className='hidden sm:block' orientation='vertical' />
                            <div className="hidden sm:flex gap-1 items-center ">
                                <MousePointerClick size={16} />
                                {views} მონახულება

                            </div>

                        </footer>
                    </section>
                </div>
            </CardContent>
            {/* </Link> */}
        </Card>

    )
}

export default JobCard