import React, { MutableRefObject, Ref, useEffect, useRef } from 'react'
import { Button, buttonVariants } from './ui/button'
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
import { Delete, DeleteIcon, Plus, SlidersHorizontal, Trash } from 'lucide-react';
import classNames from 'classnames'
import { useInView } from "react-intersection-observer";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { PopoverSelect } from './popover-select'
import { Checkbox } from './ui/checkbox'


export type Props = {
    filterJobs: Function
    clearFilters: Function
    filtersChanged: boolean
    remoteFilter: boolean,
    sortBy: 'created_at' | 'views'
    setSortBy: (sort: 'created_at' | 'views') => void
    titleFilter: string
    regionFilter: string[] | undefined
    industryFilter: string[] | undefined
    handleFilterChange: (key: string, value: string | string[] | boolean | undefined) => void
    jobsData: Job[]
    locateJob: (job: Job | null) => void
    locatedJob: Job | null
    getNextPage: Function
    jobsCount: number
    setSelectedJobDetails: Function
    selectedJobDetails: any
}

const regions = ["თბილისი", "კახეთი", "შიდა ქართლი", "ქვემო ქართლი", "იმერეთი", "გურია", "სამეგრელო-ზემო სვანეთი", "სამცხე-ჯავახეთი", "რაჭა-ლეჩხუმი და ქვემო სვანეთი", "მცხეთა-მთიანეთი", "აჭარის ავტონომიური რესპუბლიკა"]
const industries = ["ფინანსები", "გაყიდვები", "მარკეტინგი", "IT/პროგრამირება", "მედია", "განათლება", "სამართალი", "ჯანმრთელობა/მედიცინა", "კვება", "მშენებლობა", "უსაფრთხოება", "მიწოდება/ლოგისტიკა", "სხვა"]

const Sidebar = ({ selectedJobDetails, setSelectedJobDetails, getNextPage, jobsCount, filterJobs, clearFilters, filtersChanged, sortBy, setSortBy, remoteFilter, titleFilter, regionFilter, industryFilter, handleFilterChange, jobsData, locateJob, locatedJob }: Props) => {
    const lastJobRef = useRef<HTMLDivElement>()
    const { ref, inView, entry } = useInView({
        /* Optional options */
        threshold: 0,
    });

    useEffect(() => {
        if (inView) getNextPage()
    }, [inView])


    return (
        <div className='w-full h-full flex flex-col p-4 '>

            <form onSubmit={(e) => {
                e.preventDefault()
            }} className="flex flex-col gap-2 justify-between pt-4 pb-2 ">
                <div className="flex-col w-full flex gap-2">
                    <div className="flex flex-col gap-2">
                        <Input
                            placeholder='სამსახურის დასახელება'
                            value={titleFilter}
                            onChange={(e) => handleFilterChange('title', e.target.value)}
                        />

                        <div className="flex gap-2 flex-wrap">
                            <PopoverSelect
                                filterKey='region'
                                title='მხარე'
                                selectedValues={regionFilter}
                                setSelectedValues={handleFilterChange}
                                options={regions.map(region => ({ label: region, value: region }))}
                            />

                            <PopoverSelect
                                filterKey='industry'
                                title='კატეგორია'
                                selectedValues={industryFilter}
                                setSelectedValues={handleFilterChange}
                                options={industries.map(industry => ({ label: industry, value: industry }))}
                            />

                            <Button variant='outline' size='sm' onClick={(e) => {
                                // handleFilterChange('isRemote', !remoteFilter)
                            }} className={`border-dashed  [&>*]:cursor-pointer px-0`}>
                                {/* მარცხნივაც label, რომ მთლიანად იყოს ელემენტი დაჭერადი, ნაგავია კოდია მაგრამ მუშაობს */}
                                <label
                                    htmlFor='remote'
                                    className="w-2 h-full"
                                >

                                </label>
                                <Checkbox id='remote' checked={remoteFilter} onCheckedChange={(e) => {
                                    handleFilterChange('isRemote', e)
                                }} />
                                <label
                                    htmlFor='remote'
                                    className="h-full flex items-center px-2"
                                >
                                    დისტანციური
                                </label>

                            </Button>

                        </div>
                    </div>
                    {/* <Select
                        key={+new Date()}
                        defaultValue={regionFilter}
                        value={regionFilter}
                        onValueChange={(e) => {
                            handleFilterChange('region', e)
                        }}
                    >
                        <SelectTrigger aria-label='region' aria-labelledby='region' className=" ">
                            <SelectValue aria-label='region' aria-labelledby='region' placeholder="მხარე" />
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
                                {regions.map(region => <SelectItem key={region} value={region}>{region}</SelectItem>)}
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
                        <SelectTrigger aria-label='category' aria-labelledby='category' className=" ">
                            <SelectValue aria-label='category' aria-labelledby='category' placeholder="კატეგორია" />
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
                                {industries.map(industry => <SelectItem key={industry} value={industry}>{industry}</SelectItem>)}
                            </SelectGroup>

                        </SelectContent>

                    </Select> */}
                </div >
                <div className="flex flex-col w-full gap-2 mt-2">
                    <Button type='submit' onClick={() => filterJobs()} className={classNames('w-full', {
                        'animate-pulse': filtersChanged
                    })}>
                        <MagnifyingGlassIcon className='mr-2' />
                        ძებნა
                    </Button>

                    <Button variant='outline' onClick={() => clearFilters()} className='w-full'>
                        <Trash size={14} className='mr-2' />
                        გაწმენდა
                    </Button>
                </div>


            </form >

            <footer className='flex flex-col gap-4 py-8 overflow-y-scroll no-scrollbar'>
                <div className="flex justify-between  items-end">
                    <Select value={sortBy}
                        onValueChange={(e) => {
                            setSortBy(e as "created_at" | "views")
                        }}
                        defaultValue='created_at'>
                        <SelectTrigger aria-label='sort_by' aria-labelledby='sort_by' className="w-[180px]">
                            <SelectValue aria-label='sort_by' aria-labelledby='sort_by' placeholder="დალაგება" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="created_at">ახალი</SelectItem>
                                <SelectItem value="views">მონახულებები</SelectItem>

                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {jobsCount ? <p className='text-muted-foreground text-sm'>{jobsCount} შედეგი</p> : null}

                </div>
                <>
                    {jobsData.length ? jobsData.map((job, i, arr) => {
                        //Last job for automatic pagination
                        if (arr.length - 1 === i) return (
                            <div key={job.id} ref={ref}>
                                <JobCard key={job.id} job={job} selectedJobDetails={selectedJobDetails} setSelectedJobDetails={setSelectedJobDetails} locateJob={locateJob} />
                            </div>
                        )
                        else return <div key={job.id}>
                            <JobCard job={job} selectedJobDetails={selectedJobDetails} setSelectedJobDetails={setSelectedJobDetails} locateJob={locateJob} />
                        </div>
                    })
                        :
                        // <p className='mx-auto mt-8'>მითითებული განცხადებები ვერ მოიძებნა</p>
                        null
                    }
                </>
            </footer>
        </div >
    )
}

export default Sidebar