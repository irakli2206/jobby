import React from 'react'
import { getUser } from '../action'
import { redirect } from 'next/navigation';

const DashboardLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {


    const user = await getUser()
    if (!user) redirect('/login')


    return (
        <div className='w-full h-full'>
            {children}
        </div>
    )
}

export default DashboardLayout