'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"


export const getUser = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    return data.user
}

export async function getProfile() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()

    if (!data.user) return null

    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', data.user?.id).maybeSingle()


    if (profileError) return { error: profileError.message }

    return profile
}


export async function signout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    revalidatePath('/')
}


export async function clearCache(path: string, type: 'layout' | 'page' = 'page') {
    revalidatePath(path, type)
}

export async function getJobById(jobId: string) {
    const supabase = createClient()
    const { data, error } = await supabase.from('jobs').select().eq('id', jobId).single()

    if (error) return { error: error.message }

    return data
}

export async function incrementJobViews(job: Object) {
    console.log(job)
    const supabase = createClient()
    const { data, error } = await supabase.from('jobs').update({ 'views': ++job.views }).eq('id', job.id)

    if (error) return { error: error.message }

    return null
}


export async function getFilteredJobs(titleFilter?: string, regionFilter?: string | undefined, industryFilter?: string | undefined, sort: "created_at" | "views" = 'created_at') {
    const supabase = createClient()
    let query = supabase.from('jobs').select()
    if (titleFilter) query = query.ilike('title', `%${titleFilter}%`)
    if (regionFilter) query = query.eq('region', regionFilter)
    if (industryFilter) query = query.eq('industry', industryFilter)
    console.log('SORT', sort)
    const { data, error } = await query.order(sort, { ascending: false })
    if (error) return { data: null, error: error.message }

    return { data, error: null }
}