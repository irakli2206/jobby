'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import { TbCurrencyLari } from "react-icons/tb";
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import useGetUser from '../hooks/useGetUser';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
    user: any
    freeJobsLeft: number
}




const PricingView = ({ user, freeJobsLeft }: Props) => {
    const isFree = freeJobsLeft > 0

    const formSchema = z.object({
        quantity: z.coerce.number().min(1, "აირჩიეთ 0-ზე დიდი რიცხვი"),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            quantity: 1,
        },
    })


    return (
        <div className='max-w-7xl py-12 px-2 mx-auto w-full '>
            <div className="h-full w-full flex flex-col gap-12 items-center">
                <div className="flex flex-col gap-4">
                    <Badge variant="outline" className='w-fit mx-auto'>ფასი</Badge>
                    <h1 className='text-3xl sm:text-4xl font-semibold text-center '>პირდაპირი და მარტივი გადახდა</h1>
                </div>

                <div className="flex px-2 gap-8">
                    {/* <Card className='md:min-w-[400px] flex flex-col'>

                        <CardHeader className='gap-4'>
                            <Badge variant='outline' className='w-fit'>უფასო</Badge>
                            <div className="flex flex-row items-end gap-2">
                                <h1 className='text-4xl font-semibold flex items-center'><TbCurrencyLari />48</h1>
                                <p className='text-muted-foreground text-sm'>/განცხადება</p>
                            </div>
                            <p className='text-sm font-medium'>ყველა ფუნქცია ერთ ფასში, მარტივად და საგაგებად.</p>
                        </CardHeader>
                        <CardContent>
                            <h1 className='font-semibold mb-3'>რა შედის</h1>
                            <div className="flex flex-col gap-3 text-sm ">
                                <p className='flex items-center gap-2'>
                                    <CheckCircledIcon />
                                    ზოგადი აღწერა
                                </p>
                                <p className='flex items-center gap-2'>
                                    <CheckCircledIcon />
                                    კომპანიის ლოგო
                                </p>
                                <p className='flex items-center gap-2'>
                                    <CheckCircledIcon />
                                    ზუსტი ადგილმდებარეობა
                                </p>

                            </div>
                        </CardContent>

                    </Card> */}

                    <Card className='md:min-w-[400px] border-primary '>
                        <div className="w-full p-2 flex justify-center text-sm bg-primary rounded-t-lg text-white mb-2">პირველი განცხადება უფასოა!</div>

                        <CardHeader className='gap-4'>
                            <Badge variant='outline' className='w-fit'>სტანდარტული</Badge>
                            <div className="flex flex-row items-end gap-2">
                                <h1 className='text-4xl font-semibold flex items-center'><TbCurrencyLari /> 48 </h1>
                                <p className='text-muted-foreground text-sm'>/განცხადება</p>
                            </div>
                            <p className='text-sm font-medium'>ყველა ფუნქცია ერთ ფასში, მარტივად და გასაგებად.</p>
                        </CardHeader>
                        <CardContent>
                            <h1 className='font-semibold mb-3'>რა შედის</h1>
                            <div className="flex flex-col gap-3 text-sm ">
                                <p className='flex items-center gap-2'>
                                    <CheckCircledIcon />
                                    1-თვიანი განცხადება
                                </p>
                                <p className='flex items-center gap-2'>
                                    <CheckCircledIcon />
                                    ზოგადი აღწერა
                                </p>
                                <p className='flex items-center gap-2'>
                                    <CheckCircledIcon />
                                    კომპანიის ლოგო
                                </p>
                                <p className='flex items-center gap-2'>
                                    <CheckCircledIcon />
                                    ზუსტი ადგილმდებარეობა
                                </p>
                                <p className='flex items-center gap-2'>
                                    <CheckCircledIcon />
                                    მონახულებების რაოდენობა
                                </p>
                                <p className='flex items-center gap-2'>
                                    <CheckCircledIcon />
                                    რეზიუმეების მართვა
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className=''>
                            <Form {...form}>
                                <form action={user ? 'api/payment/create-checkout-session' : '/signup?ask_auth=true'} method='POST' className='flex flex-col gap-4 mt-4 w-full'>
                                    <input type="hidden" name="lookup_key" value="jobby.ge_standard_price" />
                                    {user && <input type="hidden" name="user_id" value={user.id} />}
                                    <FormField

                                        name="quantity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel  >რაოდენობა</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                {/* <FormDescription /> */}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button id="checkout-and-portal-button" type='submit' className='w-full '  >
                                        ყიდვა
                                    </Button>
                                </form>
                            </Form>


                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div >
    )
}

export default PricingView