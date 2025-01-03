"use client";

import LayoutAdmin from '@/components/layout/LayoutAdmin'
import ButtonSubmit from '@/components/ui/ButtonSubmit';
import InputField from '@/components/ui/InputField';
import Modals from '@/components/ui/Modals';
import RootState from '@/redux/store'
import { showConfirmDialog, showDialog, showToast } from '@/utils/alertUtils'
import { DataSatuanBarang } from '@/utils/interface/data'
import { Paper } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { FaDatabase, FaPen, FaTrash } from 'react-icons/fa'
import { useSelector } from 'react-redux'

const Page = () => {
    const [data, setData] = useState<DataSatuanBarang[] | null>(null);
    const token = useSelector((state : RootState) => state.auth.token);
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Modal add data
    const [isLoadingAdd, setIsLoadingAdd] = useState<boolean>(false);
    const [modalAdd, setModalAdd] = useState<boolean>(false);
    const [addData, setAddData] = useState({
        nama: "",
    })

    // state update data
    const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false);
    const [modalUpdate, setModalUpdate] = useState<boolean>(false);
    const [updateData, setUpdateData] = useState({
        id : "",
        nama: ""
    })  

    const handleCloseModalAdd = () => {
        setModalAdd(false);
        setAddData({
            nama: ""
        });
    }

    const handleCloseModalUpdate = () => {
        setModalUpdate(false);
        setUpdateData({
            id : "",
            nama: ""
        });
    }

    const columns: GridColDef[] = [
        {
            field: "no",
            headerName: "No",
            flex: 0.3, // Adjust flex as needed
        },
        {
            field : "nama",
            headerName : "Nama",
            flex : 1,
            disableColumnMenu: true,
        },
        {
            field : "Aksi",
            headerName : "Aksi",
            flex : 0.4,
            renderCell: (params : GridRenderCellParams) => (
                <div className="flex gap-2 items-center h-full">
                    <button 
                        onClick={() => handleModalsUpdate(params.id)}
                        className='h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 center-flex text-white'
                    >
                        <FaPen />
                    </button>
                    <button
                        onClick={() => handleDelete(params.id)}
                        className='h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 center-flex text-white'>
                        <FaTrash />
                    </button>
                </div>
            ),
        }
    ];

    const filteredData = (data?.filter((item: DataSatuanBarang) =>
        item.nama && item.nama.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []).map((item, index) => ({
        ...item,
        no: index + 1,  // Menambahkan nomor berurutan mulai dari 1
    }));

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/jenis-barang`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })

            const data = await response.json();
            setData(data.data ? data.data : null);
        } catch (error) {
            showDialog('error', "error", 'Internal server errror');
        }
    }

    useEffect(() => {
        fetchData();
    }, [token])

    const handleModalsUpdate = async (id : string | number | undefined) => {
        setModalUpdate(true);

        try {
            const response = await fetch(`/api/jenis-barang?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();

            setUpdateData({
                id : data.data.id,
                nama: data.data.nama,
            })
        } catch (error) {
            console.log(error);
            showDialog('error', "Internal Server", "Internal Server Error");
        }
    }

    const handleAddData = async () => {
        if (!addData.nama.trim()) {
            showDialog('error', "Gagal", "Nama Jenis Barang harus diisi");
            return;
        }

        try {
            const response = await fetch(`/api/jenis-barang`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(addData),
            })

            setIsLoadingAdd(true);

            if (response.status === 200) {
                showToast('success', "Berhasil Menambahkan Data");
                fetchData();
                handleCloseModalAdd();
            }
        } catch (error) {
            console.log(error);
            showDialog('error', "Internal Server", "Internal Server Error");
        } finally { 
            setModalAdd(false);
        }
    }

    const handleUpdateData = async () => {
        try {
            setIsLoadingUpdate(true);

            const response = await fetch(`/api/jenis-barang`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            })

            if (response.status === 200) {
                showToast('success', "Berhasil Update Data");
                fetchData();
                handleCloseModalUpdate();
            }
        } catch (error) {
            console.log(error)
            showDialog('error', "Internal Server", "Internal Server Error");
        } finally {
            setIsLoadingUpdate(false);
        }
    }

    const handleDelete = async (id : string | number | undefined) => {
        const isConfirm = await showConfirmDialog('Warning', 'Apakah Anda yakin ingin menghapus item ini?');
    
        if (isConfirm) {
            try {
                const response = await fetch(`/api/jenis-barang?id=${id}`, {
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
            <div className='flex flex-col gap-10 w-full h-max'>
                <div className="flex items-center gap-5 text-white">
                    <div className="flex items-center gap-2 text-white text-2xl">
                        <FaDatabase />
                        <h1 className="text-lg font-medium">Master Data</h1>
                    </div>
                    <div className="h-10 w-[1px] bg-white"></div>
                    <p>Data Jenis Barang</p>
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
                        <button
                            onClick={() => setModalAdd(true)}
                            className="h-10 px-5 text-sm text-white bg-primary rounded-full hover:opacity-80"
                        >
                            Tambah Jenis Barang
                        </button>
                    </div>
                    <div className="flex flex-1  w-full">
                        <Paper 
                            sx={{
                                height: "100%",
                                width: "100%",
                                overflowY: "auto",
                                boxShadow: "none", // Hilangkan shadow
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

            <Modals
                isOpen={modalAdd}
                onClose={handleCloseModalAdd}
                classname=" h-max w-[90%] max-w-[400px] bg-white rounded px-6 py-7"
            >
                <div className="flex flex-col gap-7 w-full h-max">
                    <h1>Tambah Jenis Barang</h1>
                    <InputField 
                        label="Nama"
                        type="text"
                        value={addData.nama}
                        onChange={(e) => setAddData({...addData, nama : e.target.value})}
                        placeholder="Masukan nama.."
                        className="border rounded"
                    />
                    <ButtonSubmit 
                        title='Save'
                        isLoading={isLoadingAdd}
                        onClick={handleAddData}
                    />
                </div>
            </Modals>

            <Modals
                isOpen={modalUpdate}
                onClose={handleCloseModalUpdate}
                classname=" h-max w-[90%] max-w-[400px] bg-white rounded px-6 py-7"
            >
                <div className="flex flex-col gap-7 w-full h-max">
                    <h1>Edit Jenis Barang</h1>
                    <InputField 
                        label="Nama"
                        type="text"
                        value={updateData.nama}
                        onChange={(e) => setUpdateData({...updateData, nama : e.target.value})}
                        placeholder="Masukan nama.."
                        className="border rounded"
                    />
                    <ButtonSubmit 
                        title='Save'
                        isLoading={isLoadingUpdate}
                        onClick={handleUpdateData}
                    />
                </div>
            </Modals>
        </LayoutAdmin>
    )
}

export default Page
