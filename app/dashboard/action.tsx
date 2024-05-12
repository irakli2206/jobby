'use server'

import { createClient } from "@/utils/supabase/server"


export const getJobsByUser = async(userId: string) => {
    const supabase = createClient()
    const {data, error} = await supabase.from('jobs').select().eq('profile_id', userId)


    return data
}