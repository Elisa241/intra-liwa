"use client";

import { IconsUser } from "@/assets/icons";
import LayoutAdmin from "@/components/layout/LayoutAdmin"
import ButtonSubmit from "@/components/ui/ButtonSubmit";
import InputField from "@/components/ui/InputField";
import Modals from "@/components/ui/Modals";
import SelectOption from "@/components/ui/SelectOption";
import { DataRole } from "@/data/role";
import RootState from "@/redux/store";
import { showConfirmDialog, showDialog, showToast } from "@/utils/alertUtils";
import { DataUserProps } from "@/utils/interface/data";
import {  Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FaDatabase, FaPen, FaTrash, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const Page = () => {
    const [data, setData] = useState<DataUserProps[] | null>(null);
    const token = useSelector((state : RootState) => state.auth.token);
    const [searchTerm, setSearchTerm] = useState<string>("");

    // State add data
    const [isLoadingAdd, setIsLoadingAdd] = useState<boolean>(false);
    const [modalAdd, setModalAdd] = useState<boolean>(false);
    const [addData, setAddData] = useState({
        nama: "",
        username: "",
        password : "",
        role: "",
        image : null as File | null,
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          const file = e.target.files[0];
          setAddData({...addData, image: file });
        } 
    };

    const handleFileUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          const file = e.target.files[0];
          setUpdateData({...updateData, imageUpdate: file });
        } 
    };


    // state update data
    const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false);
    const [modalUpdate, setModalUpdate] = useState<boolean>(false);
    const [updateData, setUpdateData] = useState({
        id : "",
        nama: "",
        username: "",
        password : "",
        role: "",
        image : "",
        imageUpdate : null as File | null,
    })  

    const filteredData = (data?.filter((item: DataUserProps) =>
        item.nama && item.nama.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []).map((item, index) => ({
        ...item,
        no: index + 1,  // Menambahkan nomor berurutan mulai dari 1
    }));

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
            field : "username",
            headerName : "Username",
            flex : 1,
            disableColumnMenu: true
        },
        {
            field : "role",
            headerName : "Hak Akses",
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

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(`/api/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setData(data.data ? data.data : null);
        } catch (error) {
            console.log(error); // Menambahkan logging untuk error
        }
    }, [token]); // Token sebagai dependensi

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCloseModalAdd = () => {
        setModalAdd(false);
        setAddData({
            nama: "",
            username: "",
            password: "",
            role: "",
            image: null as File | null,
        });
    }

    const handleCloseModalUpdate = () => {
        setModalUpdate(false);
        setUpdateData({
            id : "",
            nama: "",
            username: "",
            password: "",
            role: "",
            image : "",
            imageUpdate : null as File | null,
        });
    }

    const handleModalsUpdate = async (id : string | number | undefined) => {
        setModalUpdate(true);

        try {
            const response = await fetch(`/api/user?id=${id}`, {
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
                username: data.data.username,
                password: '',
                role: data.data.role,
                image : data.data.image,
                imageUpdate : null
            })
        } catch (error) {
            console.log(error);
            showDialog('error', "Internal Server", "Internal Server Error");
        }
    }

    const handleUpdateData = async () => {
        try {
            setIsLoadingUpdate(true);

            const DataUpdate = new FormData();

            DataUpdate.append('id', updateData.id);
            DataUpdate.append('nama', updateData.nama);
            DataUpdate.append('username', updateData.username);
            DataUpdate.append('password', updateData.password);
            DataUpdate.append('role', updateData.role);
            DataUpdate.append('image', updateData.image);

            if (updateData.imageUpdate) {
                DataUpdate.append('imageUpdate', updateData.imageUpdate);
            }

            const response = await fetch(`/api/user`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: DataUpdate,
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

    const handleAddData = async () => {
        if (
            !addData.nama.trim() || 
            !addData.username.trim() || 
            !addData.password.trim() || 
            !addData.role.trim()
        ) {
            showDialog('warning', "warning", "Semua kolom harus di isi!");
            return;
        }

        try {
            const DataAdd = new FormData;

            DataAdd.append('username', addData.username);
            DataAdd.append('password', addData.password);
            DataAdd.append('role', addData.role);
            DataAdd.append('nama', addData.nama);

            if (addData.image) {
                DataAdd.append('image', addData.image);
            }
            
            const response = await fetch(`/api/user`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: DataAdd
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

    const handleDelete = async (id : string | number | undefined) => {
        const isConfirm = await showConfirmDialog('Warning', 'Apakah Anda yakin ingin menghapus item ini?');
    
        if (isConfirm) {
            try {
                const response = await fetch(`/api/user?id=${id}`, {
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
                        {title : "Data User", link : "/data-user"}
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
                        <button
                            onClick={() => setModalAdd(true)}
                            className="h-10 px-5 text-sm text-white bg-primary rounded-full hover:opacity-80"
                        >
                            Tambah User
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
                classname="min-h-[400px] h-max w-[90%] max-w-[450px] bg-white rounded px-6 py-7"
            >
                <div className="flex flex-col gap-7 w-full h-max">
                    <h1>Tambah User</h1>
                    <div className="flex flex-col w-full h-max gap-3 mb-5">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium">Image Profile</span>
                            <div className="h-24 w-full flex items-center gap-4 border rounded px-5" >
                                {addData.image ? (
                                    <div className="h-20 w-20 rounded-full center-flex" >
                                        <Image 
                                            src={URL.createObjectURL(addData.image)}
                                            alt="Image add data"
                                            width={100}
                                            height={100}
                                        />
                                    </div>
                                ) : (
                                    <div className="h-20 w-20 rounded-full shadow center-flex bg-primary text-white">
                                        <FaUser className="text-3xl" />
                                    </div>
                                )}
                                <div className="h-12 flex-1 flex items-center">
                                    <input 
                                        type="file" 
                                        className="w-full text-sm indent-3"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <InputField 
                            label="Nama"
                            type="text"
                            value={addData.nama}
                            onChange={(e) => setAddData({...addData, nama : e.target.value})}
                            placeholder="Masukan nama.."
                            className="border rounded"
                        />
                        <InputField 
                            label="Username"
                            type="text"
                            value={addData.username}
                            onChange={(e) => setAddData({...addData, username : e.target.value})}
                            placeholder="Masukan username.."
                            className="border rounded"
                        />
                        <InputField 
                            label="Password"
                            type="password"
                            value={addData.password}
                            onChange={(e) => setAddData({...addData, password : e.target.value})}
                            placeholder="Masukan password.."
                            className="border rounded"
                        />
                        <SelectOption 
                            label="Pilih Role"
                            className="h-12 w-full border rounded text-sm indent-3"
                            value={addData.role}
                            onChange={(e) => setAddData({...addData, role : e.target.value})}
                            data={DataRole}
                            title="Hak Akses"
                        />
                        
                    </div>
                    <ButtonSubmit 
                        title="Save"
                        onClick={handleAddData}
                        isLoading={isLoadingAdd}
                    />
                </div>
            </Modals>

            <Modals 
                isOpen={modalUpdate}
                onClose={handleCloseModalUpdate}
                classname="min-h-[400px] h-max w-[90%] max-w-[450px] bg-white rounded px-6 py-7"
            >
                <div className="flex flex-col gap-7 w-full h-max">
                    <h1>Update User</h1>
                    <div className="flex flex-col w-full h-max gap-3 mb-5">
                         <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium">Image Profile</span>
                            <div className="h-24 w-full flex items-center gap-4 border rounded px-5" >
                                {updateData.imageUpdate ? (
                                    <div className="h-20 w-20 rounded-full center-flex" >
                                        <Image 
                                            src={URL.createObjectURL(updateData.imageUpdate)}
                                            alt="Image add data"
                                            width={100}
                                            height={100}
                                            className="rounded-full h-20 w-20"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-20 w-20 rounded-full center-flex" >
                                        <Image 
                                            src={updateData.image ? `http://localhost:3000/uploads/${updateData.image}` : IconsUser}
                                            alt="Image add data"
                                            width={100}
                                            height={100}
                                            className="rounded-full h-20 w-20"
                                        />
                                    </div>
                                )}
                                <div className="h-12 flex-1 flex items-center">
                                    <input 
                                        type="file" 
                                        className="w-full text-sm indent-3"
                                        onChange={handleFileUpdate}
                                    />
                                </div>
                            </div>
                        </div>
                        <InputField 
                            label="Nama"
                            type="text"
                            value={updateData.nama}
                            onChange={(e) => setUpdateData({...updateData, nama : e.target.value})}
                            placeholder="Masukan nama.."
                            className="border rounded"
                        />
                        <InputField 
                            label="Username"
                            type="text"
                            value={updateData.username}
                            onChange={(e) => setUpdateData({...updateData, username : e.target.value})}
                            placeholder="Masukan username.."
                            className="border rounded"
                        />
                        <InputField 
                            label="Password Baru"
                            type="password"
                            value={updateData.password}
                            onChange={(e) => setUpdateData({...updateData, password : e.target.value})}
                            placeholder="Masukan password.."
                            className="border rounded"
                        />
                        <SelectOption 
                            label="Pilih Role"
                            className="h-12 w-full border rounded text-sm indent-3"
                            value={updateData.role}
                            onChange={(e) => setUpdateData({...updateData, role : e.target.value})}
                            data={DataRole}
                            title="Hak Akses"
                        />
                        <span className="text-[10px] text-red-500">*kosongkan kolom password jika tidak diubah</span>
                    </div>
                    <ButtonSubmit 
                        title="Save"
                        isLoading={isLoadingUpdate}
                        onClick={handleUpdateData}
                    />
                </div>
            </Modals>

        </LayoutAdmin>
    )
}

export default Page