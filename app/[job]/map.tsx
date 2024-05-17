'use client'

import React from 'react'
import Map, { MapRef, Marker, ViewState } from 'react-map-gl';
import { BsBriefcaseFill } from 'react-icons/bs';


const MapView = ({ job }: any) => {
    return (
        <>
            {job.coordinates && <Map

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

                    <div className={`w-7 h-7 cursor-pointer flex items-center justify-center bg-black text-white rounded-full `}>
                        <BsBriefcaseFill size={16} />
                    </div>
                </Marker>
            </Map>}
        </>

    )
}

export default MapView