'use client'

import Image from "next/image";
import Map, { MapRef, Marker, ViewState } from 'react-map-gl';
import Sidebar from "@/components/sidebar";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { BsBriefcaseFill } from "react-icons/bs";
import { getFilteredJobs } from "./action";

export type Coordinates = [number, number]

export type Job = {
  id: number
  coordinates: Coordinates
  companyName: string
  companyLogo: string
  region: string
  salary: string
  title: string
}

function isEqual(objA: Object, objB: Object) {
  return JSON.stringify(objA) === JSON.stringify(objB);
}

export default function Home() {
  const mapRef = useRef<MapRef | null>(null)


  const [filters, setFilters] = useState({
    title: "",
    region: "",
    industry: ""
  })
  //useRef doesn't change between renders, but filters state does, meaning we can identify when the two start differing
  const prevFilters = useRef(filters)
  const filtersChanged = !isEqual(filters, prevFilters.current)
  const [jobsData, setJobsData] = useState<any[]>([])
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


  const filterJobs = async () => {
    try {
      const jobs = await getFilteredJobs(filters.title, filters.region, filters.industry)
      //@ts-ignore
      if (jobs.error) throw new Error(jobs.error.message)

      setJobsData(jobs.data!)
      prevFilters.current = filters

    } catch (e) {
      console.log(e)
    }
  }

  const clearFilters = async () => {
    try {
      const emptyFilters = {
        industry: "",
        region: "",
        title: ""
      }
      setFilters(emptyFilters)
      const jobs = await getFilteredJobs("", "", "")
      //@ts-ignore
      if (jobs.error) throw new Error(jobs.error.message)

      setJobsData(jobs.data!)
      prevFilters.current = emptyFilters

    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    const getJobsData = async () => {
      try {
        const jobs = await getFilteredJobs()
        if (jobs.error) throw new Error(jobs.error.message)

        setJobsData(jobs.data!)

      } catch (e) {
        console.log(e)
      }
    }
    getJobsData()
  }, [])

  const handleFilterChange = (key: string, value: string | undefined) => {
    console.log(key, value)
    setFilters({ ...filters, [key]: value })
  }

  const locateJob = (job: Job | null) => {

    if (mapRef) {
      if (JSON.stringify(job) === JSON.stringify(locatedJob)) {
        console.log('reached')
        setLocatedJob(null)
      }
      else {
        const jobCoordinates = job!.coordinates

        mapRef.current.flyTo({
          center: [jobCoordinates[1], jobCoordinates[0]],
          zoom: 12,
          duration: 1000,
          essential: true,

        })

        setLocatedJob(job)
      }


    }
  }


  return (
    <main className="flex h-[calc(100vh-64px)] w-full justify-between ">
      <Sidebar filterJobs={filterJobs} clearFilters={clearFilters} filtersChanged={filtersChanged} titleFilter={filters.title} regionFilter={filters.region} industryFilter={filters.industry} handleFilterChange={handleFilterChange} jobsData={jobsData} locateJob={locateJob} locatedJob={locatedJob} />
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
        // maxBounds={[[40, 39], [46.5, 43]]} ზუმზე ვეღარ მოძრაობ აჩმახებს მაგრად
        onMove={(e) => setViewState(e.viewState)}
        style={{ width: '50%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
      >
        {jobsData.map((job) => {
          const { coordinates } = job
          const isLocated = locatedJob ? JSON.stringify(locatedJob.coordinates) == JSON.stringify(coordinates) : false
          return (
            <>
              {coordinates ? <Marker
                key={job.id}
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
                :
                null
              }
            </>

          )
        })}

      </Map>
    </main>
  );
}
