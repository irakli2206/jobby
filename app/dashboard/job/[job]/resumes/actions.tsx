'use server'

import { createClient } from "@/utils/supabase/server"


export const getResumes = async (jobId: string) => {

    const supabase = createClient()


    const {data, error} = await supabase.storage.from('jobs').list(`resumes/${jobId}`)
    

    return data
}

export const downloadResume = async(resumePath: string) => {
    
}