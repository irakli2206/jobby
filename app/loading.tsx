import { Loader } from 'lucide-react'
import React from 'react'

const Loading = () => {
    return (
        <div className='h-full w-full flex items-center justify-center'>
            
                <Loader className='h-20 w-20 animate-spin mb-16' />
           
        </div>
    )
}

export default Loading