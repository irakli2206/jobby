import type { Metadata } from "next";
import { Inter, Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import localFont from 'next/font/local'
import 'mapbox-gl/dist/mapbox-gl.css';


const inter = Inter({ subsets: ["latin"] });
const NotoSans = Noto_Sans_Georgian({ subsets: ['georgian'] })


export const metadata: Metadata = {
  title: "Jobby.ge",
  description: "საუკეთესო ქართული პორტალი სამსახურის საპოვნელად",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${NotoSans.className} `}>
        {/* <Header /> */}
        <div className=" flex flex-col justify-center ">
          <Header />
          <section className='flex h-[calc(100vh-64px)]'>
            {children}
          </section>
        </div>
      </body>
    </html>
  );
}
