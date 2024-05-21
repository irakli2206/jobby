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
import { FileDown, FolderDown, MoveLeft } from 'lucide-react'
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

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     'pdfjs-dist/build/pdf.worker.min.js',
//     import.meta.url,
// ).toString();


type Props = {
    resumes: any
    jobId: string
}

const ResumesView = ({ resumes, jobId }: Props) => {
    const supabase = createClient()

    resumes = resumes.filter(r => r.name !== '.emptyFolderPlaceholder')

    const [currentResumeUrl, setCurrentResumeUrl] = useState<string | undefined>()
    const [currentResume, setCurrentResume] = useState<any>()
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    // const handleSetCurrentResume = (id: string) => {
    //     let resume = resumes.find((resume: any) => resume.id === id)
    //     if (resume) {
    //         const { data } = supabase.storage.from('jobs').getPublicUrl(`resumes/${jobId}/${resume.name}`)
    //         console.log(data)
    //         setCurrentResume(data.publicUrl)
    //         setIsSheetOpen(true)
    //     }
    // }

    const downloadResume = async (id: string) => {
        let resume = resumes.find((resume: any) => resume.id === id)
        if (resume) {
            const { data } = await supabase.storage.from('jobs').download(`resumes/${jobId}/${resume.name}`)

            const url = window.URL.createObjectURL(data);

            // Create an anchor element and trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.download = resume.name; // Specify the file name

            // Append the anchor to the body (required for Firefox)
            document.body.appendChild(link);

            // Programmatically click the anchor to trigger the download
            link.click();

            // Remove the anchor from the document
            document.body.removeChild(link);

            // Revoke the object URL to free up memory
            window.URL.revokeObjectURL(url);
            console.log(data)

        }

    }

    const downloadAllResumes = async () => {
        const resumePromises: Promise<any>[] = []
        resumes.forEach(resume => {
            resumePromises.push(supabase.storage.from('jobs').download(`resumes/${jobId}/${resume.name}`))
        })

        const response = await Promise.allSettled(resumePromises)

        const downloadedFiles = response.map((result, index) => {
            if (result.status === "fulfilled") {
                return {
                    name: resumes[index].name,
                    blob: result.value.data,
                };
            }
        });

        const zip = new JSZip();
        const allResumes = zip.folder('resumes')

        downloadedFiles.forEach((downloadedFile) => {
            if (downloadedFile) {
                allResumes?.file(downloadedFile.name, downloadedFile.blob);
            }
        });

        zip.generateAsync({ type: "blob" }).then(function (content) {
            // see FileSaver.js
            saveAs(content, "resumes.zip");
        });
    }


    return (
        <>

            <div className="max-w-7xl py-12 mx-auto w-full px-2 md:px-4">
                <div className="flex justify-between">
                    <Link href='/dashboard' className='flex items-center gap-2 text-black underline'>
                        <MoveLeft size={20} /> დაბრუნება
                    </Link>
                    <Button className='mb-4 ' onClick={downloadAllResumes}><FolderDown className='mr-2' size={18} /> ყველას გადმოწერა</Button>
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
                                < Row key={resume.id} id={resume.id} name={resume.name} jobId={jobId} time={resume.created_at} downloadResume={downloadResume} />
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
    handleSetCurrentResume?: Function
    downloadResume: Function
}


const Row = ({ id, name, time, handleSetCurrentResume, downloadResume, jobId }: RowProps) => {
    const supabase = createClient()

    const formattedTime = moment(time).format('DD/MM/YYYY - HH:mm')


    return (
        <TableRow  >

            <TableCell className="font-medium">
                {name}
            </TableCell>
            <TableCell className="font-medium">
                {formattedTime}
            </TableCell>
            <TableCell>
                <div className="flex gap-4 justify-end">
                    {/* <Button size='sm' variant='outline' onClick={() => handleSetCurrentResume(id)}>ნახვა</Button> */}
                    <Button onClick={() => downloadResume(id)} size='sm'><FileDown size={16} className='mr-1.5' /> გადმოწერა</Button>
                </div>
            </TableCell>
        </TableRow>
    )
}

export default ResumesView

