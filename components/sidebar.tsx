import React from 'react'
import { Button } from './ui/button'
import JobCard from './job-card'
import { Job } from '@/app/page'



export type Props = {
    jobsData: Job[]
    locateJob: (job: Job | null) => void
    locatedJob: Job | null
}

const Sidebar = ({jobsData, locateJob, locatedJob}: Props) => {


    return (
        <div className='w-1/2 h-screen flex flex-col p-4 border-r '>
            <header className="flex justify-between gap-8">
                <div className="flex flex-col gap-4 px-4">
                    <h1 className='text-3xl font-medium'>Jobby.ge</h1>
                    <p className='text-muted-foreground '>საუკეთესო ადგული ქართულ ვებ სივრცეში სამსახურის საპოვნელად</p>
                </div>
                <Button variant={'outline'} className=' ' >განათავსე განცხადება</Button>
            </header>

            <main className='flex flex-col gap-4 py-8 overflow-y-scroll no-scrollbar'>
                {jobsData.map(job => {

                    return <JobCard key={JSON.stringify(job.coordinates)} job={job} locateJob={locateJob} locatedJob={locatedJob} />
                })}
                
            </main>
        </div>
    )
}

export default Sidebar