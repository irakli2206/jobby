
import classNames from 'classnames';
import Image from 'next/image'
import React from 'react'
import { BsBriefcaseFill } from 'react-icons/bs';
import Map, { MapRef, Marker, ViewState } from 'react-map-gl';
import { getJobById, getProfile, getUser, incrementJobViews } from '../action';
import MapView from './map';
import { Button } from '@/components/ui/button';
import JobView from './view';

type Params = {
    job: string
}

type Props = {
    params: Params
}


const Job = async ({ params }: Props) => {
    const profile = await getProfile()
    const job = await getJobById(params.job)
    await incrementJobViews(job)

    return (
        <>
            <JobView profile={profile} job={job}  />
        </>
    )
}

export default Job