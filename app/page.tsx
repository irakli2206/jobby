
import Image from "next/image";
import Map, { MapRef, Marker, ViewState } from 'react-map-gl';
import Sidebar from "@/components/sidebar";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { BsBriefcaseFill } from "react-icons/bs";
import { getFilteredJobs, getMapJobs } from "./action";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import JobsView from "./view";
import { redirect } from "next/navigation";


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



export const Home = async() => {
  const {data: jobsData, error: jobsError} = await getFilteredJobs()
  const {data: mapData, error: mapError} = await getMapJobs()


  if(jobsError || mapError){
    redirect('/error')
  }
  
  return (
    <main className="flex h-[calc(100vh-64px)] w-full justify-between ">
      <JobsView initialJobData={jobsData as any[]} initialMapData={mapData as any[]} />
    </main>
  );
}

export default Home
