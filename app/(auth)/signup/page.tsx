
// import ChooseType from '@/components/sections/signup/ChooseType'
// import { AccountTypeT } from '@/types/general'
import { BriefcaseBusiness, RefreshCw, UserRoundSearch } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { FaGoogle } from "react-icons/fa";
import Image from "next/image"
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'
// import { SigninSchema, SignupSchema } from '@/utils/schemas'
import { useFormState, useFormStatus } from 'react-dom'
// import { googleSignin, sendResetPassword, signin } from '../action'
import { useToast } from '@/components/ui/use-toast'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { ReloadIcon } from '@radix-ui/react-icons'
import { signup } from './action'
import SignupView from './view'
import { redirect } from 'next/navigation'
import { getUser } from '@/app/action'



const Signup = async () => {
    const user = await getUser()

    if (user) redirect('dashboard')


    return (
        <>
            <SignupView />
        </>
    )
}

export default Signup