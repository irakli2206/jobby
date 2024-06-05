import { Badge } from '@/components/ui/badge'
import { Dot } from 'lucide-react';
import moment from 'moment-with-locales-es6';
import React from 'react'
import { PortableText, PortableTextComponent, PortableTextComponents } from 'next-sanity';

const Blogpost = async ({ params }: any) => {

  const endpoint =
    `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2022-03-25/data/query/production?query=*[slug.current == "${params.blog}"]{
      publishedAt,
      body,
      categories,
      title,
      slug,
      categories[]->{title},
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 )
  }`
  const data = await (await fetch(endpoint)).json()


  if (!data.result.length) return <>No results</>

  const { title, categories, publishedAt, body, estimatedReadingTime } = data.result[0]

  const formattedPublishedAt = moment(publishedAt).locale('ka').format('D MMM, YYYY')

  const portableTextComponents: PortableTextComponents = {
    block: {
      h2: ({ children }) => <h1 className="text-xl md:text-2xl font-medium">{children}</h1>,
      p: ({ children }) => <p className="md:text-lg">{children}</p>,
    },
    marks: {
      link: ({ value, children }) => {
        return (
          <a target='_blank' href={value?.href} className="md:text-lg text-blue-600 underline">{children}</a>
        )
      }
    }
  }


  return (
    <div className='min-h-screen w-full flex justify-center items-start py-12 pb-24 relative'>
      <main className="max-w-7xl w-full container flex flex-col relative z-10 mx-auto gap-4">
        <p className='text-blue-600 font-medium'>{formattedPublishedAt}</p>
        <div className="flex gap-0 items-center ">
          <div className="flex gap-2 ">
            {categories.map((category: any) => {
              return <Badge variant={'outline'} className='rounded-full text-sm' >{category.title}</Badge>
            })}
          </div>
          <Dot className='text-muted-foreground' />
          <p className=' font-medium text-blue-600'>{`${estimatedReadingTime} წუთის წასაკითხი`}</p>
        </div>
        <h1 className='text-3xl lg:text-4xl font-semibold'>{title}</h1>

        <div className="flex flex-col mt-4">
          <PortableText
            value={body}
            components={portableTextComponents}
          />
        </div>
      </main>


    </div>
  )
}

export default Blogpost