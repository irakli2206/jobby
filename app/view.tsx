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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation";


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

type FiltersT = {
  title: string
  region: string[]
  industry: string[]
  salary: number | undefined
  isRemote: boolean
}

type Props = {
  initialJobData: any[]
  initialMapData: any[]
}

const JobsView = ({ initialJobData, initialMapData }: Props) => {
  const mapRef = useRef<MapRef | null>(null)
  const router = useRouter()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState<number | null>()
  const [filters, setFilters] = useState<FiltersT>({
    title: "",
    region: [],
    industry: [],
    salary: undefined,
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

  useEffect(() => {
    if (sessionStorage) {
      if (sessionStorage.getItem('dialogViewed') == 'true') {
        setIsDialogOpen(false)
      }
      else setIsDialogOpen(true)
    }

  }, [])


  //Getting job data on first render and sortBy change
  useEffect(() => {
    const getJobsData = async () => {
      try {
        // const cachedCurrentPage = window.sessionStorage.getItem('currentPage')
        // const jobs = await getFilteredJobs(filters.title, filters.region, filters.industry, sortBy, cachedCurrentPage ? Number(cachedCurrentPage) : 0)
        const jobs = await getFilteredJobs(filters.title, filters.region, filters.industry, Number(filters.salary as string), filters.isRemote, sortBy)
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

  const handleCloseDialog = (e: boolean) => {
    setIsDialogOpen(e)
    sessionStorage.setItem('dialogViewed', 'true')
  }

  const handleDialogAction = () => {
    setIsDialogOpen(false)
    sessionStorage.setItem('dialogViewed', 'true')
    router.push('dashboard')
  }

  const closeJobDetails = () => {
    setSelectedJobDetails(null)
  }


  const filterJobs = async () => {
    try {
      setMapLoading(true)
      // window.sessionStorage.removeItem('currentPage')
      const { title, region, industry, salary, isRemote } = filters
      const jobs = await getFilteredJobs(title, region, industry, salary, isRemote)
      //@ts-ignore
      if (jobs.error) throw new Error(jobs.error.message)

      setCurrentPage(1)
      setJobsData(jobs.data!)
      setJobsCount(jobs.count)
      prevFilters.current = filters

    } catch (e) {
      console.log(e)
    } finally {
      setMapLoading(false)
    }
  }

  const clearFilters = async () => {
    try {
      setMapLoading(true)
      const emptyFilters = {
        title: "",
        industry: [],
        region: [],
        salary: undefined,
        isRemote: false
      }
      prevFilters.current = emptyFilters
      setFilters(emptyFilters)
      const jobs = await getFilteredJobs("", [], [], undefined, false, sortBy)
      //@ts-ignore
      if (jobs.error) throw new Error(jobs.error.message)

      setCurrentPage(1)
      setJobsData(jobs.data!)
      setJobsCount(jobs.count)

    } catch (e) {
      console.log(e)
    } finally {
      setMapLoading(false)
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

    const { title, region, industry, salary, isRemote } = filters
    const jobs = await getFilteredJobs(title, region, industry, salary, isRemote, sortBy, currentPage)
    if (jobs.error) throw new Error(jobs.error)

    if (jobs.data?.length) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      setJobsData([...jobs.data!])
      // window.sessionStorage.setItem('currentPage', String(nextPage))

    }
  }


  const handleFilterChange = (key: string, value: string | string[] | boolean | undefined) => {
    setFilters({ ...filters, [key]: value })
  }


  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={handleCloseDialog}>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-end gap-2 text-xl">
              <svg className="h-12 w-12" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><g fill="none"><path fill="#f9c23c" d="m5.05 29.9l1.472-.394l.394-.855l2.55.067l2.653-.71l.598-.926l2.482.102l2.591-.694c1.8-.48 2.41-2.74 1.09-4.06L9.56 13.1c-1.32-1.32-3.58-.72-4.06 1.09l-.773 2.887l.108 2.344l-.88.542l-.79 2.951l.132 2.248l-.863.484l-.344 1.284c-.49 1.8 1.16 3.45 2.96 2.97"></path><path fill="#3f5fff" d="M7.8 25.053c-1.48-1.383-2.74-3.047-3.854-5.058l.778-2.904c1.278 2.798 2.716 4.889 4.441 6.5c1.663 1.553 3.633 2.697 6.07 3.583l-3.128.837c-1.602-.797-3.027-1.764-4.306-2.958m-3.514 2.833a11.865 11.865 0 0 1-1.855-2.234l.745-2.783c.703 1.49 1.49 2.634 2.476 3.557c.984.92 2.208 1.659 3.838 2.285l-2.989.8a11.86 11.86 0 0 1-2.215-1.625"></path><path fill="#6d4534" d="M19.11 25.69c1.4-1.4-.34-5.4-3.88-8.94c-3.54-3.54-7.53-5.28-8.93-3.88c-1.4 1.4.34 5.4 3.88 8.94c3.54 3.54 7.54 5.27 8.93 3.88"></path><path fill="#f70a8d" d="M11.61 7.27a9.726 9.726 0 0 1 .72 7.49a9.7 9.7 0 0 1-3.81 5.2c-.52-.65-.97-1.3-1.35-1.93a7.398 7.398 0 0 0 2.91-3.96c.59-1.91.4-3.93-.54-5.69c-.31-.58-.09-1.29.48-1.59c.58-.31 1.29-.09 1.59.48m10.54 9.443a6.646 6.646 0 0 1 6.454-1.01a1.048 1.048 0 0 0 .732-1.965a8.743 8.743 0 0 0-8.486 1.33a1.048 1.048 0 1 0 1.3 1.645M6.01 9.69a1.16 1.16 0 1 0 0-2.32a1.16 1.16 0 0 0 0 2.32m20.12-1.16a1.16 1.16 0 1 1-2.32 0a1.16 1.16 0 0 1 2.32 0"></path><path fill="#f9c23c" d="M12.49 3.96a.96.96 0 1 1-1.92 0a.96.96 0 0 1 1.92 0m12.99 20.45a.97.97 0 1 1-1.94 0a.97.97 0 0 1 1.94 0"></path><path fill="#00a6ed" d="M21.63 4.02a.945.945 0 0 0-.58-.24a.99.99 0 0 0-1.04.92c-.07 1.1-.83 3.09-1.12 3.76c0 .005-.003.01-.005.015a7.284 7.284 0 0 1-.177.405a2.815 2.815 0 0 0-1.358-.92l-.03-.01c-1.35-.45-2.82.28-3.27 1.64c-.22.66-.17 1.36.14 1.98c.31.62.84 1.08 1.5 1.3c.07.024.143.039.214.045c.506.137.995.142 1.465.015a6.394 6.394 0 0 1-.099.41c-.14.52.17 1.06.69 1.2a.981.981 0 0 0 1.2-.69a8.174 8.174 0 0 0 .293-2.482c.52-.652.936-1.37 1.247-2.148l.015-.036c.185-.448 1.158-2.802 1.255-4.374c.01-.31-.12-.6-.34-.79m-4.88 5.79c.275.092.558.246.678.876c-.492.457-.808.407-1.088.314a.99.99 0 0 0-.102-.028a.606.606 0 0 1-.288-.292a.576.576 0 0 1-.03-.48c.11-.33.47-.51.8-.4zm1.52 8.35c3.41-.95 6.98-.52 10.06 1.22c.57.33.77 1.04.46 1.6c-.32.57-1.04.77-1.61.45a10.851 10.851 0 0 0-8.27-1c-2.31.64-4.29 2-5.72 3.88c-.61-.42-1.24-.9-1.86-1.44c1.73-2.27 4.14-3.93 6.94-4.71m-1.646-1.175a1.15 1.15 0 1 1-2.3 0a1.15 1.15 0 0 1 2.3 0"></path></g></svg>

              უფასოა!</AlertDialogTitle>
            <AlertDialogDescription>
              დადე პირველი განცხადება სრულიად უფასოდ, საბანკო მონაცემების შეყვანის გარეშე.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>დახურვა</AlertDialogCancel>
            <AlertDialogAction onClick={handleDialogAction}>შექმენი განცხადება</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {windowWidth ? <>
        {
          windowWidth > 1280 ?
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel maxSize={55} defaultSize={45}>
                <Sidebar salaryFilter={filters.salary} remoteFilter={filters.isRemote} selectedJobDetails={selectedJobDetails} setSelectedJobDetails={setSelectedJobDetails} getNextPage={getNextPage} jobsCount={jobsCount!} filterJobs={filterJobs} clearFilters={clearFilters} filtersChanged={filtersChanged} sortBy={sortBy} setSortBy={setSortBy} titleFilter={filters.title} regionFilter={filters.region} industryFilter={filters.industry} handleFilterChange={handleFilterChange} jobsData={jobsData} locateJob={locateJob} locatedJob={locatedJob} />
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
              <Sidebar salaryFilter={filters.salary} remoteFilter={filters.isRemote} selectedJobDetails={setSelectedJobDetails} setSelectedJobDetails={setSelectedJobDetails} jobsCount={jobsCount!} getNextPage={getNextPage} filterJobs={filterJobs} clearFilters={clearFilters} filtersChanged={filtersChanged} sortBy={sortBy} setSortBy={setSortBy} titleFilter={filters.title} regionFilter={filters.region} industryFilter={filters.industry} handleFilterChange={handleFilterChange} jobsData={jobsData} locateJob={locateJob} locatedJob={locatedJob} />

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


