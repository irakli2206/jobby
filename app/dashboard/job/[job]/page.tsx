
import { getJobById } from '@/app/action';
import classNames from 'classnames';
import Image from 'next/image'
import React from 'react'
import { BsBriefcaseFill } from 'react-icons/bs';
import Map, { MapRef, Marker, ViewState } from 'react-map-gl';
import Maptest from './map';
import MapView from './map';

type Params = {
  job: string
}

type Props = {
  params: Params
}

const DashboardJob = async ({ params }: Props) => {
  const job = await getJobById(params.job)

  return (
    <div className='py-12 px-4 max-w-7xl mx-auto'>
      <div className="px-4 sm:px-0 flex w-full justify-between items-end">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
          <p className="  mt-1 max-w-2xl font-medium text-gray-500">{job.company_name}</p>
        </div>

        <div className='w-40 h-20 relative mb-2'>
          <Image
            src={job.company_logo}
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
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{job.min_salary ? `${job.min_salary}-${job.max_salary} ლარი` : "შეთანხმებით"}</dd>
          </div>
          {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">მხარე</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{job.region}</dd>
          </div> */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">ადგილმდებარეობა</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <MapView job={job} />
              {/* <Map

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
              </Map> */}
            </dd>
          </div>
          {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">რეზიუმეს გამოგზავნა</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {job.application_instruction}
            </dd>
          </div> */}
        </dl>
      </div>
    </div>
  )
}

export default DashboardJob