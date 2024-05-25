'use client'

import { createClient } from '@/utils/supabase/client'
import React, { useEffect, useState } from 'react'
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
import { BookOpen, FileDown, FolderDown, MoveLeft, Trash } from 'lucide-react'
import { Document, Page } from 'react-pdf'
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
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import Link from 'next/link'
import JSZip from 'jszip'
import { saveAs } from 'file-saver';
import { useToast } from '@/components/ui/use-toast'

import { deleteResume, downloadAllResumes, downloadResume } from './util'
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     'pdfjs-dist/build/pdf.worker.min.js',
//     import.meta.url,
// ).toString();


type Props = {
    resumes: any
    jobId: string
}

const ResumesView = ({ resumes: resumesData, jobId }: Props) => {
    const supabase = createClient()


    const [resumes, setResumes] = useState(resumesData.filter((r: any) => r.name !== '.emptyFolderPlaceholder'))
    console.log(resumes)
    const [currentResume, setCurrentResume] = useState<any>()

    const { toast } = useToast()

    const handleShowResume = (name: string) => {
        const { data } = supabase.storage.from('jobs').getPublicUrl(`resumes/${jobId}/${name}`)
        console.log(data)
        setCurrentResume(data.publicUrl)
    }


    const handleDeleteResume = async (name: string) => {
        try {
            await deleteResume(name, jobId)
            setResumes((prevState: any) => prevState.filter(r => r.name !== name))
            toast({
                title: 'წარმატება',
                description: 'რეზიუმე წარმატებით წაიშალა',
                variant: 'default'
            })
        } catch (e) {
            toast({
                title: 'შეცდომა',
                description: 'წაშლა ვერ მოხერხდა',
                variant: 'destructive'
            })
        }
    }

    const handleDownloadResume = async (name: string) => {
        await downloadResume(name, jobId)
    }




    return (
        <>
            <Sheet open={currentResume} onOpenChange={(e) => setCurrentResume(null)}>

                <SheetContent className='flex flex-col gap-4 min-w-[600px]'>
                    {/* <SheetHeader>
                        <SheetTitle>Edit profile</SheetTitle>
                        <SheetDescription>
                            Make changes to your profile here. Click save when you're done.
                        </SheetDescription>
                    </SheetHeader> */}
                    <iframe
                        src={currentResume}
                        className='h-full w-full overflow-hidden pt-8'
                        frameBorder="0"
                        title="PDF Viewer"
                    />
                    {/* <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit">Save changes</Button>
                        </SheetClose>
                    </SheetFooter> */}
                </SheetContent>
            </Sheet>


            <div className="max-w-7xl py-12 mx-auto w-full px-2 md:px-4">
                <div className="flex justify-between">
                    <Link href='/dashboard' className='flex items-center gap-2 text-black underline'>
                        <MoveLeft size={20} /> დაბრუნება
                    </Link>
                    <Button className='mb-4 ' onClick={() => downloadAllResumes(resumes, jobId)}><FolderDown className='mr-2' size={18} /> ყველას გადმოწერა</Button>
                </div>
                <Table className="">
                    <TableHeader>
                        <TableRow>

                            <TableHead>სახელწოდება</TableHead>
                            <TableHead>გამოგზავნის დრო</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {resumes && resumes.map((resume: any) => {
                            return (
                                < Row key={resume.id} id={resume.id} name={resume.name} jobId={jobId} time={resume.created_at} handleShowResume={handleShowResume} handleDeleteResume={handleDeleteResume} handleDownloadResume={handleDownloadResume} />
                            )
                        })}


                    </TableBody>
                </Table>
            </div>



        </>
    )
}


type RowProps = {
    id: string
    name: string
    time: string
    jobId: string
    handleShowResume: Function
    handleDeleteResume: Function
    handleDownloadResume: Function
}


const Row = ({ id, name, time, handleShowResume, handleDeleteResume, handleDownloadResume, jobId }: RowProps) => {
    const supabase = createClient()

    const formattedTime = moment(time).format('DD/MM/YYYY - HH:mm')


    return (
        <TableRow className='hover:bg-inherit'  >

            <TableCell className="font-medium">
                {name}
            </TableCell>
            <TableCell className="font-medium">
                {formattedTime}
            </TableCell>
            <TableCell>
                <div className="flex  justify-end">
                    <Button onClick={() => handleShowResume(name)} variant='ghost' size='icon'>
                        <BookOpen size={20} />
                    </Button>

                    <Button onClick={() => downloadResume(name, jobId)} variant='ghost' size='icon'>
                        <FileDown size={20} />
                    </Button>
                    <Button onClick={() => deleteResume(name, jobId)} variant='ghost' size='icon'>
                        <Trash size={20} />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}

export default ResumesView

