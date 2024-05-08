'use client'

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
import { login } from './action'

const formSchema = z.object({
  email: z.string().min(1, "Required field").email(),
  password: z.string().min(1, "Required field")
})

export type LoginFormValues = z.infer<typeof formSchema>

const Login = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })
  const isFormSubmitting = form.formState.isSubmitting

  const { toast } = useToast()



  const onSubmit = async (values: LoginFormValues) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      let data = await login(values)
      if (data && data.error) throw Error(data.error)
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message,
        duration: 5000,
        variant: 'destructive'
      })
    }

  }


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
    <div className="w-full flex  min-h-full">
      <div className="flex items-center justify-center pb-12 flex-1">
        <div className="mx-auto grid md:w-[350px] px-2 sm:px-0 gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold ">შესვლა</h1>
            <p className="text-balance text-muted-foreground">
              შეიყვანე შენი მონაცემები ანგარიშში შესასვლელად
            </p>
          </div>

          < Form {...form} >
            <form
              action={form.handleSubmit(onSubmit) as any}
              className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='!text-black ' >ელ-ფოსტა</FormLabel>
                    <FormControl className=''>
                      <Input
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='!mt-1' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className='mt-2'>
                    <div className="flex justify-between">
                      <FormLabel className='!text-black ' >პაროლი</FormLabel>
                      <Button type='reset'
                        // onClick={() => handleForgotPassword()}
                        variant='link' className='p-0 h-fit ml-auto text-sm '>
                        დაგავიწყდათ პაროლი?
                      </Button>
                    </div>
                    <FormControl className=''>
                      <Input
                        type='password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='!mt-1' />
                  </FormItem>
                )}
              />

              <Button disabled={isFormSubmitting} type="submit" className="w-full"  >
                {isFormSubmitting && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}

                შესვლა
              </Button>
            </form>
          </Form>
          {/* <Button variant="outline" onClick={() => googleSignin()} className="w-full -mt-2">
                            Sign in with Google
                        </Button> */}



          <div className=" text-center text-sm">
            არ გაქვს ანგარიში?{" "}
            <Button variant='link' className='p-0 h-fit' asChild>
              <Link href="/signup" >
                შექმნა
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex flex-col justify-center gap-16 flex-1 bg-gradient-to-b from-slate-100/80 via-slate-50 to-white overflow-hidden ">
        <div className="flex flex-col gap-4 min-w-[300px] w-3/4 mx-auto pt-16">
          <p className='font-semibold text-xl'>გვჯერა რომ ახლო მომავალში Jobby.ge გახდება პირველი ჯობ ბორდი საქართველოში</p>
          <a href='https://twinit.ge' target="_blank" className="text-gray-500 font-medium cursor-pointer hover:underline">Twinit</a>
        </div>

        <div className="relative w-full h-full  ">
          <Image
            src="/stripe-2.png"
            alt=""
            // sizes="(max-width: 1200px) 100vw, 80vw"
            height={500}
            width={1200}
            quality={100}
            priority
            className="absolute  rounded-xl right-0 top-0 drop-shadow-lg translate-x-[12%]"
          />

        </div>


      </div>

    </div>
  )
}

export default Login