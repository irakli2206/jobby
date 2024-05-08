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

type Props = {
    job: Job
    locateJob: (job: Job | null) => void
    locatedJob: Job | null
}

const JobCard = ({ job, locateJob, locatedJob }: Props) => {
    const { companyLogo, companyName, coordinates, location, salary, title } = job
    const isLocated = locatedJob ? JSON.stringify(locatedJob.coordinates) == JSON.stringify(coordinates) : false


    return (
        <Link
            href={job.id.toString()}
        >
            <Card className={classNames("w-full shadow-none hover:bg-primary-foreground cursor-pointer transition", {
                // "border-green-300 bg-green-50": title === 'პროგრამისტი'
            })}
                onClick={() => console.log('clicked')}
            >

                <CardContent className='py-4 px-6'>
                    <div className="flex gap-4 w-full items-center">
                        <div className="h-20 w-24">
                            <Image
                                src={companyLogo}
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
                                        e.stopPropagation()
                                        locateJob(job)
                                    }}>
                                    <GrMap size={18} className='' />
                                </Button>
                            </header>
                            <footer className='flex gap-4 mt-4 text-sm'>
                                <div className="flex gap-1 items-center text-muted-foreground">
                                    <IoIosPin />
                                    {location}
                                </div>
                                <div className="flex gap-1 items-center text-muted-foreground">
                                    <TbCurrencyLari />
                                    {salary}/თვე

                                </div>
                            </footer>
                        </section>
                    </div>
                </CardContent>

            </Card>
        </Link>
    )
}

export default JobCard