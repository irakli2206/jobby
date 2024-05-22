
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import classNames from 'classnames';
import { randomUUID } from 'crypto';
import { Delete, DeleteIcon, Plus, RefreshCw, Trash } from 'lucide-react';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { BsBriefcaseFill } from 'react-icons/bs';
import Map, { LngLat, MapRef, Marker, ViewState } from 'react-map-gl';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { clearCache, getJobById, getUser } from '@/app/action';
import { createClient } from '@/utils/supabase/client';
import { redirect, useParams, useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import EditView from './view';

type Props = {
    params: any
}

const Edit = async ({params}: Props) => {

    const job = await getJobById(params.job as string)
    const formattedJob = {
        ...job,
        required_experiences: job.required_experiences ? job.required_experiences.map(r => ({ id: crypto.randomUUID(), text: r })) : [],
        responsibilities: job.responsibilities ? job.responsibilities.map(r => ({ id: crypto.randomUUID(), text: r })) : [],
    }

    if (!job) redirect('/dashboard')





    return (
        <>
            <EditView
                jobDataDTO={formattedJob}

            />
        </>
    )
}

export default Edit