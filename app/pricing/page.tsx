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

const formSchema = z.object({
  count: z.coerce.number().min(1, "აირჩიეთ 0-ზე დიდი რიცხვი"),
})

const Pricing = () => {
  const { user } = useGetUser()

  console.log(user)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      count: 1,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <div className='max-w-7xl py-12 px-2 mx-auto w-full '>
      <div className="h-full w-full flex flex-col gap-12 items-center">
        <div className="flex flex-col gap-8">
          <Badge variant="outline" className='w-fit mx-auto'>ფასი</Badge>
          <h1 className='text-3xl sm:text-4xl font-semibold text-center '>პირდაპირი და მარტივი გადახდა</h1>
        </div>

        <div className="flex px-2">
          <Card className='md:min-w-[400px]'>
            <CardHeader className='gap-4'>
              <Badge variant='outline' className='w-fit'>სტანდარტული</Badge>
              <div className="flex flex-row items-end gap-2">
                <h1 className='text-4xl font-semibold flex items-center'><TbCurrencyLari />44</h1>
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
                <p className='flex items-center gap-2'>
                  <CheckCircledIcon />
                  განცხადების ნახვების რაოდენობა
                </p>
              </div>
            </CardContent>
            <CardFooter className=''>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4 mt-4 w-full'>
                  <FormField

                    name="count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel  >რაოდენობა</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            defaultValue={1}
                            {...field}
                          />
                        </FormControl>
                        {/* <FormDescription /> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit' className='w-full ' asChild>
                    <Link href={user ? "" : 'signup?ask_auth=true'}>
                      ყიდვა
                    </Link>
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

export default Pricing