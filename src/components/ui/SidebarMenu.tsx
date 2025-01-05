"use client";

import { SidebarMenuProps } from '@/utils/interface/components'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
import { FaChevronDown, FaChevronUp, FaCircle } from 'react-icons/fa';

const SidebarMenu = ({
    title, 
    link, 
    Icon,
    type,
    menu
} : SidebarMenuProps) => {
    const pathname = usePathname();
    const [isActive, setIsActive] = useState<boolean>(false);

    return (
        <>
            {type === 'button' ? (
                <Link
                    href={link || ''}
                    className={` ${pathname === link ? 'bg-primary text-white'  : 'bg-transparent text-[#8D9498]'}
                        w-full h-12 bg-primary rounded px-3 flex items-center gap-3 cursor-pointer hover:bg-primary hover:text-white
                    `}
                >
                    <div className="h-10 w-10 center-flex text-2xl">
                        {Icon && <Icon />}
                    </div>
                    <p className='text-xs'>{title}</p>
                </Link>
            ) : (
                <div className='flex flex-col gap-2'>
                    <p className="text-xs text-textColor font-normal">{title}</p>
                    {menu && menu.map((item, index) => (
                        <div key={index} >
                            {item.type === 'button' ? (
                                <Link
                                    href={item.link || ''}
                                    className={` ${pathname === item.link ? 'bg-primary text-white'  : 'bg-transparent text-textColor'}
                                        w-full h-12 bg-primary rounded px-3 flex items-center gap-3 cursor-pointer hover:bg-primary hover:text-white
                                    `}
                                >
                                    <div className="h-10 w-10 center-flex text-2xl">
                                        {item.Icon && <item.Icon />}
                                    </div>
                                    <p className='text-xs'>{item.title}</p>
                                </Link>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <div 
                                        onClick={() => setIsActive(!isActive)}
                                        className='w-full h-12 bg-transparent rounded px-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-primary hover:text-white text-textColor'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <div className="h-10 w-10 center-flex text-2xl">
                                                {item.Icon && <item.Icon />}
                                            </div>
                                            <p className='text-xs'>{item.title}</p>
                                        </div>
                                        {isActive ? <FaChevronUp className='text-xs' /> : <FaChevronDown className='text-xs' />}
                                    </div>
                                    {isActive && (
                                        <div className='flex flex-col gap-1'>
                                            {item?.submenu && item?.submenu.map((item, index) => (
                                                <Link
                                                    href={item.link || ''}
                                                    key={index} 
                                                    className={`h-10 w-full bg-black rounded flex items-center px-3 text-xs hover:bg-primary gap-3 hover:text-white
                                                        ${pathname === item.link ? 'bg-primary text-white' : 'bg-transparent text-textColor'}    
                                                    `}
                                                >
                                                    <div className='h-10 w-10 center-flex'>
                                                        <FaCircle className='text-[5px]' />
                                                    </div>
                                                    {item.title}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default SidebarMenu