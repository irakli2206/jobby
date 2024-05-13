
import Image from "next/image";
import Map, { MapRef, Marker, ViewState } from 'react-map-gl';
import Sidebar from "@/components/sidebar";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { BsBriefcaseFill } from "react-icons/bs";
import { getFilteredJobs } from "./action";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import JobsView from "./view";


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
  

  return (
    <main className="flex h-[calc(100vh-64px)] w-full justify-between ">
      <JobsView  />
    </main>
  );
}

export default Home
