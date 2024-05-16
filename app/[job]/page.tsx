
import classNames from 'classnames';
import Image from 'next/image'
import React from 'react'
import { BsBriefcaseFill } from 'react-icons/bs';
import Map, { MapRef, Marker, ViewState } from 'react-map-gl';
import { getJobById, incrementJobViews } from '../action';
import MapView from './map';

type Params = {
    job: string
}

type Props = {
    params: Params
}


const Job = async ({ params }: Props) => {
    const job = await getJobById(params.job)
    await incrementJobViews(job)

    return (
        <div className='py-12 px-4 max-w-7xl mx-auto '>
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
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">შენი პასუხისმგებლობები</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <ol className='flex flex-col gap-2 list-disc list-inside'>
                                {job.responsibilities.map(r => {
                                    return <li>{r}</li>
                                })}
                            </ol>
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">საჭირო გამოცდილება</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <ol className='flex flex-col gap-2 list-disc list-inside'>
                                {job.required_experiences.map(e => {
                                    return <li>{e}</li>
                                })}
                            </ol>
                        </dd>
                    </div>
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
                                job={job}
                            />
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">რეზიუმეს გამოგზავნა</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            გამოგზავნთ თქვენი რეზიუმე შემდეგ მისამართზე და მიუთითეთ სამსახურის დასახელება: twinit@gmail.com
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    )
}

export default Job