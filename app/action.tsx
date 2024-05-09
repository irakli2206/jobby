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


    if (profileError) throw Error("No profile found")

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
