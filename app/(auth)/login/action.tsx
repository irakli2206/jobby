'use server'

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { LoginFormValues } from "./view"



export async function login({ email, password }: LoginFormValues) {
    const supabase = createClient()


    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })


    if (error) {
        if (error.message === 'Invalid login credentials') return { error: 'არასწორი მონაცემები' }
    }
    const { data: profile, error: profileError } = await supabase.from('profiles').select().eq('id', data.user.id).maybeSingle()

    if (profile.account_type === 'employer') {
        redirect('/developers')
    }

    revalidatePath('/', 'page')
    redirect('/dashboard')

}