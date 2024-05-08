'use client'

import Image from "next/image";
import Map, { MapRef, Marker, ViewState } from 'react-map-gl';
import Sidebar from "@/components/sidebar";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { BsBriefcaseFill } from "react-icons/bs";

export type Coordinates = [number, number]

export type Job = {
  id: number
  coordinates: Coordinates
  companyName: string
  companyLogo: string
  location: string
  salary: string
  title: string
}

const jobsData: Job[] = [
  {
    id: 1,
    coordinates: [42, 45],
    companyName: 'Twinit',
    companyLogo: "https://twinit.ge/assets/img/logo-blue.svg",
    location: "თბილისი",
    salary: "3200",
    title: 'პროგრამისტი'
  },
  {
    id: 2,
    coordinates: [42.2, 42.7],
    companyName: 'Example Company',
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png",
    location: "ქუთაისი",
    salary: "2800",
    title: 'დიზაინერი'
  },
  {
    id: 3,
    coordinates: [41.6, 41.7],
    companyName: 'Another Company',
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png",
    location: "ბათუმი",
    salary: "3500",
    title: 'პროექტმენეჯერი'
  },
  {
    id: 4,
    coordinates: [41.55, 45],
    companyName: 'Tech Solutions',
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png",
    location: "რუსთავი",
    salary: "3000",
    title: 'სისტემური ანალიტიკოსი'
  },
  {
    id: 5,
    coordinates: [42, 44],
    companyName: 'Software Co.',
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png",
    location: "გორი",
    salary: "3300",
    title: 'სოფთვერი დეველოპერი'
  },
  {
    id: 6,
    coordinates: [41.6, 43],
    companyName: 'Creative Solutions',
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png",
    location: "ახალციხე",
    salary: "2900",
    title: 'გრაფიკური დიზაინერი'
  }
];

export default function Home() {
  const mapRef = useRef<MapRef | null>(null)
  const [locatedJob, setLocatedJob] = useState<Job | null>(null)
  const [viewState, setViewState] = useState<Partial<ViewState>>({
    longitude: 44,
    latitude: 42,
    zoom: 6,
    // bearing: 0,
    // pitch: 0,
    // padding: {
    //   bottom: 0,
    //   top: 0,
    //   right: 0,
    //   left: 0
    // }
  })

  const locateJob = (job: Job | null) => {

    if (mapRef) {
      if (JSON.stringify(job) === JSON.stringify(locatedJob)) {
        console.log('reached')
        setLocatedJob(null)
      }
      else {
        const jobCoordinates = job.coordinates

        mapRef.current.flyTo({
          center: [jobCoordinates[1], jobCoordinates[0]],
          zoom: 12,
          duration: 2000,
          essential: true,

        })

        setViewState({ ...viewState, latitude: jobCoordinates[0], longitude: jobCoordinates[1], zoom: 12 })
        setLocatedJob(job)



      }


    }
  }



  return (
    <main className="flex h-full w-full justify-between ">
      <Sidebar jobsData={jobsData} locateJob={locateJob} locatedJob={locatedJob} />
      <Map
        ref={mapRef}
        minZoom={7}
        reuseMaps
        accessToken="pk.eyJ1IjoiaXJha2xpMjIwNiIsImEiOiJja3dkZzl3dDgwa2FyMnBwbjEybjd0dmxpIn0.-XNJzlRbWG0zH2Q1MRpmOA"
        mapboxAccessToken="pk.eyJ1IjoiaXJha2xpMjIwNiIsImEiOiJja3dkZzl3dDgwa2FyMnBwbjEybjd0dmxpIn0.-XNJzlRbWG0zH2Q1MRpmOA"
        initialViewState={{
          longitude: 44,
          latitude: 42,
          zoom: 6
        }}
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        style={{ width: '50%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
      >
        {jobsData.map((job) => {
          const { coordinates } = job
          const isLocated = locatedJob ? JSON.stringify(locatedJob.coordinates) == JSON.stringify(coordinates) : false
          return (
            <Marker
              latitude={coordinates[0]}
              longitude={coordinates[1]}
              onClick={() => {
                locateJob(job)
              }}
            >
              {/* <div className={classNames(`w-20  bg-white px-1 py-2 rounded-lg shadow`, {
                'w-10': viewState.zoom < 8
              })}>
                <Image
                  src={companyLogo}
                  width={100}
                  height={1}
                  className=' w-full h-full'
                />
              </div> */}
              <div className={classNames(`w-7 h-7 cursor-pointer flex items-center justify-center text-white bg-primary rounded-full `, {
                '!bg-green-400 !shadow-[0_0_0px_6px_rgba(74,222,128,0.5)]': isLocated
              })}>
                <BsBriefcaseFill size={16} />
              </div>
            </Marker>
          )
        })}

      </Map>
    </main>
  );
}
