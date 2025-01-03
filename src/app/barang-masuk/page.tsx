"use client";

import LayoutAdmin from "@/components/layout/LayoutAdmin"
import ButtonSubmit from "@/components/ui/ButtonSubmit";
import InputField from "@/components/ui/InputField";
import Modals from "@/components/ui/Modals";
import SelectOption from "@/components/ui/SelectOption";
import RootState from "@/redux/store";
import { showConfirmDialog, showDialog, showToast } from "@/utils/alertUtils";
import { DataBarangMasukProps, DataBarangProps, DataJenisBarang, DataSatuanBarang } from "@/utils/interface/data";
import { Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaDatabase, FaEye, FaPen, FaPhotoVideo, FaTrash } from "react-icons/fa";
import { FaPhotoFilm } from "react-icons/fa6";
import { useSelector } from "react-redux";

const Page = () => {
    const [data, setData] = useState<DataBarangMasukProps[] | null>(null);
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
            field : "tanggal",
            headerName : "Tanggal",
            flex : 1,
            disableColumnMenu: true,
        },
        {
            field : "nama_barang",
            headerName : "Barang",
            flex : 1,
            disableColumnMenu: true
        },
        {
            field : "stock",
            headerName : "Jumlah Masuk",
            flex : 1,
            disableColumnMenu: true
        },
        {
            field : "satuan_barang",
            headerName : "Satuan Barang",
            flex : 1,
            disableColumnMenu: true
        },
        {
            field : "Aksi",
            headerName : "Aksi",
            flex : 1,
            renderCell: (params : GridRenderCellParams) => (
                <div className="flex gap-2 items-center h-full">
                    <button
                        onClick={() => handleDelete(params.id)}
                        className='h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 center-flex text-white'>
                        <FaTrash />
                    </button>
                </div>
            ),
        }

    ];

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/barang-masuk`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setData(data.data? data.data : null);

            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [token]);

    const filteredData = (data?.filter((item: DataBarangMasukProps) =>
            item.nama_barang && item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
        ) || []).map((item, index) => ({
            ...item,
            no: index + 1,  
        }));

    const handleDelete = async (id : string | number | undefined) => {
        const isConfirm = await showConfirmDialog('Warning', 'Apakah Anda yakin ingin menghapus item ini?');
    
        if (isConfirm) {
            try {
                const response = await fetch(`/api/barang-masuk?id=${id}`, {
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
                <div className="flex items-center gap-5 text-white">
                    <div className="flex items-center gap-2 text-white text-2xl">
                        <FaDatabase />
                        <h1 className="text-lg font-medium">Master Data</h1>
                    </div>
                    <div className="h-10 w-[1px] bg-white"></div>
                    <p>Data Barang</p>
                </div>
                <div className="w-full h-[700px] bg-white rounded shadow-md flex flex-col p-10 gap-7">
                    <div className="flex items-center justify-between w-full h-max gap-3 md:flex-row flex-col-reverse">
                        <input 
                            type="text" 
                            className="h-10 border w-52 focus:outline-primary rounded indent-3 placeholder:font-light text-sm"
                            placeholder="cari nama..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Link href={'/barang-masuk/tambah'}>
                            <button
                                className="h-10 px-5 text-sm text-white bg-primary rounded-full hover:opacity-80"
                            >
                                Tambah Barang Masuk
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