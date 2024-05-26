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
            question: "რით სჯობიხართ სხვა განცხადების დაფებს/ჯობ ბორდებს?",
            answer: `გამოყენების სიმარტივე, ფუნქციონალის სიმდიდრე, ფუნქციონალთან მიმართებით დაბალი ფასი, განცხადებათა უიერარქიო სისტემა, თანამედროვე დიზაინი... ყველაფრით ვჯობივართ.`
        },
        {
            question: "როგორ დავდო განცხადება?",
            answer: `შექმენი ანგარიში, მართვის პანელში დააჭირე "ზღვრის გაზრდის" ღილაკს ან საიტის ზემო ნაწილში დააჭირე "ფასს", აირჩიე საყიდელი განცხადებების რაოდენობა და დააჭირე ყიდვას. ყიდვის შემდეგ მაშინვე შეგეძლება მართვის პანელიდან განათავსო ახალი განცხადებები.`
        },
        {
            question: "როგორ გავუგზავნო დამსაქმებელს ჩემი რეზიუმე?",
            answer: "რეზიუმეს გაგზავნისთვის არაა საჭირო ანგარიშის შექმნა, უბრალოდ შედი განცხადების გვერდზე, ატვირთე შენი რეზიუმე (სასურველია PDF ფორმატი), და დააჭირე გაგზავნას."
        },
        {
            question: "პრემიუმ განცხადებები არ გაქვთ?",
            answer: `Jobby.ge-ზე ყველა განცხადება თანასწორია. პრემიუმ განცხადებები და ზოგადად განცხადებათა იერარქიულობა ართულებს მომხმარებლის, განსაკუთრებით სამსახურისმაძიებლის გამოცდილებას.`
        },
        {
            question: "როგორ წავშალო დადებული განცხადება?",
            answer: `დადებული განცხადება თავისით წაიშლება განცხადების შექმნიდან 1 თვის გასვლისთანავე. თუ გინდა რომ შეზღუდო შენი განცხადების ხილვადობა, გადადი განცხადებების მართვის პანელში, დააჭირე სამწერტილს მარჯვენა მხარეს და აირჩიე "დამალვა"`
        },

        // {
        //     question: "Can I cancel the subscription?",
        //     answer: `Ending your subscription is straightforward. Just navigate to the billing section in your dashboard, then select "Manage subscriptions" followed by "Cancel plan." Your subscription benefits will cease once the current period concludes. If you wish, you can also renew your subscription before it expires.`
        // },
        // {
        //     question: "Can I register as a non-ReactJS developer?",
        //     answer: `While technically possible, it's unlikely that employers will actively seek you out.`
        // },
        // {
        //     question: "Do I have to pass a test to register?",
        //     answer: `No, registering does not entail passing any tests initially. However, we intend to incorporate verification tests specifically for assessing your React proficiency. Successfully passing these tests will earn you a badge, showcasing your skills to potential employers.`
        // },
    ];

    return (
        <div className=' min-h-screen w-full flex justify-center items-start py-12 relative'>
            <main className="max-w-7xl w-full container flex flex-col relative z-10 mx-auto">
                <Badge variant='outline' className='w-fit mb-2'>ხშირად დასმული კითხვები</Badge>
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-semibold">ყველაფერი რაც უნდა იცოდე Jobby.ge-ზე</h1>

                <Accordion type="single" collapsible className="w-full mt-8">
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


                </Accordion>
            </main>

            {/* <div className="w-[400px] h-[400px] blur-3xl bg-blue-400 absolute rounded-full left-0 bottom-0 -translate-x-1/2 translate-y-1/2"></div> */}
        </div>
    )
}

export default FAQ