import React from 'react'
import { SanityDocument, createClient } from 'next-sanity'
import { Badge } from '@/components/ui/badge'
import BlogCard from './components/blog-card'

const Blog = async () => {
    // const client = createClient({
    //     projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    //     dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    //     apiVersion: "2022-03-25",
    //     useCdn: false,
    //     perspective: "published",
    //     stega: {
    //         enabled: false,
    //         studioUrl: "/studio",
    //     },
    // });

    const endpoint = 
    `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2022-03-25/data/query/production?query=*[_type == "post"]{
        publishedAt,
        body,
        categories,
        title,
        slug,
        "imageUrl": mainImage.asset->url,
        categories[]->{title}
    }`
    const data = await (await fetch(endpoint)).json()

    console.log(data.result[0].body[0].children )
    const description = data.result[0].body[0].children[0].text.slice(0, 200)


    return (
        <div className='min-h-screen w-full flex justify-center items-start py-12 relative'>
            <main className="max-w-7xl w-full container flex flex-col relative z-10 mx-auto">
                <Badge variant='outline' className='w-fit mb-2'>ბლოგი</Badge>
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-semibold">სიახლეები და საინტერესო სტატიები</h1>

                <div className="grid grid-cols-1  my-16">
                    {data.result.map((blogpost: any) => {

                        return (
                            <BlogCard
                                slug={`/blog/${blogpost.slug.current}`}
                                title={blogpost.title}
                                categories={blogpost.categories}
                                description={description}
                                date={blogpost.publishedAt}
                                readTime={'7 წუთის წასაკითხი'}
                                imageUrl={blogpost.imageUrl}
                            />
                        )
                    })}
                </div>
                {/* <Accordion type="single" collapsible className="w-full mt-8">
                    {accordionData.map(({ question, answer }) => {

                        return (
                            <AccordionItem value={question}>
                                <AccordionTrigger className="text-lg text-start">{question}</AccordionTrigger>
                                <AccordionContent className="text-base whitespace-pre-line">
                                    {answer}
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}


                </Accordion> */}
            </main>
        </div>
    )
}

export default Blog