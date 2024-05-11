import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge';


const FAQ = () => {
    const accordionData = [
        {
            question: "რით ჯობიხართ jobs.ge-ის და მისთანებს?",
            answer: `პასუხი მარტივია - გამოყენების სიმარტივე. \n\n ჩვენთან ყველაფერი ხდება უფრო სწრაფად და მარტივად. დამსაქმებელი უფრო სწრაფად დებს განცხადებას და არ უწევს დამატებითი ღირებულებების გადახდა თუ მას სურს ლოგოს დამატება როგორც ეს ხდება jobs.ge-ზე. სამსახურისმაძიებლები კი რუკის წყალობით უფრო თვალსაჩინოდ ფილტრავენ მათთვის სასურველ განცხადებებს. გარდა ამისა Jobby.ge-ზე ყველა განცხადება თანასწორია. არანაირი პრემიუმ განცხადებები.`
        },
        {
            question: "როგორ შეედრება თქვენი ფასი სხვა პლატფორმების ფასებს?",
            answer: `Jobby.ge-ის ერთერთი დადებითი მხარე არის ერთიანი გადახდა ყველა ფუნქციისთვის. 44 ლარად თქვენ ქმნით სრულფასოვან განცხადებას. არანაირი დამატებითი გადახდები ახალი ფუნქციონალის გასახსნელად და 50 სახის პრემიუმ სტატუსი თქვენ არ დაგჭირდებათ, და არც მოგიწევთ ღელვა იმაზე რომ ვიღაცის პრემიუმ განცხადება დაჩრდილავს თქვენსას, ჩვენთან პრემიუმ განცხადებები არაა! \n
                მაშ ასე, 
                Jobby.ge - 44 ლარი. 
                jobs.ge - განცხადების და კომპანიის ლოგოს დასადება თქვენ გადაიხდით 55 ლარს.
                hr.ge - საკმაოდ მოქნილი არჩევნის მქონე საიტი. სტანდარტი ღირს 40 ლარი, თუმცა არცერთის ფუნქციონალში არ შედის განცხადების ნახვების დათვლა.
            `
        },
        {
            question: "როგორ გავუგზავნო დამსაქმებელს ჩემი რეზიუმე?",
            answer: "განცხადების ბოლოში არის დამსაქმებლის მიერ მოწოდებული მითითებები."
        },
        {
            question: "როგორ წავშალო დადებული განცხადება?",
            answer: `დადებული განცხადება თავისით წაიშლება 1 თვის გასვლის შემდეგ. თუ გინდათ რომ შეზღუდოთ თქვენი განცხადების ხილვადობა, გადადით განცხადებების მართვის პანელში, დააჭირეთ სამწერტილს მარჯვენა მხარეს და აირჩიეთ "დამალვა"`
        },
        {
            question: "Can I cancel the subscription?",
            answer: `Ending your subscription is straightforward. Just navigate to the billing section in your dashboard, then select "Manage subscriptions" followed by "Cancel plan." Your subscription benefits will cease once the current period concludes. If you wish, you can also renew your subscription before it expires.`
        },
        {
            question: "Can I register as a non-ReactJS developer?",
            answer: `While technically possible, it's unlikely that employers will actively seek you out.`
        },
        {
            question: "Do I have to pass a test to register?",
            answer: `No, registering does not entail passing any tests initially. However, we intend to incorporate verification tests specifically for assessing your React proficiency. Successfully passing these tests will earn you a badge, showcasing your skills to potential employers.`
        },
    ];

    return (
        <div className=' min-h-screen w-full flex justify-center items-start py-12 relative'>
            <main className="max-w-7xl container flex flex-col relative z-10 mx-auto">
                <Badge variant='outline' className='w-fit mb-2'>ხშირად დასმული კითხვები</Badge>
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-semibold">ყველაფერი რაც უნდა იცოდე Jobby.ge-ზე</h1>

                <Accordion type="single" collapsible className="w-full mt-8">
                    {accordionData.map(({ question, answer }) => {

                        return (
                            <AccordionItem value={question}>
                                <AccordionTrigger className="text-lg lg:text-xl text-start">{question}</AccordionTrigger>
                                <AccordionContent className="text-base whitespace-pre-line">
                                    {answer}
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}


                </Accordion>
            </main>

            {/* <div className="w-[400px] h-[400px] blur-3xl bg-blue-400 absolute rounded-full left-0 bottom-0 -translate-x-1/2 translate-y-1/2"></div> */}
        </div>
    )
}

export default FAQ