'use client'

import classNames from 'classnames';
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { BsBriefcaseFill } from 'react-icons/bs';
import Map, { MapRef, Marker, ViewState } from 'react-map-gl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { File, FileCheck2, FileUp, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { incrementJobViews, sendResume } from '@/app/action';
import MapView from '@/app/[job]/map';

type Props = {
    profile?: any
    job: any
    closeJobDetails: Function
}

const JobDetails = ({ profile, job, closeJobDetails }: Props) => {
    const [resume, setResume] = useState<File | undefined>()
    const [isAlreadyApplied, setIsAlreadyApplied] = useState<boolean | undefined>(undefined)


    const fileInputRef = useRef(null);

    const { toast } = useToast()

    useEffect(() => {
        if (localStorage) {
            const applied_jobs = localStorage.getItem('applied_jobs')
            const appliedJobs = applied_jobs ? JSON.parse(applied_jobs) : []
            if (appliedJobs.includes(job.id)) setIsAlreadyApplied(true)
            else setIsAlreadyApplied(false)
        }

        const incrementJobViewsEffect = async () => {
            if (job) await incrementJobViews(job)
        }

        incrementJobViewsEffect()
    }, [job])



    const handleButtonClick = () => {
        // Programmatically click the hidden file input
        fileInputRef.current.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        setResume(file)

    };
    const handleSendResume = async () => {
        if (resume) {
            const formData = new FormData();
            formData.append('file', resume);
            formData.append('fileName', resume.name)
            try {
                const { data, error } = await sendResume(job.id, formData)
                if (error) throw new Error(error)
                setResume(undefined)
                // await updateProfileAttribute(profile.id, "applied_jobs", Array.from(new Set([...profile.applied_jobs, job.id])))
                const applied_jobs = localStorage.getItem('applied_jobs')

                const appliedJobs = applied_jobs ? [...JSON.parse(applied_jobs), job.id] : [job.id]
                localStorage.setItem('applied_jobs', JSON.stringify(appliedJobs))
                setIsAlreadyApplied(true)
                toast({
                    title: 'წარმატება',
                    description: 'რეზიუმე გაიგზავნა',
                    duration: 3000
                })
            } catch (e: any) {
                console.log(e.message)
                toast({
                    title: 'შეცდომა',
                    description: e.message,
                    variant: 'destructive',
                    duration: 3000
                })
            }
        } else toast({
            title: 'შეცდომა',
            description: 'აირჩიეთ რეზიუმე',
            variant: 'destructive',
            duration: 3000
        })
    }


    return (
        <div className='py-4 px-4 max-w-7xl mx-auto h-full'>
            <header className='w-full flex justify-end pb-4'>
                <Button variant={'ghost'} size='icon'
                    onClick={() => closeJobDetails()}
                >
                    <X />
                </Button>
            </header>

            <div className="px-4 sm:px-0 flex w-full justify-between items-end">

                <div className="flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <p className="  mt-1 max-w-2xl font-medium text-gray-500">{job.company_name}</p>
                </div>

                <div className='w-40 h-20 relative mb-2'>
                    <Image
                        src={job.company_logo || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png"}
                        alt=''
                        fill
                        className='object-contain '
                    />
                </div>
            </div>
            <div className="mt-6 border-t border-gray-200">
                <dl className="divide-y divide-gray-200">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">სამსახურის შესახებ</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{job.description}</dd>
                    </div>
                    {job.responsibilities && <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">შენი პასუხისმგებლობები</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <ol className='flex flex-col gap-2 list-disc list-inside'>
                                {job.responsibilities.map((r: any) => {
                                    return <li>{r}</li>
                                })}
                            </ol>
                        </dd>
                    </div>}
                    {job.required_experiences && <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">საჭირო გამოცდილება</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <ol className='flex flex-col gap-2 list-disc list-inside'>
                                {job.required_experiences.map((e: any) => {
                                    return <li>{e}</li>
                                })}
                            </ol>
                        </dd>
                    </div>}
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">ანაზღაურება (თვე)</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{job.salary ? `${job.salary[0]}-${job.salary[1]} ლარი` : "შეთანხმებით"}</dd>
                    </div>
                    {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">მხარე</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{job.region}</dd>
            </div> */}
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">ადგილმდებარეობა</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <MapView
                                key={job.id}
                                job={job}
                            />
                        </dd>
                    </div>
                    {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">რეზიუმეს გამოგზავნა</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {job.application_instruction}
                </dd>
            </div> */}

                    <div className="sticky z-50 bg-white py-8 bottom-0">
                        {
                            isAlreadyApplied !== undefined ?

                                <>
                                    {isAlreadyApplied === false ? <>
                                        <Input onChange={handleFileChange} ref={fileInputRef} type='file' className='hidden' />
                                        <div onClick={handleButtonClick} className='mb-4 h-20 rounded-xl border border-gray-300 bg-gray-50 border-dashed'>
                                            <div className="w-full h-full text-gray-400 gap-2 flex items-center justify-center cursor-pointer text-sm"><FileUp size={20} /> {resume ? resume.name : "ატვირთე რეზიუმე"}</div>
                                        </div>

                                        <Button className='w-full ' size={'lg'} onClick={handleSendResume} >გაგზავნა</Button>
                                    </>
                                        :
                                        <div className='flex items-center gap-4 justify-center text-green-500'>
                                            <FileCheck2 />
                                            <h1 className='text-lg'>გაგზავნილია</h1>
                                        </div>
                                    }
                                </>
                                :

                                null
                        }

                    </div>


                </dl>
            </div>
        </div>
    )
}

export default JobDetails