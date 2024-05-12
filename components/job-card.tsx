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

type Props = {
    job: Job
    locateJob: (job: Job | null) => void
    locatedJob: Job | null
}

const JobCard = ({ job, locateJob, locatedJob }: Props) => {
    const { companyLogo, companyName, coordinates, region, salary, title, created_at } = job
    const isLocated = locatedJob ? JSON.stringify(locatedJob.coordinates) == JSON.stringify(coordinates) : false

    let createdAt: any = moment(created_at)
    createdAt = createdAt.locale('ka').fromNow()

    return (

        <Card className={classNames("w-full shadow-none hover:bg-primary-foreground cursor-pointer transition", {
            // "border-green-300 bg-green-50": title === 'პროგრამისტი'
        })}
            onClick={() => console.log('clicked')}
        >
            <Link
                href={job.id.toString()}
            >

                <CardContent className='py-4 px-6'>
                    <div className="flex gap-4 w-full items-center">
                        <div className="h-20 w-24">
                            <Image
                                src={companyLogo || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png"}
                                alt=''
                                width={500}
                                height={1}
                                className='object-contain h-full'
                            />

                        </div>
                        <section className="flex flex-col w-full">
                            <header className='flex justify-between'>
                                <div className="flex flex-col ">
                                    <p className="font-semibold text-sm text-muted-foreground">{companyName}</p>
                                    <h2 className="font-semibold text-lg">{title}</h2>
                                </div>
                                <Button variant='outline' size='icon'
                                    className={classNames('transition', {
                                        'border-green-300 bg-green-50 text-green-500 hover:text-green-500 hover:bg-green-50 hover:border-green-300 hover:opacity-75': isLocated
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
                                <div className="flex gap-1 items-center ">
                                    <IoIosPin />
                                    {region}
                                </div>
                                <DotFilledIcon className=' ' orientation='vertical' />
                                <div className="flex gap-1 items-center ">
                                    <TbCurrencyLari />
                                    {salary || "შეთანხმებით"}

                                </div>
                                <DotFilledIcon className=' ' orientation='vertical' />
                                <div className="flex gap-1 items-center ">
                                    <CalendarIcon />
                                    <time dateTime={created_at}>{createdAt}</time>

                                </div>

                            </footer>
                        </section>
                    </div>
                </CardContent>
            </Link>
        </Card>

    )
}

export default JobCard