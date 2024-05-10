
// import ChooseType from '@/components/sections/signup/ChooseType'
// import { AccountTypeT } from '@/types/general'
import { BriefcaseBusiness, RefreshCw, UserRoundSearch } from 'lucide-react'
import React, { useEffect, useState } from 'react'
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
import { login } from './action'
import { getUser } from '@/app/action'
import { redirect, useRouter } from 'next/navigation'
import LoginView from './view'



const Login = async () => {
  const user = await getUser()

  if(user) redirect('dashboard')
 
  // const handleForgotPassword = async () => {
  //   const email = form.getValues().email as string
  //   if (!email) {
  //     return toast({
  //       title: "Enter your email first",
  //       description: 'To receive a password reset email, fill the above input field with your email.',
  //       duration: 5000,
  //       variant: 'default'
  //     })
  //   }
  //   try {
  //     await sendResetPassword(email)
  //     return toast({
  //       title: "An email has been sent",
  //       description: 'Please follow the password reset instructions in your email to update your password',
  //       duration: 5000,
  //       variant: 'default'
  //     })
  //   } catch (e: any) {
  //     return toast({
  //       title: "Error",
  //       description: e,
  //       duration: 5000,
  //       variant: 'destructive'
  //     })
  //   }

  // }

  return (
    <>
      <LoginView />
    </>

  )
}

export default Login