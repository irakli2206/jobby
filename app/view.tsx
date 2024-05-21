'use client'

import Image from "next/image";
import Map, { MapRef, Marker, Popup, ViewState, ViewStateChangeEvent } from 'react-map-gl';
import Sidebar from "@/components/sidebar";
import { Fragment, createRef, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { BsBriefcaseFill } from "react-icons/bs";
import { getFilteredJobs, getJobById, getMapJobs } from "./action";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import React from 'react'
import Spinner from "@/components/spinner";
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { Skeleton } from "@/components/ui/skeleton";
import { TbCurrencyLari } from "react-icons/tb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import JobDetails from "@/components/job-details";

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

// export type Props = {
//   filterJobs: Function
//   clearFilters: Function
//   filtersChanged: boolean
//   sortBy: 'created_at' | 'views'
//   setSortBy: (sort: 'created_at' | 'views') => void
//   titleFilter: string
//   regionFilter: string | undefined
//   industryFilter: string | undefined
//   handleFilterChange: (key: string, value: string | undefined) => void
//   jobsData: Job[]
//   locateJob: (job: Job | null) => void
//   locatedJob: Job | null
//   mapRef?: React.MutableRefObject<MapRef | null>
//   viewState: ViewState
//   setViewState: ViewStateChangeEvent
// }

function isEqual(objA: Object, objB: Object) {
  return JSON.stringify(objA) === JSON.stringify(objB);
}

type Props = {
  initialJobData: any[]
  initialMapData: any[]
}

const JobsView = ({ initialJobData, initialMapData }: Props) => {
  const mapRef = useRef<MapRef | null>(null)

  const [windowWidth, setWindowWidth] = useState<number | null>()
  const [filters, setFilters] = useState({
    title: "",
    region: [],
    industry: [],
    isRemote: false
  })
  //useRef doesn't change between renders, but filters state does, meaning we can identify when the two start differing
  const prevFilters = useRef(filters)
  const filtersChanged = !isEqual(filters, prevFilters.current)
  const [currentPage, setCurrentPage] = useState(1)
  const [jobsData, setJobsData] = useState<any[]>(initialJobData)
  const [mapData, setMapData] = useState<any[]>(initialMapData)
  const [jobsCount, setJobsCount] = useState<number | undefined>()
  const [locatedJob, setLocatedJob] = useState<Job | null>(null)
  const [sortBy, setSortBy] = useState<"created_at" | "views">('created_at')
  const [viewState, setViewState] = useState<Partial<ViewState>>({
    longitude: 44,
    latitude: 42,
    zoom: 6,
  })
  const [mapLoading, setMapLoading] = useState(true)

  const [selectedJobDetails, setSelectedJobDetails] = useState<any>()

  const closeJobDetails = () => {
    setSelectedJobDetails(null)
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])


  //Getting job data on first render and sortBy change
  useEffect(() => {
    const getJobsData = async () => {
      try {
        // const cachedCurrentPage = window.sessionStorage.getItem('currentPage')
        // const jobs = await getFilteredJobs(filters.title, filters.region, filters.industry, sortBy, cachedCurrentPage ? Number(cachedCurrentPage) : 0)
        const jobs = await getFilteredJobs(filters.title, filters.region, filters.industry, filters.isRemote, sortBy)
        if (jobs.error) throw new Error(jobs.error.message)

        setJobsData(jobs.data!)
        setJobsCount(jobs.count)
      } catch (e) {
        console.log(e)
      }
    }
    getJobsData()
  }, [sortBy])

  useEffect(() => {
    // if (mapRef.current) {
    //   mapRef.current.addControl(new MapboxLanguage({ defaultLanguage: 'ka' }))
    // }


    const getMapData = async () => {
      const ids = jobsData.map(j => j.id)
      const mapDataRes = await getMapJobs(ids)

      if (!mapDataRes.error) {
        setMapData(mapDataRes.data!)
        setMapLoading(false)
      }
    }
    getMapData()
  }, [jobsData])


  const filterJobs = async () => {
    try {
      // window.sessionStorage.removeItem('currentPage')
      const { title, region, industry, isRemote } = filters
      const jobs = await getFilteredJobs(title, region, industry, isRemote)
      console.log('jobs', jobs)
      //@ts-ignore
      if (jobs.error) throw new Error(jobs.error.message)

      setCurrentPage(1)
      setJobsData(jobs.data!)
      setJobsCount(jobs.count)
      prevFilters.current = filters

    } catch (e) {
      console.log(e)
    }
  }

  const clearFilters = async () => {
    try {
      const emptyFilters = {
        title: "",
        industry: [],
        region: [],
        isRemote: false
      }
      prevFilters.current = emptyFilters
      setFilters(emptyFilters)
      const jobs = await getFilteredJobs("", [], [], false, sortBy)
      //@ts-ignore
      if (jobs.error) throw new Error(jobs.error.message)

      setCurrentPage(1)
      setJobsData(jobs.data!)
      setJobsCount(jobs.count)

    } catch (e) {
      console.log(e)
    }
  }


  const locateJob = async (job: Job | null, mapClick: boolean = false) => {
    if (mapRef) {

      const jobCoordinates = job!.coordinates

      mapRef.current.flyTo({
        center: [jobCoordinates[1], jobCoordinates[0]],
        zoom: 14,
        duration: 1000,
        essential: true,

      })

      setLocatedJob(job)




    }
  }


  const getNextPage = async () => {
    if (jobsCount === jobsData.length) return

    const { title, region, industry, isRemote } = filters
    const jobs = await getFilteredJobs(title, region, industry, isRemote, sortBy, currentPage)
    if (jobs.error) throw new Error(jobs.error)

    if (jobs.data?.length) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      setJobsData([...jobs.data!])
      // window.sessionStorage.setItem('currentPage', String(nextPage))

    }
  }


  const handleFilterChange = (key: string, value: string | string[] | boolean | undefined) => {
    console.log(key, value)
    setFilters({ ...filters, [key]: value })
  }


  return (
    <>
      {windowWidth ? <>
        {
          windowWidth > 1280 ?
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel maxSize={55} defaultSize={45}>
                <Sidebar remoteFilter={filters.isRemote} selectedJobDetails={selectedJobDetails} setSelectedJobDetails={setSelectedJobDetails} getNextPage={getNextPage} jobsCount={jobsCount!} filterJobs={filterJobs} clearFilters={clearFilters} filtersChanged={filtersChanged} sortBy={sortBy} setSortBy={setSortBy} titleFilter={filters.title} regionFilter={filters.region} industryFilter={filters.industry} handleFilterChange={handleFilterChange} jobsData={jobsData} locateJob={locateJob} locatedJob={locatedJob} />
              </ResizablePanel>
              <ResizableHandle withHandle className="z-20" />
              <ResizablePanel maxSize={55} defaultSize={55} className="relative !overflow-y-auto no-scrollbar">

                <div className={classNames("absolute w-full h-full bg-white top-0 -right-full transition z-10", {
                  '-translate-x-full': selectedJobDetails
                })}>
                  {selectedJobDetails ?
                    <JobDetails
                      job={selectedJobDetails}
                      closeJobDetails={closeJobDetails}
                    />
                    :
                    null
                  }

                </div>

                <Map
                  id='home-map'
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
                  style={{ width: '100%', height: '100%' }}
                  mapStyle="mapbox://styles/mapbox/light-v11"
                >
                  {mapLoading && <div className="relative w-full h-full flex items-center justify-center bg-white/50">
                    <Loader className={classNames('h-20 w-20 animate-spin ')} />
                  </div>
                  }



                  {mapData.map((job) => {
                    const { id, coordinates } = job
                    const isLocated = locatedJob ? locatedJob.id == id : false
                    return (
                      <Fragment key={id} >
                        {coordinates ? <Marker
                          latitude={coordinates[0]}
                          longitude={coordinates[1]}
                          onClick={() => {

                            console.log('reached')
                            setSelectedJobDetails(job)
                            // locateJob(job, true)
                          }}
                          style={{ zIndex: isLocated ? 1 : 0 }}
                        >

                          <div className={classNames(`w-7 h-7 cursor-pointer flex items-center justify-center relative text-white bg-primary rounded-full `, {
                            // '!bg-green-400 !shadow-[0_0_0px_6px_rgba(74,222,128,0.5)] ': isLocated
                          })}>
                            <BsBriefcaseFill size={16} />
                          </div>
                        </Marker>
                          :
                          null
                        }
                      </Fragment>

                    )
                  })}

                </Map>


              </ResizablePanel>
            </ResizablePanelGroup>
            :
            <div className="relative w-full overflow-x-hidden no-scrollbar">
              <div className={classNames("absolute w-full h-full bg-white top-0 -right-full transition z-10 ", {
                '-translate-x-full': selectedJobDetails
              })}>
                {selectedJobDetails ?
                  <JobDetails
                    key={selectedJobDetails.id}
                    job={selectedJobDetails}
                    closeJobDetails={closeJobDetails}
                  />
                  :
                  null
                }

              </div>
              <Sidebar remoteFilter={filters.isRemote} selectedJobDetails={setSelectedJobDetails} setSelectedJobDetails={setSelectedJobDetails} jobsCount={jobsCount!} getNextPage={getNextPage} filterJobs={filterJobs} clearFilters={clearFilters} filtersChanged={filtersChanged} sortBy={sortBy} setSortBy={setSortBy} titleFilter={filters.title} regionFilter={filters.region} industryFilter={filters.industry} handleFilterChange={handleFilterChange} jobsData={jobsData} locateJob={locateJob} locatedJob={locatedJob} />

            </div>
        }
      </>
        :
        null
      }

    </>

  )
}

export default JobsView


