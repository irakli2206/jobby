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
import { clearCache, getJobById, getRegionFromCoordinates, getUser } from '@/app/action';
import { createClient } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { industries } from '@/utils/static-data';
import MultiInput, { MultiInputObjectT } from '@/app/dashboard/components/multi-input';

type Props = {
    jobDataDTO: any
}

const EditView = ({ jobDataDTO }: Props) => {
    const supabase = createClient()
    const router = useRouter()
    const params = useParams()
    const [loading, setLoading] = useState(false)
    const [noSalary, setNoSalary] = useState(false)
    const [jobData, setJobData] = useState<any>(jobDataDTO)
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


    console.log(jobData)
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
                    contentType: 'image/webp'
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
                duration: 8000,
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }

    }

    const handleChange = (key: string, value: any) => {
        setJobData({ ...jobData, [key]: value })
    }

    const handleMultiInputAdd = (key: string) => {
        const id = crypto.randomUUID()
        handleChange(key, [...jobData[key], {
            id,
            text: ""
        }])
    }

    const handleMultiInputRemove = (key: string, idToRemove: string) => {
        handleChange(key, jobData[key].filter((e: any) => e.id !== idToRemove))
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
                            handleChange('title', e.target.value)
                        }}
                    />
                </div>


                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="name">კომპანიის დასახელება</Label>
                    <Input type="text" id="name" placeholder="Apple"
                        value={jobData.company_name}
                        onChange={(e) => {
                            handleChange('company_name', e.target.value)
                        }}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <div className="flex  items-center space-x-2">
                        <Label htmlFor="is_remote">დისტანციური</Label>
                        {/* <Switch id="airplane-mode" /> */}
                        <Checkbox id="is_remote" checked={jobData.is_remote} onCheckedChange={(e) => handleChange('is_remote', e)} />
                    </div>
                    <div className="flex  items-center space-x-2">
                        <Label htmlFor="urgent">სასწრაფო</Label>
                        {/* <Switch id="airplane-mode" /> */}
                        <Checkbox id="urgent" checked={jobData.urgent} onCheckedChange={(e) => handleChange('urgent', e)} />
                    </div>
                </div>
            </div>

            <div className="mt-6 border-t border-zinc-200">

                <dl className="divide-y divide-zinc-200">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-zinc-900">კატეგორია</dt>
                        <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
                            <Select onValueChange={(e) => handleChange('industry', e)}
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
                                    handleChange('description', e.target.value)
                                }}

                            />
                        </dd>
                    </div>
                    <MultiInput
                        label='შენი პასუხისმგებლობები'
                        inputs={jobData.responsibilities}
                        handleAdd={() => handleMultiInputAdd('responsibilities')}
                        handleChange={(e) => handleChange('responsibilities', e)}
                        handleRemove={(e) => handleMultiInputRemove('responsibilities', e)}
                    />
                    <MultiInput
                        label='გამოცდილება და უნარჩვევები'
                        inputs={jobData.required_experiences}
                        handleAdd={() => handleMultiInputAdd('required_experiences')}
                        handleChange={(e) => handleChange('required_experiences', e)}
                        handleRemove={(e) => handleMultiInputRemove('required_experiences', e)}
                    />

                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-zinc-900">ანაზღაურება (თვე)</dt>
                        <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0 flex flex-col gap-4">

                            <div className="flex gap-2 items-center">
                                <Input disabled={noSalary} placeholder='-დან' type='number' value={jobData.min_salary || ''} onChange={(e) => {
                                    handleChange('min_salary', e.target.valueAsNumber)
                                }} />
                                <span>-</span>
                                <Input disabled={noSalary} placeholder='-მდე' type='number' value={jobData.max_salary || ''} onChange={(e) => {
                                    handleChange('max_salary', e.target.valueAsNumber)
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

                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-zinc-900">ადგილმდებარეობა</dt>
                        <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
                            <Map

                                minZoom={7}
                                reuseMaps
                                accessToken="pk.eyJ1IjoiaXJha2xpMjIwNiIsImEiOiJja3dkZzl3dDgwa2FyMnBwbjEybjd0dmxpIn0.-XNJzlRbWG0zH2Q1MRpmOA"
                                mapboxAccessToken="pk.eyJ1IjoiaXJha2xpMjIwNiIsImEiOiJja3dkZzl3dDgwa2FyMnBwbjEybjd0dmxpIn0.-XNJzlRbWG0zH2Q1MRpmOA"
                                initialViewState={{
                                    longitude: jobDataDTO.coordinates[1],
                                    latitude: jobDataDTO.coordinates[0],
                                    zoom: 12
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

                </dl>
            </div>

            <Button disabled={loading} size={'lg'} className='my-12 w-full' onClick={() => handleSave()}>
                {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                შენახვა</Button>
        </div>
    )
}

export default EditView