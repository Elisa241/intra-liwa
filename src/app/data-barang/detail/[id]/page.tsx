"use client";

import { IconsBoxClose, IconsBoxOpen, IconsImage } from '@/assets/icons';
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import RootState from '@/redux/store';
import { DataBarangProps } from '@/utils/interface/data';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaChevronRight, FaDatabase } from 'react-icons/fa'
import { useSelector } from 'react-redux';

const Page = () => {
    const params = useParams();
    const { id } = params;
    const [data, setData] = useState<DataBarangProps | null>(null);
    const token = useSelector((state : RootState) => state.auth.token);

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/barang?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
            const data = await response.json();
            
            setData(data.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [id]);


    return (
        <LayoutAdmin>
            <div className="flex flex-col gap-10 w-full h-max">
                <div className="flex items-center gap-5 text-white">
                    <div className="flex items-center gap-2 text-white text-2xl">
                        <FaDatabase />
                        <h1 className="text-lg font-medium">Master Data</h1>
                    </div>
                    <div className="h-10 w-[1px] bg-white"></div>
                    <p>Data Barang</p>
                    <FaChevronRight />
                    <p>Detail</p>
                </div>
                <div className="w-full h-max flex md:flex-row flex-col gap-5 ">
                    <div className='flex h-[500px] flex-1  bg-white rounded shadow-md flex-col'>
                        <div className="h-14 w-full border-b flex items-center px-5">
                            <h1>Detail Data Barang</h1>
                        </div>
                        <div className='p-7 flex flex-1 w-full'>
                            <div className='w-full h-full flex flex-col gap-3'>

                                <div className='flex items-center h-12 w-full  px-3 gap-3 text-sm'>
                                    <div className='h-full w-32 flex items-center'>
                                        <h4 className='font-semibold'>Nama Barang</h4>
                                    </div>
                                    <p>:</p>
                                    <p>
                                        {data?.nama}
                                    </p>
                                </div>
                                <div className='flex items-center h-12 w-full bg-gray-50 px-3 gap-3 text-sm'>
                                    <div className='h-full w-32 flex items-center'>
                                        <h4 className='font-semibold'>Stock Mininum</h4>
                                    </div>
                                    <p>:</p>
                                    <p>
                                        {data?.stok_minimum}
                                    </p>
                                </div>
                                <div className='flex items-center h-12 w-full px-3 gap-3 text-sm'>
                                    <div className='h-full w-32 flex items-center'>
                                        <h4 className='font-semibold'>Jenis Barang</h4>
                                    </div>
                                    <p>:</p>
                                    <p>
                                        {data?.jenis_barang}
                                    </p>
                                </div>
                                <div className='flex items-center h-12 w-full bg-gray-50 px-3 gap-3 text-sm'>
                                    <div className='h-full w-32 flex items-center'>
                                        <h4 className='font-semibold'>Satuan Barang</h4>
                                    </div>
                                    <p>:</p>
                                    <p>
                                        {data?.satuan_barang}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className='w-full md:w-[400px] h-[500px] bg-white rounded shadow center-flex'>
                        <Image 
                            src={data?.images || IconsImage}
                            alt={`image ${data?.nama}`}
                            height={100}
                            width={100}
                        />
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    )
}

export default Page
