import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { Separator } from './ui/separator'



const Footer = () => {
    return (
        <footer className='w-full border-t '>
            <div className='max-w-7xl container  border-zinc-200 py-16 '>
                <div className="flex flex-col gap-6">
                    <p className='text-sm font-bold'>Jobby.ge</p>
                    <ul className='flex flex-col gap-3'>
                        <li>
                            <Button asChild variant='link' className='p-0  h-fit text-gray-900'>
                                <Link href='/developers'>ძებნა</Link>
                            </Button>
                        </li>
                        <li>
                            <Button asChild variant='link' className='p-0  h-fit text-gray-900'>
                                <Link href='/pricing'>ჩვენ შესახებ</Link>
                            </Button>
                        </li>
                        <li>
                            <Button asChild variant='link' className='p-0  h-fit text-gray-900'>
                                <Link href='/faq'>კითხვები</Link>
                            </Button>
                        </li>
                    </ul>
                </div>

            </div>
            <Separator />
            <div className="py-4 max-w-7xl container  border-zinc-200 flex flex-col sm:flex-row gap-2 justify-between">
                <p className='font-light  text-zinc-500 text-sm text-center sm:text-start'>© 2024 ყველა უფლება დაცულია</p>

                <div className='flex items-center gap-1 text-sm mx-auto sm:mr-0'>
                    <p>კეთილი სურვილებით,</p>
                    <Button asChild variant='link' className='p-0 h-fit font-bold '>
                        <Link target='_blank' href='https://gravette.dev'>Gravette</Link>
                    </Button>
                </div>
            </div>

        </footer>
    )
}

export default Footer