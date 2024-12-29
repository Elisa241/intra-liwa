import React from 'react'
import Sidebar from '../ui/Sidebar'
import Navbar from '../ui/Navbar'
import { LayoutAdminProps } from '@/utils/interface/components'

const LayoutAdmin = ({
    children
} : LayoutAdminProps) => {
    return (
        <div className='flex min-h-screen w-full bg-gray-50'>
            <Sidebar />
            <div className="flex flex-1  ml-0 md:ml-[270px] flex-col relative">
                <Navbar />
                <div className="h-44 w-full bg-[#03387B] absolute top-16"></div>
                <div className='z-10 flex flex-1 py-10 px-8'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default LayoutAdmin