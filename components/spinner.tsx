import { Loader } from 'lucide-react'
import React from 'react'

const Spinner = () => {
    return (
        <>
            <Loader className='h-12 w-12 animate-spin ' />
        </>
    )
}

export default Spinner