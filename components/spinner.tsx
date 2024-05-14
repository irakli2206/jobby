import classNames from 'classnames'
import { Loader } from 'lucide-react'
import React from 'react'

type Props = {
    size?: 'sm' | 'md' | 'lg'
}

const Spinner = ({ size = 'md' }: Props) => {
    return (
        <>
            <Loader className={classNames('h-12 w-12 animate-spin ', {
                'h-18 w-18': size === 'lg'
            })} />
        </>
    )
}

export default Spinner