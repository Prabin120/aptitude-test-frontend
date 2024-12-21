import { Card } from '@/components/ui/card'
import React from 'react'

const NotFound = () => {
  return (
    <div className='dark h-[90vh] w-screen flex items-center justify-center'>
      <div className=" flex flex-col items-center justify-center p-4">
        <div className="relative w-full mb-8">
          {/* Hanging strings */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="w-[120px] h-[60px] border-t-2 border-l-2 border-r-2 border-black"></div>
          </div>

          <Card className="w-full bg-white border-2 border-black">
            {/* Window Controls */}
            <div className="h-6 border-b-2 border-black flex items-center px-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-black" />
                <div className="w-2 h-2 rounded-full bg-black" />
                <div className="w-2 h-2 rounded-full bg-black" />
              </div>
            </div>

            {/* 404 Content */}
            <div className="bg-black p-8 flex items-center justify-center">
              <span className="text-white text-6xl font-mono font-bold tracking-wider">404</span>
            </div>

            {/* Bottom white space */}
            <div className="h-4 bg-white"></div>
          </Card>
        </div>

        <h1 className="text-black font-medium mb-2 text-center">
          THE PAGE YOU WERE LOOKING FOR DOESN&apos;T EXIST.
        </h1>
        <p className="text-gray-600 text-sm text-center">
          YOU MAY HAVE MISTYPED THE ADDRESS OR THE PAGE MAY HAVE MOVED.
        </p>
      </div>
    </div>
  )
}

export default NotFound