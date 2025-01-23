"use client";

import LayoutAdmin from "@/components/layout/LayoutAdmin"
import RootState from "@/redux/store";
import { showConfirmDialog, showToast } from "@/utils/alertUtils";
import { DataBarangProps } from "@/utils/interface/data";
import { Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaDatabase, FaEye, FaPen, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const Page = () => {
    const [data, setData] = useState<DataBarangProps[] | null>(null);
    const token = useSelector((state : RootState) => state.auth.token);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const columns: GridColDef[] = [
        {
            field : "no",
            headerName : "No",
            flex : 0.3,
            disableColumnMenu: true,
        },
        {
            field : "nama",
            headerName : "Nama",
            flex : 1,
            disableColumnMenu: true,
        },
        {
            field : "jenis",
            headerName : "Jenis Barang",
            flex : 1,
            disableColumnMenu: true
        },
        {
            field : "satuan",
            headerName : "Satuan Barang",
            flex : 1,
            disableColumnMenu: true
        },
        {
            field : "stok_minimum",
            headerName : "Stok Minimum",
            flex : 1,
            disableColumnMenu: true
        },
        {
            field : "Aksi",
            headerName : "Aksi",
            flex : 1,
            renderCell: (params : GridRenderCellParams) => (
                <div className="flex gap-2 items-center h-full">
                    <Link href={`/data-barang/detail/${params.id}`}>
                        <button 
                            className='h-8 w-8 rounded-full bg-purple-500 hover:bg-purple-600 center-flex text-white'
                        >
                            <FaEye />
                        </button>
                    </Link>
                    <Link href={`/data-barang/update/${params.id}`}>
                        <button 
                            className='h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 center-flex text-white'
                        >
                            <FaPen />
                        </button>
                    </Link>
                    <button
                        onClick={() => handleDelete(params.id)}
                        className='h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 center-flex text-white'>
                        <FaTrash />
                    </button>
                </div>
            ),
        }

    ];

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(`/api/barang`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setData(data.data ? data.data : null);
        } catch (error) {
            console.log(error);
        }
    }, [token]); // Menambahkan token sebagai dependensi

    useEffect(() => {
        fetchData();
    }, [fetchData]); 

    const filteredData = (data?.filter((item: DataBarangProps) =>
            item.nama && item.nama.toLowerCase().includes(searchTerm.toLowerCase())
        ) || []).map((item, index) => ({
            ...item,
            no: index + 1,  // Menambahkan nomor berurutan mulai dari 1
        }));

    const handleDelete = async (id : string | number | undefined) => {
        const isConfirm = await showConfirmDialog('Warning', 'Apakah Anda yakin ingin menghapus item ini?');
    
        if (isConfirm) {
            try {
                const response = await fetch(`/api/barang?id=${id}`, {
                    method : 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    showToast('success', "Berhasil menghapus data");
                    fetchData();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <LayoutAdmin>
            <div className="flex flex-col gap-10 w-full h-max">
                <Breadcrumbs 
                    Icon={FaDatabase}
                    title="Master Data"
                    link={[
                        {title : "Data Barang", link : "/data-barang"}
                    ]}
                />
                <div className="w-full h-[700px] bg-white rounded shadow-md flex flex-col p-10 gap-7">
                    <div className="flex items-center justify-between w-full h-max gap-3 md:flex-row flex-col-reverse">
                        <input 
                            type="text" 
                            className="h-10 border w-52 focus:outline-primary rounded indent-3 placeholder:font-light text-sm"
                            placeholder="cari nama..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Link href={'/data-barang/tambah'}>
                            <button
                                className="h-10 px-5 text-sm text-white bg-primary rounded-full hover:opacity-80"
                            >
                                Tambah Barang
                            </button>
                        </Link>
                    </div>
                    <div className="flex flex-1  w-full overflow-y-auto">
                        <Paper 
                            sx={{
                                height: "100%",
                                width: "100%",
                                overflowY: "auto",
                                boxShadow: "none", 
                            }}
                        >
                            <DataGrid 
                                rows={filteredData || []}
                                columns={columns}
                                getRowClassName={(params) =>
                                    params.indexRelativeToCurrentPage % 2 !== 0 ? "row-odd" : ""
                                  }
                                sx={{
                                    "& .row-odd": {
                                        backgroundColor: "#F9F9F9", // Warna abu-abu untuk baris ganjil
                                    "&:hover": {
                                    backgroundColor: "#F9F9F9", // Warna hover lebih terang
                                    },
                                },
                                }}
                            />
                        </Paper>
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    )
}

export default Page