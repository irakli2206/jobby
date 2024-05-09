'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import classNames from 'classnames';
import { randomUUID } from 'crypto';
import { Delete, DeleteIcon, Plus, Trash } from 'lucide-react';
import Image from 'next/image'
import React, { useState } from 'react'
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

const CreateJob = () => {

    const [jobData, setJobData] = useState<any>({
        id: crypto.randomUUID(),
        title: "",
        company_name: "",
        description: "",
        responsibilities: [],
        required_experiences: [],
        salary: "",
        location: "",
        coordinates: [],
        application_instruction: ""
    })
    const [logo, setLogo] = useState<File | undefined>()

    const { toast } = useToast()

    const validateFields = () => {
        if (!jobData.title || !jobData.company_name || !jobData.company_name || !jobData.description || !jobData.responsibilities.length || !jobData.coordinates.length || !jobData.required_experiences.length || !jobData.salary || !jobData.location || !application_instruction) {
            console.log('reached')
            toast({
                title: "შეცდომა",
                description: 'გთხოვთ შეავსოთ ან წაშალოთ ცარიელი ველები',
                duration: 5000,
                variant: 'destructive'
            })
        }
    }

    console.log(jobData.responsibilities)
    // const handleSave = async () => {
    //     try {
    //         setLoading(true)
    //         const { data: imageUpload, error: imageUploadError } = await supabase.storage.from('avatars').upload(`public/${profile.id}`, avatar as File, {
    //             upsert: true,
    //             contentType: 'image/jpeg'
    //         })

    //         if (imageUploadError) return toast({
    //             title: "Error",
    //             description: imageUploadError.message,
    //             duration: 3000,
    //             variant: 'destructive'
    //         })

    //         const { error, status } = await supabase.from('profiles').update({
    //             ...profile,
    //             avatar: "https://ctvgjowlmxhioryyhtkv.supabase.co/storage/v1/object/public/avatars/" + imageUpload.path
    //         }).eq('id', profile.id)
    //         toast({
    //             title: "Success",
    //             description: "Your profile details have been updated",
    //             duration: 3000,
    //         })

    //         clearCache('/')

    //     } catch (e) {
    //         toast({
    //             title: "Oops",
    //             description: JSON.stringify(e),
    //             duration: 3000,
    //         })
    //     } finally {
    //         setLoading(false)
    //     }

    // }

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
                    <Input type="text" id="title" placeholder="ვებ დეველოპერი" />
                </div>


                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="name">კომპანიის დასახელება</Label>
                    <Input type="text" id="name" placeholder="Apple" />
                </div>
                {/* <p className="mt-3 max-w-2xl text-sm  text-gray-500">{job.location}</p> */}
            </div>
            <div className="mt-6 border-t border-gray-200">
                <dl className="divide-y divide-gray-200">
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
                                    <Plus size={16} className='mr-1' /> Add
                                </Button>
                            </ol>
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">საჭირო გამოცდილება</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
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
                                    <Plus size={16} className='mr-1' /> Add
                                </Button>
                            </ol>
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">ანაზღაურება</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <Textarea
                                maxLength={128}
                                placeholder='1500-2500 ლარი გამოცდილების მიხედვით'
                                value={jobData.salary}
                                onChange={(e) => {
                                    setJobData({
                                        ...jobData,
                                        salary: e.target.value
                                    })
                                }}

                            />
                        </dd>
                    </div>

                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">მხარე</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="აირჩიე მხარე" />
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
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">რეზიუმეს გამოგზავნა</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <Textarea
                                maxLength={200}
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
                </dl>
            </div>

            <Button size={'lg'} className='my-12 w-full' onClick={validateFields}>შენახვა</Button>
        </div>
    )
}

export default CreateJob