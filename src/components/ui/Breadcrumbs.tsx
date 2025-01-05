import { BreadcrumbsProps } from '@/utils/interface/components'
import Link from 'next/link'
import React from 'react'
import { FaChevronRight } from 'react-icons/fa'

const Breadcrumbs = ({
    Icon,
    title,
    link
} : BreadcrumbsProps) => {
    return (
        <div className='flex items-center gap-5 text-white'>
            <div className="flex items-center gap-2 text-white text-2xl">
                {Icon && 
                   <Icon  />
                }
                <h1 className="text-lg font-medium">{title}</h1>
            </div>
            <div className="h-10 w-[1px] bg-white"></div>
            {link?.map((items, index) => (
                <React.Fragment key={index}>
                    <Link href={items.link}>
                        <p className='hover:text-textColor'>{items.title}</p>
                    </Link>
                    {index < link.length - 1 && <FaChevronRight />}
                </React.Fragment>
            ))}
        </div>
    )
}

export default Breadcrumbs