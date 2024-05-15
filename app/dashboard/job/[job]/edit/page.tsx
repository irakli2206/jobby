'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import classNames from 'classnames';
import { randomUUID } from 'crypto';
import { Delete, DeleteIcon, Plus, RefreshCw, Trash } from 'lucide-react';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { BsBriefcaseFill } from 'react-icons/bs';
import Map, { LngLat, MapRef, Marker, ViewState } from 'react-map-gl';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { clearCache, getJobById, getUser } from '@/app/action';
import { createClient } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';

const Edit = () => {
    const supabase = createClient()
    const router = useRouter()
    const params = useParams()
    const [loading, setLoading] = useState(false)
    const [noSalary, setNoSalary] = useState(false)
    const [jobData, setJobData] = useState<any>({
        title: "",
        company_name: "",
        description: "",
        responsibilities: [],
        required_experiences: [],
        salary: [],
        region: "",
        coordinates: [],
        application_instruction: ""
    })
    const [logo, setLogo] = useState<File | undefined>()

    const { toast } = useToast()

    useEffect(() => {
        if (noSalary) {
            setJobData({ ...jobData, salary: [] })
        }
    }, [noSalary])

    useEffect(() => {
        const getJobData = async () => {

            const job = await getJobById(params.job as string)
            const formattedJob = {
                ...job,
                required_experiences: job.required_experiences ? job.required_experiences.map(r => ({ id: crypto.randomUUID(), text: r })) : [],
                responsibilities: job.responsibilities ? job.responsibilities.map(r => ({ id: crypto.randomUUID(), text: r })) : [],
                salary: !job.salary ? [] : job.salary
            }

            if (job) setJobData({
                ...formattedJob
            })
            else router.push('/dashboard')
        }
        getJobData()
    }, [])


    const validateFields = () => {
        if (!jobData.title || !jobData.company_name || !jobData.description || !jobData.responsibilities.length || !jobData.coordinates.length || !jobData.required_experiences.length || !jobData.salary.length || !jobData.region || !jobData.application_instruction) {
            throw new Error("შეავსე ცარიელი ველები")
        }
        else if ((jobData.salary[1] < jobData.salary[0]) || jobData.salary[0] < 0 || jobData.salary[1] < 0) {
            throw new Error("შეიყვანე სწორი ანაზღაურება")
        }
    }

    const handleSave = async () => {

        try {
            validateFields()
            setLoading(true)

            let imagePath
            if (logo) {
                const { data: imageUpload, error: imageUploadError } = await supabase.storage.from('jobs').upload(`logos/${crypto.randomUUID()}`, logo as File, {
                    upsert: true,
                    contentType: 'image/webp'
                })
                if (imageUploadError) throw new Error(imageUploadError.message)
                imagePath = imageUpload
            }

            const formattedJobData = { ...jobData }
            formattedJobData.responsibilities = formattedJobData.responsibilities.map((r: { id: string, text: string }) => r.text)
            formattedJobData.required_experiences = formattedJobData.required_experiences.map((e: { id: string, text: string }) => e.text)
            formattedJobData.salary = jobData.salary.length !== 2 ? null : jobData.salary
            if (imagePath && imagePath.path) formattedJobData.company_logo = `https://stgxrceiydjulhnxizqz.supabase.co/storage/v1/object/public/jobs/${imagePath.path}`
            const { error, status } = await supabase.from('jobs').upsert({
                ...formattedJobData,
            })
            if (error) throw new Error(error.message)

            toast({
                title: "წარმატება",
                description: "სამსახურის აღწერა განახლდა",
                duration: 3000,
            })

            clearCache('/')

            router.push('/dashboard')

        } catch (e) {
            console.log(e)
            toast({
                title: "შეცდომა",
                description: e.message,
                duration: 3000,
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className='py-12 px-4 max-w-7xl w-full mx-auto'>
            <div className="px-4 sm:px-0 flex flex-col gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="company_logo">კომპანიის ლოგო</Label>
                    <Input id='company_logo' className='flex-1 w-[300px] drop-shadow-sm ' accept='image/*' type="file"

                        onChange={(e) => {
                            e.target.files?.length ? setLogo(e.target.files[0]) : setLogo(undefined)

                        }}
                    />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="title">სამსახურის დასახელება</Label>
                    <Input type="text" id="title" placeholder="ვებ დეველოპერი"
                        value={jobData.title}
                        onChange={(e) => {
                            setJobData({
                                ...jobData,
                                title: e.target.value
                            })
                        }}
                    />
                </div>


                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="name">კომპანიის დასახელება</Label>
                    <Input type="text" id="name" placeholder="Apple"
                        value={jobData.company_name}
                        onChange={(e) => {
                            setJobData({
                                ...jobData,
                                company_name: e.target.value
                            })
                        }}
                    />
                </div>
                {/* <p className="mt-3 max-w-2xl text-sm  text-gray-500">{job.location}</p> */}
            </div>

            <div className="mt-6 border-t border-gray-200">

                <dl className="divide-y divide-gray-200">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">კატეგორია</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <Select onValueChange={(e) =>
                                setJobData({
                                    ...jobData,
                                    industry: e
                                })}
                                value={jobData.industry}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="კატეგორია" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ფინანსები">ფინანსები</SelectItem>
                                    <SelectItem value="გაყიდვები">გაყიდვები</SelectItem>
                                    <SelectItem value="მარკეტინგი">მარკეტინგი</SelectItem>
                                    <SelectItem value="IT/პროგრამირება">IT/პროგრამირება</SelectItem>
                                    <SelectItem value="მედია">მედია</SelectItem>
                                    <SelectItem value="განათლება">განათლება</SelectItem>
                                    <SelectItem value="სამართალი">სამართალი</SelectItem>
                                    <SelectItem value="ჯანმრთელობა/მედიცინა">ჯანმრთელობა/მედიცინა</SelectItem>
                                    <SelectItem value="კვება">კვება</SelectItem>
                                    <SelectItem value="მშენებლობა">მშენებლობა</SelectItem>
                                    <SelectItem value="უსაფრთხოება">უსაფრთხოება</SelectItem>
                                    <SelectItem value="მიწოდება/ლოგისტიკა">მიწოდება/ლოგისტიკა</SelectItem>
                                    <SelectItem value="სხვა">სხვა</SelectItem>
                                </SelectContent>
                            </Select>
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">სამსახურის შესახებ</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <Textarea
                                maxLength={500}
                                value={jobData.description}
                                onChange={(e) => {
                                    setJobData({
                                        ...jobData,
                                        description: e.target.value
                                    })
                                }}

                            />
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">შენი პასუხისმგებლობები</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <ol className='flex flex-col gap-2 list-disc'>
                                {
                                    jobData.responsibilities.map((responsibility: any, i: number) => {
                                        return <div key={responsibility.id} className='flex gap-2 items-center'>
                                            <Input

                                                value={responsibility.text}
                                                onChange={(e) => {
                                                    let updatedResponsibilities = [...jobData.responsibilities]
                                                    updatedResponsibilities[i].text = e.target.value
                                                    setJobData((prevState: any) => ({
                                                        ...prevState,
                                                        responsibilities: updatedResponsibilities
                                                    }))
                                                }}
                                            />
                                            <Button onClick={() => {
                                                setJobData((prevState: any) => ({
                                                    ...prevState,
                                                    responsibilities: prevState.responsibilities.filter((r: any) => r.id !== responsibility.id)
                                                }))
                                            }} variant='ghost' size='icon'>
                                                <Trash size={20} />
                                            </Button>
                                        </div>
                                    })
                                }

                                <Button variant='ghost' className='w-fit'
                                    onClick={() => {
                                        const id = crypto.randomUUID()
                                        setJobData((jobData: any) => ({
                                            ...jobData,
                                            responsibilities: [...jobData.responsibilities, {
                                                id,
                                                text: ""
                                            }]
                                        }))
                                    }}
                                >
                                    <Plus size={16} className='mr-1' /> დამატება
                                </Button>
                            </ol>
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">საჭირო გამოცდილება</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <ol className='flex flex-col gap-2 list-disc'>
                                {
                                    jobData.required_experiences.map((experience: any, i: number) => {
                                        return <div key={experience.id} className='flex gap-2 items-center'>
                                            <Input

                                                value={experience.text}
                                                onChange={(e) => {
                                                    let updatedResponsibilities = [...jobData.required_experiences]
                                                    updatedResponsibilities[i].text = e.target.value
                                                    setJobData((prevState: any) => ({
                                                        ...prevState,
                                                        required_experiences: updatedResponsibilities
                                                    }))
                                                }}
                                            />
                                            <Button onClick={() => {
                                                setJobData((prevState: any) => ({
                                                    ...prevState,
                                                    required_experiences: prevState.required_experiences.filter((e: any) => e.id !== experience.id)
                                                }))
                                            }} variant='ghost' size='icon'>
                                                <Trash size={20} />
                                            </Button>
                                        </div>
                                    })
                                }

                                <Button variant='ghost' className='w-fit'
                                    onClick={() => {
                                        const id = crypto.randomUUID()
                                        setJobData((required_experiences: any[]) => ({
                                            ...required_experiences,
                                            required_experiences: [...jobData.required_experiences, {
                                                id,
                                                text: ""
                                            }]
                                        }))
                                    }}
                                >
                                    <Plus size={16} className='mr-1' /> დამატება
                                </Button>
                            </ol>
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">ანაზღაურება (თვე)</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 flex flex-col gap-4">

                            <div className="flex gap-2 items-center">
                                <Input disabled={noSalary} placeholder='-დან' type='number' value={jobData.salary.length ? jobData.salary[0] : ''} onChange={(e) => {
                                    const newSalary = [...jobData.salary]
                                    newSalary[0] = e.target.valueAsNumber
                                    setJobData({
                                        ...jobData,
                                        salary: newSalary
                                    })
                                }} />
                                <span>-</span>
                                <Input disabled={noSalary} placeholder='-მდე' type='number' value={jobData.salary.length ? jobData.salary[1] : ''} onChange={(e) => {
                                    const newSalary = [...jobData.salary]
                                    newSalary[1] = e.target.valueAsNumber
                                    setJobData({
                                        ...jobData,
                                        salary: newSalary
                                    })
                                }} />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms" checked={noSalary} onCheckedChange={() => setNoSalary(!noSalary)} />
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    შეთანხმებით
                                </label>
                            </div>
                            {/* <Textarea
                                maxLength={128}
                                placeholder='1500-2500 ლარი გამოცდილების მიხედვით'
                                value={jobData.salary}
                                onChange={(e) => {
                                    setJobData({
                                        ...jobData,
                                        salary: e.target.value
                                    })
                                }}

                            /> */}
                        </dd>
                    </div>

                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">მხარე</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <Select onValueChange={(e) =>
                                setJobData({
                                    ...jobData,
                                    region: e
                                })}
                                value={jobData.region}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="მხარე" />
                                </SelectTrigger>
                                <SelectContent>

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
                                </SelectContent>
                            </Select>
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">ადგილმდებარეობა</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <Map

                                minZoom={7}
                                reuseMaps
                                accessToken="pk.eyJ1IjoiaXJha2xpMjIwNiIsImEiOiJja3dkZzl3dDgwa2FyMnBwbjEybjd0dmxpIn0.-XNJzlRbWG0zH2Q1MRpmOA"
                                mapboxAccessToken="pk.eyJ1IjoiaXJha2xpMjIwNiIsImEiOiJja3dkZzl3dDgwa2FyMnBwbjEybjd0dmxpIn0.-XNJzlRbWG0zH2Q1MRpmOA"
                                initialViewState={{
                                    longitude: 44,
                                    latitude: 42,
                                    zoom: 6
                                }}

                                onClick={(e) => {
                                    setJobData({
                                        ...jobData,
                                        coordinates: [e.lngLat.lat, e.lngLat.lng]
                                    })
                                }}
                                style={{ width: '100%', height: 400 }}
                                mapStyle="mapbox://styles/mapbox/light-v11"
                            >
                                {jobData.coordinates && jobData.coordinates.length &&
                                    <Marker
                                        latitude={jobData.coordinates[0]}
                                        longitude={jobData.coordinates[1]}

                                    >

                                        <div className={classNames(`w-7 h-7 cursor-pointer flex items-center justify-center text-white bg-primary rounded-full `)}>
                                            <BsBriefcaseFill size={16} />
                                        </div>
                                    </Marker>
                                }

                            </Map>
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">რეზიუმეს გამოგზავნა</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <Textarea
                                maxLength={200}
                                value={jobData.application_instruction}
                                onChange={(e) => {
                                    setJobData({
                                        ...jobData,
                                        application_instruction: e.target.value
                                    })
                                }} 

                            />
                        </dd>
                    </div>
                </dl>
            </div>

            <Button disabled={loading} size={'lg'} className='my-12 w-full' onClick={handleSave}>
                {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                შენახვა</Button>
        </div>
    )
}

export default Edit