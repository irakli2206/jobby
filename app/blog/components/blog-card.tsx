import { Badge } from '@/components/ui/badge'
import { Dot } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    slug: string
    title: string
    description: string
    readTime: string
    categories: any[]
    date: string
    imageUrl: string
}

const BlogCard = async ({ slug, title, description, readTime, categories, date, imageUrl }: Props) => {

    return (
        <Link href={slug} className='flex gap-2 hover:ring-1 hover:bg-muted/50 rounded-md ring-gray-200 transition  md:p-4'>
            <div className="flex flex-col">
                <p className="mb-2 text-sm font-medium text-blue-600">{date}</p>
                <h1 className='text-lg md:text-2xl mb-6 font-semibold'>{title}</h1>

                <p className='text-sm md:text-base text-muted-foreground'>{description}</p>


                <div className="flex gap-0 items-center mt-8">
                    <div className="flex gap-2 ">
                        {categories.map(category => {
                            return <Badge variant={'outline'} className='rounded-full' >{category.title}</Badge>
                        })}
                    </div>
                    <Dot className='text-muted-foreground' />
                    <p className='text-sm font-medium text-blue-600'>{readTime}</p>
                </div>
            </div>

            <div>
                <Image
                    alt=''
                    src={imageUrl}
                    width={400}
                    height={400}
                    className='h-full object-contain hidden md:block'
                />
            </div>
        </Link>
    )
}

export default BlogCard