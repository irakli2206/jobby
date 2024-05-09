'use client'

import classNames from 'classnames';
import Image from 'next/image'
import React from 'react'
import { BsBriefcaseFill } from 'react-icons/bs';
import Map, { MapRef, Marker, ViewState } from 'react-map-gl';

type Params = {
    job: string
}

type Props = {
    params: Params
}

const job = {
    id: 1,
    coordinates: [42, 45],
    companyName: 'Twinit',
    companyLogo: "https://twinit.ge/assets/img/logo-blue.svg",
    region: "თბილისი",
    salary: "3200",
    title: 'პროგრამისტი'
}

const Job = ({ params }: Props) => {
    console.log(params)
    return (
        <div className='py-12 px-4 max-w-7xl mx-auto'>
            <div className="px-4 sm:px-0">
                <div className='w-40 h-20 relative mb-2'>
                    <Image
                        src={job.companyLogo}
                        fill
                        className='object-contain '
                    />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                <p className="  mt-1 max-w-2xl font-semibold text-gray-500">{job.companyName}</p>
                {/* <p className="mt-3 max-w-2xl text-sm  text-gray-500">{job.region}</p> */}
            </div>
            <div className="mt-6 border-t border-gray-200">
                <dl className="divide-y divide-gray-200">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">სამსახურის შესახებ</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio delectus vel commodi, ea incidunt, fugit labore consectetur corporis officia eos similique perferendis placeat recusandae. In harum placeat aspernatur, quibusdam dolor fuga sint consequatur error omnis, odit maxime similique. Animi architecto vero eaque ad nostrum ex earum officiis sequi aperiam inventore.</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">შენი პასუხისმგებლობები</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <ol className='flex flex-col gap-2 list-disc'>
                                <li>მიხედე ძაღლებს</li>
                                <li>აჭამე ძაღლებს</li>
                                <li>მოუარე ძაღლებს</li>
                                <li>გაართე ძაღლები</li>
                            </ol>
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">საჭირო გამოცდილება</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <ol className='flex flex-col gap-2 list-disc'>
                                <li>3 წელი ძაღლების მოვლის გამოცდილება</li>
                                <li>5 მიღებული ნაკბენი პიტბულისგან</li>
                                <li>ჰტმლის სიღრმისეული ცოდნა</li>
                                <li>მაგისტრატურა მინიმუმ</li>
                            </ol>
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">ანაზღაურება</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">1500-2000 ლარი გამოცდილების მიხედვით</dd>
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
                                    longitude: job.coordinates[1],
                                    latitude: job.coordinates[0],
                                    zoom: 12
                                }}
                                
                               
                                style={{ width: '100%', height: 400 }}
                                mapStyle="mapbox://styles/mapbox/light-v11"
                            >
                                <Marker
                                    latitude={job.coordinates[0]}
                                    longitude={job.coordinates[1]}
                                    
                                >
                                    
                                    <div className={`w-7 h-7 cursor-pointer flex items-center justify-center !bg-green-400 !shadow-[0_0_0px_6px_rgba(74,222,128,0.5)] text-white rounded-full `}>
                                        <BsBriefcaseFill size={16} />
                                    </div>
                                </Marker>
                            </Map>
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