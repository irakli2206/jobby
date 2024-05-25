import React from 'react'
import { getUser } from '../action'
import { redirect } from 'next/navigation';

const DashboardLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    return (
        <div className='w-full h-full'>
            {children}
        </div>
    )
}

export default DashboardLayout