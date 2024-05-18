import { createClient } from '@/utils/supabase/server'
import React from 'react'
import { getResumes } from './actions'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import moment from 'moment'
import { FolderDown } from 'lucide-react'
import { Document } from 'react-pdf'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import ResumesView from './view'

type Props = {
    params: any
}

const Resumes = async ({ params }: Props) => {
    const jobId = params.job
    const resumes = await getResumes(jobId)
    // console.log('resumes', resumes)


    return (
        <>
            <ResumesView
                resumes={resumes}
                jobId={jobId}
            />

        </>
    )
}



export default Resumes