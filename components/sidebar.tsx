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
import { Delete, DeleteIcon, Plus, Trash } from 'lucide-react';
import classNames from 'classnames'

export type Props = {
    filterJobs: Function
    clearFilters: Function
    filtersChanged: boolean
    titleFilter: string
    regionFilter: string | undefined
    industryFilter: string | undefined
    handleFilterChange: (key: string, value: string | undefined) => void
    jobsData: Job[]
    locateJob: (job: Job | null) => void
    locatedJob: Job | null
}

const regions = ["თბილისი", "კახეთი", "შიდა ქართლი", "ქვემო ქართლი", "იმერეთი", "გურია", "სამეგრელო-ზემო სვანეთი", "სამცხე-ჯავახეთი", "რაჭა-ლეჩხუმი და ქვემო სვანეთი", "მცხეთა-მთიანეთი", "აჭარა"]
const industries = ["ფინანსები", "გაყიდვები", "მარკეტინგი", "IT/პროგრამირება", "მედია", "განათლება", "სამართალი", "ჯანმრთელობა/მედიცინა", "კვება", "მშენებლობა", "უსაფრთხოება", "მიწოდება/ლოგისტიკა", "სხვა"]

const Sidebar = ({ filterJobs, clearFilters, filtersChanged, titleFilter, regionFilter, industryFilter, handleFilterChange, jobsData, locateJob, locatedJob }: Props) => {

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
                <div className="flex-col w-full flex gap-2">
                    <Input
                        placeholder='სამსახურის დასახელება'
                        value={titleFilter}
                        onChange={(e) => handleFilterChange('title', e.target.value)}
                    />
                    <div className="flex gap-2 w-full">
                        <Select
                            key={+new Date()}
                            defaultValue={regionFilter}
                            value={regionFilter}
                            onValueChange={(e) => {
                                handleFilterChange('region', e)
                            }}
                        >
                            <SelectTrigger className=" ">
                                <SelectValue placeholder="მხარე" />
                            </SelectTrigger>
                            <SelectContent >
                                <Button
                                    className="w-full px-2 mb-2"
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleFilterChange('region', undefined)
                                    }}
                                >
                                    გაწმენდა
                                </Button>
                                <SelectGroup>
                                    {regions.map(region => <SelectItem value={region}>{region}</SelectItem>)}
                                </SelectGroup>

                            </SelectContent>

                        </Select>
                        <Select
                            key={`${+new Date()}-industry`}
                            defaultValue={industryFilter}
                            value={industryFilter}
                            onValueChange={(e) => {
                                handleFilterChange('industry', e)
                            }}
                        >
                            <SelectTrigger className=" ">
                                <SelectValue placeholder="კატეგორია" />
                            </SelectTrigger>
                            <SelectContent >
                                <Button
                                    className="w-full px-2 mb-2"
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleFilterChange('industry', undefined)
                                    }}
                                >
                                    გაწმენდა
                                </Button>
                                <SelectGroup>
                                    {industries.map(industry => <SelectItem value={industry}>{industry}</SelectItem>)}
                                </SelectGroup>

                            </SelectContent>

                        </Select>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Button onClick={() => filterJobs()} className={classNames('', {
                        'animate-pulse': filtersChanged
                    })}>
                        <MagnifyingGlassIcon className='mr-2' />
                        ძებნა
                    </Button>

                    <Button variant='outline' onClick={() => clearFilters()} className=' '>
                        <Trash size={14} className='mr-2' />
                        გაწმენდა
                    </Button>
                </div>


            </main>
            <footer className='flex flex-col gap-4 py-8 overflow-y-scroll no-scrollbar'>
                <Select defaultValue='created_at'>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="დალაგება" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="created_at">ახალი</SelectItem>
                            <SelectItem value="banana">ნახვები</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <>
                    {jobsData.map(job => {

                        return <JobCard key={JSON.stringify(job.coordinates)} job={job} locateJob={locateJob} locatedJob={locatedJob} />
                    })}
                </>
            </footer>
        </div>
    )
}

export default Sidebar