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
import { clearCache, getRegionFromCoordinates, getUser } from '@/app/action';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { industries } from '@/utils/static-data';

const CreateJob = () => {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [noSalary, setNoSalary] = useState(false)
    const [jobData, setJobData] = useState<any>({
        id: crypto.randomUUID(),
        profile_id: "",
        title: "",
        company_name: "",
        description: "",
        responsibilities: [],
        required_experiences: [],
        min_salary: undefined,
        max_salary: undefined,
        region: "",
        coordinates: [],
        // application_instruction: ""
    })
    const [logo, setLogo] = useState<File | undefined>()

    const { toast } = useToast()

    useEffect(() => {
        if (!jobData.min_salary) setNoSalary(true)

    }, [])

    useEffect(() => {
        if (noSalary) {
            setJobData({ ...jobData, min_salary: null, max_salary: null })
        }
    }, [noSalary])

    useEffect(() => {
        const getUserData = async () => {
            const userData = await getUser()
            if (userData) setJobData({
                ...jobData,
                profile_id: userData.id
            })
        }
        getUserData()
    }, [])

    const validateFields = () => {
        if (!jobData.title || !jobData.company_name || !jobData.industry || !jobData.coordinates.length) {
            throw new Error("საჭიროა შეავსოთ სამსახურის სახელი, კომპანიის სახელი, კატეგორია და მონიშნოთ ადგილმდებარეობა")
        }
        else if ((jobData.max_salary < jobData.min_salary) || jobData.min_salary < 0 || jobData.max_salary < 0) {
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
                    contentType: 'image/*'
                })
                if (imageUploadError) throw new Error(imageUploadError.message)
                imagePath = imageUpload
            }

            const regionFromCoordinates = await getRegionFromCoordinates(jobData.coordinates)

            const formattedJobData = { ...jobData }
            formattedJobData.responsibilities = formattedJobData.responsibilities.map((r: { id: string, text: string }) => r.text)
            formattedJobData.required_experiences = formattedJobData.required_experiences.map((e: { id: string, text: string }) => e.text)
            formattedJobData.region = regionFromCoordinates
            if (imagePath && imagePath.path) formattedJobData.company_logo = `https://stgxrceiydjulhnxizqz.supabase.co/storage/v1/object/public/jobs/${imagePath.path}`

            const { error, status } = await supabase.from('jobs').insert({
                ...formattedJobData,
            })
            if (error) throw new Error(error.message)



            toast({
                title: "წარმატება",
                description: "ახალი სამსახური წარმატებით იქნა დამატებული",
                duration: 3000,
            })

            clearCache('/')

            router.push('/dashboard')

        } catch (e) {
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
                {/* <p className="mt-3 max-w-2xl text-sm  text-zinc-500">{job.location}</p> */}
            </div>

            <div className="mt-6 border-t border-zinc-200">

                <dl className="divide-y divide-zinc-200">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-zinc-900">კატეგორია</dt>
                        <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
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
                                    {industries.map(industry => (
                                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>

                                    ))}

                                </SelectContent>
                            </Select>
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-zinc-900">სამსახურის შესახებ</dt>
                        <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
                            <Textarea
                                maxLength={1000}
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
                        <dt className="text-sm font-medium leading-6 text-zinc-900">შენი პასუხისმგებლობები</dt>
                        <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
                            <ol className='flex flex-col gap-2 list-disc'>
                                {
                                    jobData.responsibilities.map((responsibility: any, i) => {
                                        return <div key={responsibility.id} className='flex gap-2 items-center'>
                                            <Input

                                                value={responsibility[i]}
                                                onChange={(e) => {
                                                    let updatedResponsibilities = [...jobData.responsibilities]
                                                    updatedResponsibilities[i].text = e.target.value
                                                    setJobData(prevState => ({
                                                        ...prevState,
                                                        responsibilities: updatedResponsibilities
                                                    }))
                                                }}
                                            />
                                            <Button onClick={() => {
                                                setJobData(prevState => ({
                                                    ...prevState,
                                                    responsibilities: prevState.responsibilities.filter((r) => r.id !== responsibility.id)
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
                                        setJobData(jobData => ({
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
                        <dt className="text-sm font-medium leading-6 text-zinc-900">გამოცდილება და უნარჩვევები</dt>
                        <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
                            <ol className='flex flex-col gap-2 list-disc'>
                                {
                                    jobData.required_experiences.map((experience: any, i) => {
                                        return <div key={experience.id} className='flex gap-2 items-center'>
                                            <Input

                                                value={experience[i]}
                                                onChange={(e) => {
                                                    let updatedResponsibilities = [...jobData.required_experiences]
                                                    updatedResponsibilities[i].text = e.target.value
                                                    setJobData(prevState => ({
                                                        ...prevState,
                                                        required_experiences: updatedResponsibilities
                                                    }))
                                                }}
                                            />
                                            <Button onClick={() => {
                                                setJobData(prevState => ({
                                                    ...prevState,
                                                    required_experiences: prevState.required_experiences.filter((e) => e.id !== experience.id)
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
                                        setJobData(required_experiences => ({
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
                        <dt className="text-sm font-medium leading-6 text-zinc-900">ანაზღაურება</dt>
                        <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0 flex flex-col gap-4">
                            <div className="flex gap-2">
                                <Input disabled={noSalary} placeholder='-დან' type='number' value={jobData.min_salary || ''} onChange={(e) => {
                                    setJobData({
                                        ...jobData,
                                        min_salary: e.target.valueAsNumber
                                    })
                                }} />
                                <Input disabled={noSalary} placeholder='-მდე' type='number' value={jobData.max_salary || ''} onChange={(e) => {
                                    setJobData({
                                        ...jobData,
                                        max_salary: e.target.valueAsNumber
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
                        </dd>
                    </div>

                    {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-zinc-900">მხარე</dt>
                        <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
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
                    </div> */}
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-zinc-900">ადგილმდებარეობა</dt>
                        <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
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
                                {jobData.coordinates.length &&
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
                    {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-zinc-900">რეზიუმეს გამოგზავნა</dt>
                        <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
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
                    </div> */}
                </dl>
            </div>

            <Button disabled={loading} size={'lg'} className='my-12 w-full' onClick={handleSave}>
                {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                შენახვა
            </Button>
        </div>
    )
}

export default CreateJob