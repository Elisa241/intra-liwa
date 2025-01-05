"use client";

import React, { useEffect, useState } from 'react';
import Sidebar from '../ui/Sidebar';
import Navbar from '../ui/Navbar';
import { LayoutAdminProps } from '@/utils/interface/components';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { GifSpinner } from '@/assets/gif';

const LayoutAdmin = ({
    children
}: LayoutAdminProps) => {
    const router = useRouter();
    const { status } = useSession();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isActive, setIsActive] = useState<boolean>(true);

    useEffect(() => {
        if (status === 'loading') {
            setIsLoading(true);
        } else if (status === 'unauthenticated') {
            router.push('/sign-in');
        } else {
            setIsLoading(false);
        }
    }, [status, router]);

    return (
        <>
            {isLoading && (
                <div className="h-screen w-full center-flex bg-primary">
                    <Image 
                        src={GifSpinner}
                        alt='Gif Spinner'
                        className='h-20 w-20'
                    />
                </div>
            )}
            <div className="flex min-h-screen w-full bg-gray-50 relative">
                <Sidebar 
                    isActive={isActive}
                    setIsActive={setIsActive}
                />
                <div className={` ${isActive ? 'ml-0 md:ml-[270px]' : 'ml-0 md:ml-0'}
                    flex flex-1  flex-col relative`}>
                    <Navbar 
                        isActive={isActive}
                        setIsActive={setIsActive}
                    />
                    <div className="h-44 w-full bg-[#03387B] absolute top-16"></div>
                    <div className="z-10 flex flex-1 py-10 px-8">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LayoutAdmin;
