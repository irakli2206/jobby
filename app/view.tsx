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

export type Props = {
  filterJobs: Function
  clearFilters: Function
  filtersChanged: boolean
  sortBy: 'created_at' | 'views'
  setSortBy: (sort: 'created_at' | 'views') => void
  titleFilter: string
  regionFilter: string | undefined
  industryFilter: string | undefined
  handleFilterChange: (key: string, value: string | undefined) => void
  jobsData: Job[]
  locateJob: (job: Job | null) => void
  locatedJob: Job | null
  mapRef?: React.MutableRefObject<MapRef | null>
  viewState: ViewState
  setViewState: ViewStateChangeEvent
}

function isEqual(objA: Object, objB: Object) {
  return JSON.stringify(objA) === JSON.stringify(objB);
}

const JobsView = () => {
  const mapRef = useRef<MapRef | null>(null)

  const [windowWidth, setWindowWidth] = useState<number | null>()
  const [filters, setFilters] = useState({
    title: "",
    region: "",
    industry: ""
  })
  //useRef doesn't change between renders, but filters state does, meaning we can identify when the two start differing
  const prevFilters = useRef(filters)
  const filtersChanged = !isEqual(filters, prevFilters.current)
  const [currentPage, setCurrentPage] = useState(1)
  const [jobsData, setJobsData] = useState<any[]>([])
  const [mapData, setMapData] = useState<any[]>([])
  const [jobsCount, setJobsCount] = useState<number | undefined>()
  const [locatedJob, setLocatedJob] = useState<Job | null>(null)
  const [sortBy, setSortBy] = useState<"created_at" | "views">('created_at')
  const [viewState, setViewState] = useState<Partial<ViewState>>({
    longitude: 44,
    latitude: 42,
    zoom: 6,
  })
  const [popupData, setPopupData] = useState<any>()
  const [popupLoadingData, setPopupLoadingData] = useState<any>()

  const isMapLoading = useMemo(() => {

    return jobsData.length !== mapData.length
  }, [jobsData, mapData])

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
        const jobs = await getFilteredJobs(filters.title, filters.region, filters.industry, sortBy)
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

      if (!mapDataRes.error) setMapData(mapDataRes.data!)

    }
    getMapData()
  }, [jobsData])


  const filterJobs = async () => {
    try {
      // window.sessionStorage.removeItem('currentPage')
      const jobs = await getFilteredJobs(filters.title, filters.region, filters.industry)
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
        industry: "",
        region: "",
        title: ""
      }
      setFilters(emptyFilters)
      const jobs = await getFilteredJobs("", "", "", sortBy)
      //@ts-ignore
      if (jobs.error) throw new Error(jobs.error.message)

      setCurrentPage(1)
      setJobsData(jobs.data!)
      prevFilters.current = emptyFilters

    } catch (e) {
      console.log(e)
    }
  }


  const locateJob = async (job: Job | null, mapClick: boolean = false) => {
    if (mapRef) {
      if (locatedJob && (job.id === locatedJob.id)) {
        setPopupData(null)
        setLocatedJob(null)
        setPopupLoadingData(null)
        return
      }

      if (mapClick) {
        try {
          const jobData = await getJobById(job.id)
          setPopupLoadingData(null)
          setPopupData(jobData)
          setLocatedJob(jobData)
        } finally {


        }

      }
      else {
        setPopupData(null)
        setPopupLoadingData(null)
        const jobCoordinates = job!.coordinates

        mapRef.current.flyTo({
          center: [jobCoordinates[1], jobCoordinates[0]],
          zoom: 10,
          duration: 1000,
          essential: true,

        })

        setLocatedJob(job)


      }

    }
  }


  const getNextPage = async () => {
    if (jobsCount === jobsData.length) return

    const jobs = await getFilteredJobs(filters.title, filters.region, filters.industry, sortBy, currentPage)
    if (jobs.error) throw new Error(jobs.error)

    if (jobs.data?.length) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      setJobsData([...jobs.data!])
      // window.sessionStorage.setItem('currentPage', String(nextPage))

    }
  }


  const handleFilterChange = (key: string, value: string | undefined) => {
    setFilters({ ...filters, [key]: value })
  }


  return (
    <>
      {windowWidth ? <>
        {
          windowWidth > 1264 ?
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel maxSize={55} defaultSize={45}>
                <Sidebar getNextPage={getNextPage} jobsCount={jobsCount!} filterJobs={filterJobs} clearFilters={clearFilters} filtersChanged={filtersChanged} sortBy={sortBy} setSortBy={setSortBy} titleFilter={filters.title} regionFilter={filters.region} industryFilter={filters.industry} handleFilterChange={handleFilterChange} jobsData={jobsData} locateJob={locateJob} locatedJob={locatedJob} />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel maxSize={55} defaultSize={55} >

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
                  style={{ width: '100%', height: '100%' }}
                  mapStyle="mapbox://styles/mapbox/light-v11"
                >
                  {popupLoadingData &&
                    <Popup key={crypto.randomUUID()} latitude={popupLoadingData.coordinates[0]} longitude={popupLoadingData.coordinates[1]}
                      anchor="bottom"
                      className='pb-6 '
                      onClose={() => {
                        setPopupData(null)
                        setLocatedJob(null)
                      }}>

                      <div className="w-full h-full bg-whiterounded-sm border p-4">
                        <div className="flex flex-row gap-3 items-center">
                          <Skeleton className="h-[40px] w-[40px] rounded-none " />
                          <div className="space-y-2">
                            <Skeleton className="h-2 w-24" />
                            <Skeleton className="h-2 w-24" />
                          </div>
                        </div>
                      </div>
                    </Popup>
                  }
                  {popupData && (
                    <Popup key={crypto.randomUUID()} latitude={popupData.coordinates[0]} longitude={popupData.coordinates[1]}
                      anchor="bottom"
                      className='pb-6 w-fit'
                      onClose={() => {
                        setPopupData(null)
                        setLocatedJob(null)
                      }}>
                      <Button asChild variant='ghost' className="" >
                        <Link href={`/${popupData.id}`} target='_blank' className=" h-full bg-white rounded-sm border p-4 focus-visible:!ring-0">
                          <div className="flex gap-4 items-center">
                            <Image
                              src={popupData.company_logo}
                              width={50}
                              height={1}
                              alt=''
                              className="h-[40px] w-[40px]  object-contain rounded-none "

                            />
                            <div className="space-y-1">
                              <p className="font-semibold  whitespace-pre-wrap" >{popupData.title}</p>
                              <p className="flex items-center text-green-500 "><TbCurrencyLari /> {popupData.salary ? `${popupData.salary[0]}-${popupData.salary[1]}` : 'შეთანხმებით'}</p>
                            </div>
                          </div>
                        </Link>
                      </Button>
                    </Popup>)}
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
                            setPopupLoadingData({ id, coordinates })
                            locateJob(job, true)
                          }}
                        >

                          <div className={classNames(`w-7 h-7 cursor-pointer flex items-center justify-center text-white bg-primary rounded-full `, {
                            '!bg-green-400 !shadow-[0_0_0px_6px_rgba(74,222,128,0.5)]': isLocated
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
            <Sidebar jobsCount={jobsCount!} getNextPage={getNextPage} filterJobs={filterJobs} clearFilters={clearFilters} filtersChanged={filtersChanged} sortBy={sortBy} setSortBy={setSortBy} titleFilter={filters.title} regionFilter={filters.region} industryFilter={filters.industry} handleFilterChange={handleFilterChange} jobsData={jobsData} locateJob={locateJob} locatedJob={locatedJob} />
        }
      </>
        :
        null
      }

    </>

  )
}

export default JobsView


