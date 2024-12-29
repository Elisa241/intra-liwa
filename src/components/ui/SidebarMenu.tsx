"use client";

import { SidebarMenuProps } from '@/utils/interface/components'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

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
            {type === 'submenu' ? (
                <div className="flex flex-col gap-4 text-[#8D9498] ">
                    <div 
                        onClick={() => setIsActive(!isActive)}
                        className={`
                            w-full h-12 flex items-center justify-between px-3 rounded  cursor-pointer hover:bg-primary hover:text-white `}
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 center-flex text-xl">
                                {Icon && 
                                    <Icon  />
                                }
                            </div>
                            <p className='text-sm'>
                                {title}
                            </p>
                        </div>
                        {isActive ? (
                            <FaChevronUp
                                className="text-sm "
                            />
                        ) : (
                            <FaChevronDown 
                                className="text-sm "
                            />
                        )}
                    </div>

                    <div className={`${isActive ? 'flex' : 'hidden'}
                    
                        flex-col gap-1 text-sm`}
                    >
                        {menu?.map((item, index) => (
                            <Link
                                href={item.link || '/'} 
                                key={index} 
                                className={`
                                    ${pathname === item.link ? 'bg-gray-100' : 'bg-transparent'} rounded-lg
                                    h-10 w-full px-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100`}
                            >
                                <div className="h-10 w-10 ">
                                </div>
                                <p>{item.title}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            ) : (
                <Link
                    href={link || ''}
                    className={` ${pathname === link ? 'bg-primary text-white'  : 'bg-transparent text-[#8D9498]'}
                        w-full h-12 bg-primary rounded px-3 flex items-center gap-3 cursor-pointer hover:bg-primary hover:text-white
                    `}
                >
                    <div className="h-10 w-10 center-flex text-2xl">
                        {Icon && 
                            <Icon  />
                        }
                    </div>
                    <p className='text-sm'>{title}</p>
                </Link>
            )}
        </>
    )
}

export default SidebarMenu