'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"


export const getJobsByUser = async(userId: string) => {
    const supabase = createClient()
    const {data, error} = await supabase.from('jobs').select().eq('profile_id', userId)


    return data
}

export const changeJobVisibility = async(jobId: string, hidden: boolean) => {
    const supabase = createClient()
    const {data, error} = await supabase.from('jobs').update({'hidden': hidden}).eq('id', jobId)

    revalidatePath('/dashboard')
    return data
}