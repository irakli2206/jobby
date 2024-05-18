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

    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', data.user?.id).single()


    if (profileError) return { error: profileError.message }

    return profile
}

export async function getFreeJobsLeft() {
    const supabase = createClient()
    const { count } = await supabase.from('jobs').select('*', { count: 'exact' })
    const initialFreeJobsCount = 100
    const freeJobsLeft = initialFreeJobsCount - (count ?? 0)

    return freeJobsLeft
}

export async function getProfileByID(id: string) {
    const supabase = createClient()

    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()

    if (error) throw Error("No profile found")

    return data
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
    const supabase = createClient()
    const { data, error } = await supabase.from('jobs').update({ 'views': ++job.views }).eq('id', job.id)

    if (error) return { error: error.message }

    return null
}

export async function updateProfile(profileId: string, updatedProfile: any) {
    const supabase = createClient()
    const { data, error } = await supabase.from('profiles').update(updatedProfile).eq('id', profileId)

    if (error) return { error: error.message }

    return null
}

export async function updateProfileAttribute(profileId: string, key: string, value: any) {
    const supabase = createClient()
    const { data, error } = await supabase.from('profiles').update({ [key]: value }).eq('id', profileId)

    if (error) return { error: error.message }

    revalidatePath('/')
    return null
}


export async function getFilteredJobs(titleFilter?: string, regionFilter?: string | undefined, industryFilter?: string | undefined, sort: "created_at" | "views" = 'created_at', currentPage: number = 0) {
    const supabase = createClient()
    let query = supabase.from('jobs').select('id, title, company_name, coordinates, company_logo, salary, views, created_at', { count: 'exact' })
    query.eq('hidden', false)
    if (titleFilter) query = query.ilike('title', `%${titleFilter}%`)
    if (regionFilter) query = query.eq('region', regionFilter)
    if (industryFilter) query = query.eq('industry', industryFilter)

    const { count } = await query
    //Pagination in the end to avoid missing certain items
    query.range(0, (currentPage + 1) * 49)
    const { data, error } = await query.order(sort, { ascending: false })
    if (error) return { data: null, error: error.message }

    return { data, count: count!, error: null }
}

export async function getMapJobs(ids: string[]) {
    const supabase = createClient()
    let { data, error } = await supabase.from('jobs').select('id, coordinates').in('id', ids)
    if (error) return { data: null, error: error.message }

    return { data, error: null }
}


//Doesn't work, can't pass File to server actions
export async function sendResume(jobId: string, resume: FormData) {
    const file = resume.get('file')
    const fileName = resume.get('fileName')
    console.log(fileName)
    const supabase = createClient()
    // const filePath = `/resumes/${jobId}/${fileName}-${crypto.randomUUID().slice(0, 8)}.pdf`
    const filePath = `/resumes/${jobId}/${crypto.randomUUID().slice(0, 4)}-${fileName}`
    const { data, error } = await supabase.storage.from('jobs').upload(filePath, resume, { contentType: 'application/pdf',  })

    if (error) {
        if (error.message === 'The resource already exists')
            console.log(error)
        return { data: null, error: 'უკვე გაგზავნილი გაქვს' }
    }

    return { data, error: null }
}
