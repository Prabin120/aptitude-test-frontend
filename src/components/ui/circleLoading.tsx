import React from 'react'

interface ILoading{
    color?: string
}

const CircleLoading: React.FC<ILoading> = ({color="bg-black"}) => {
    return (
        <div className='flex space-x-2 justify-center items-center bg-transparent dark:invert'>
            <div className={`h-3 w-3 ${color} rounded-full animate-bounce [animation-delay:-0.3s]`}></div>
            <div className={`h-3 w-3 ${color} rounded-full animate-bounce [animation-delay:-0.15s]`}></div>
            <div className={`h-3 w-3 ${color} rounded-full animate-bounce`}></div>
        </div>
    )
}

export default CircleLoading