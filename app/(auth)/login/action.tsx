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

    if (!data.user?.user_metadata.email_verified) {
        return { error: 'შეამოწმეთ ელ-ფოსტა' }
    }
    const { data: profile, error: profileError } = await supabase.from('profiles').select().eq('id', data.user.id).maybeSingle()

    console.log(data)
    // revalidatePath('/', 'page')
    // redirect('/dashboard')

}