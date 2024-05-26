import type { Metadata } from "next";
import { Inter, Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import localFont from 'next/font/local'
import 'mapbox-gl/dist/mapbox-gl.css';
import Loading from "./loading";
import { getUser } from "./action";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/react"


const inter = Inter({ subsets: ["latin"] });
const NotoSans = Noto_Sans_Georgian({ subsets: ['georgian'] })


export const metadata: Metadata = {
  title: "Jobby.ge - დასაქმდი და დაასაქმე",
  description: "საუკეთესო ქართული პორტალი სამსახურის ძიებისთვის",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser()

  return (
    <html lang="en">
      <body className={`${NotoSans.className} `}>
        {/* <Header /> */}
        <div className=" flex flex-col justify-center ">
          <Header user={user} />
          <section className='flex  min-h-[calc(100vh-64px)] '>
            {children}
          </section>
          <Footer />
        </div>

        {/* Providers */}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
