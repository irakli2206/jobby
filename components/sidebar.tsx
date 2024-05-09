import React from 'react'
import { Button } from './ui/button'
import JobCard from './job-card'
import { Job } from '@/app/page'
import { Input } from './ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'


export type Props = {
    jobsData: Job[]
    locateJob: (job: Job | null) => void
    locatedJob: Job | null
}

const Sidebar = ({ jobsData, locateJob, locatedJob }: Props) => {


    return (
        <div className='w-1/2 h-full flex flex-col p-4 border-r '>
            <header className="flex justify-between gap-8">
                <div className="flex flex-col gap-4  pb-2">
                    <h1 className='text-3xl font-medium'>Jobby.ge</h1>
                    <p className='text-muted-foreground '>საუკეთესო ადგული ქართულ ვებ სივრცეში სამსახურის საპოვნელად</p>
                </div>
                {/* <Button variant={'outline'} className=' ' >განათავსე განცხადება</Button> */}
            </header>
            <main className="flex flex-row gap-2 justify-between pt-4 pb-2 ">
                <Input
                    placeholder='სამუშაოს ან კომპანიის დასახელება'
                />
                <Select>
                    <SelectTrigger className="w-[180px] max-w-[180px] min-w-[180px]">
                        <SelectValue  placeholder="აირჩიე ქალაქი" />
                    </SelectTrigger>
                    <SelectContent className=' '>
                        <SelectGroup>
                            <SelectItem value="თბილისი">თბილისი</SelectItem>
                            <SelectItem value="კახეთი">კახეთი</SelectItem>
                            <SelectItem value="შიდა ქართლი">შიდა ქართლი</SelectItem>
                            <SelectItem value="ქვემო ქართლი">ქვემო ქართლი</SelectItem>
                            <SelectItem value="იმერეთი">იმერეთი</SelectItem>
                            <SelectItem value="გურია">გურია</SelectItem>
                            <SelectItem value="სამეგრელო-ზემო სვანეთი">სამეგრელო-ზემო სვანეთი</SelectItem>
                            <SelectItem value="სამცხე-ჯავახეთი">სამცხე-ჯავახეთი</SelectItem>
                            <SelectItem value="რაჭა-ლეჩხუმი და ქვემო სვანეთი">რაჭა-ლეჩხუმი და ქვემო სვანეთი</SelectItem>
                            <SelectItem value="მცხეთა-მთიანეთი">მცხეთა-მთიანეთი</SelectItem>
                            <SelectItem value="აჭარა">აჭარა</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Button className=' '>
                    <MagnifyingGlassIcon className='mr-2' />
                    ძებნა
                </Button>
            </main>
            <footer className='flex flex-col gap-4 py-8 overflow-y-scroll no-scrollbar'>

                {jobsData.map(job => {

                    return <JobCard key={JSON.stringify(job.coordinates)} job={job} locateJob={locateJob} locatedJob={locatedJob} />
                })}

            </footer>
        </div>
    )
}

export default Sidebar