'use client'

// import ChooseType from '@/components/sections/signup/ChooseType'
// import { AccountTypeT } from '@/types/general'
import { BriefcaseBusiness, Info, RefreshCw, UserRoundSearch } from 'lucide-react'
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
import { useSearchParams } from 'next/navigation'
import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "@/components/ui/alert"


const formSchema = z.object({
    firstName: z.string().min(1, "საჭირო ველი"),
    lastName: z.string().min(1, "საჭირო ველი"),
    email: z.string().min(1, "საჭირო ველი").email("ელ-ფოსტის არასწორი ფორმატი"),
    password: z.string().min(6, "უნდა იყოს 6 სიმბოლო ან მეტი")
})

export type SignupFormValues = z.infer<typeof formSchema>


const SignupView = () => {
    const params = useSearchParams()
    const isAskAuthVisible = params.get('ask_auth')


    const form = useForm<SignupFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        },
    })

    const isFormSubmitting = form.formState.isSubmitting

    const { toast } = useToast()



    const onSubmit = async (values: SignupFormValues) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        try {
            let data = await signup(values)
            console.log(data)
            if (data && data.error) throw Error(data.error)
        } catch (e: any) {
            toast({
                title: "შეცდომა",
                description: e.message,
                duration: 5000,
                variant: 'destructive'
            })
        }

    }

    return (
        <div className="w-full flex  min-h-full">
            <div className="flex items-center justify-center pb-12 flex-1">
                <div className="mx-auto grid md:w-[350px] px-2 sm:px-0 gap-6">
                    {isAskAuthVisible === 'true' &&
                        <Alert className='bg-blue-50 border-blue-200 '>
                            <Info className="h-4 w-4 !text-blue-500" />
                            <AlertTitle className='mt-1'>შექმენი ანგარიში</AlertTitle>
                            <AlertDescription className='mt-2'>
                                მოხარულები ვართ რომ გინდა განცხადებების ყიდვა, თუმცა ჯერ უნდა შექმნა ანგარიში
                            </AlertDescription>
                        </Alert>}


                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold ">შექმნა</h1>
                        <p className="text-balance text-muted-foreground">
                            შექმენი ახალი ანგარიში
                        </p>
                    </div>

                    < Form {...form} >
                        <form
                            action={form.handleSubmit(onSubmit) as any}
                            className="flex flex-col gap-2">
                            <div className="flex gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='!text-black ' >სახელი</FormLabel>
                                            <FormControl className='!mt-1'>
                                                <Input
                                                    placeholder='ირაკლი'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className='!mt-1' />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='!text-black ' >გვარი</FormLabel>
                                            <FormControl className='!mt-1'>
                                                <Input
                                                    placeholder='ბეგოიძე'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className='!mt-1' />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='!text-black ' >ელ-ფოსტა</FormLabel>
                                        <FormControl className='!mt-1'>
                                            <Input
                                                placeholder='johndoe@gmail.com'
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
                                    <FormItem >
                                        <FormLabel className='!text-black ' >პაროლი</FormLabel>
                                        <FormControl className='!mt-1'>
                                            <Input
                                                type='password'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='!mt-1' />
                                    </FormItem>
                                )}
                            />

                            <Button disabled={isFormSubmitting} type="submit" className="w-full mt-2" >
                                {isFormSubmitting && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                                შექმნა
                            </Button>
                        </form>
                    </Form>
                    {/* <Button variant="outline" onClick={() => googleSignin()} className="w-full -mt-2">
                            Sign in with Google
                        </Button> */}



                    <div className=" text-center text-sm">
                        უკვე გაქვს ანგარიში?{" "}
                        <Button variant='link' className='p-0 h-fit' asChild>
                            <Link href="/login" >
                                შესვლა
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex flex-col justify-center gap-16 flex-1 bg-gradient-to-b from-slate-100/80 via-slate-50 to-white overflow-hidden ">
                <div className="flex flex-col gap-4 min-w-[300px] w-3/4 mx-auto pt-16">
                    <p className='font-semibold text-xl italic'>ვახხხ ეს რა მაგარი საიტია ტო</p>
                    <a href='https://twinit.ge' target="_blank" className="text-gray-500 font-medium cursor-pointer hover:underline">Twinit</a>
                </div>

                <div className="relative w-full h-full  ">
                    <Image
                        src="/dashboard.png"
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

            {/* <div className="hidden lg:flex flex-col justify-center gap-16 flex-1 bg-gradient-to-b from-gray-100/80 to-white  overflow-hidden ">

                <div className="flex flex-col gap-4 min-w-[300px] w-3/4 mx-auto pt-16">
                    <p className='font-semibold text-xl'>Thanks to Devvyx, we've spared ourselves hours of sorting through numerous unqualified or below-par candidates.</p>
                    <p className="text-gray-500 font-medium ">- Sneed's Feed and Seed</p>
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


            </div> */}
        </div>
    )
}

export default SignupView