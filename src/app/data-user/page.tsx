"use client";

import LayoutAdmin from "@/components/layout/LayoutAdmin"
import InputField from "@/components/ui/InputField";
import Modals from "@/components/ui/Modals";
import SelectOption from "@/components/ui/SelectOption";
import { DataRole } from "@/data/role";
import { Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { useState } from "react";
import { FaDatabase, FaEye, FaPen, FaTrash } from "react-icons/fa";

const Page = () => {
    const [data, setData] = useState([]);

    // State add data
    const [modalAdd, setModalAdd] = useState<boolean>(false);
    const [addData, setAddData] = useState({
        name: "",
        username: "",
        password : "",
        role: ""
    })

    // state update data
    const [modalUpdate, setModalUpdate] = useState<boolean>(false);
    const [updateData, setUpdateData] = useState({
        name: "",
        username: "",
        password : "",
        role: ""
    })

    const columns: GridColDef[] = [
        {
            field : "name",
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
                        className='h-8 w-8 rounded-full bg-purple-500 hover:bg-purple-600 center-flex text-white'
                    >
                        <FaEye />
                    </button>
                    <button 
                        className='h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 center-flex text-white'
                    >
                        <FaPen />
                    </button>
                    <button
                        className='h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 center-flex text-white'>
                        <FaTrash />
                    </button>
                </div>
            ),
        }

    ];

    const DataUser = [
        {
            id : 1,
            name : "rifkyhilman",
            username : "rifkyhilman",
            role : "Admin",
        },
        {
            id : 2,
            name : "tita agustiani",
            username : "Tita agustiani",
            role : "Admin",
        },
        
    ]

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAddData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleCloseModalUpdate = () => {
        setModalUpdate(false);
        setUpdateData({
            name: "",
            username: "",
            password: "",
            role: ""
        });
    }


    return (
        <LayoutAdmin>
            <div className="flex flex-col gap-10 w-full h-max">
                <div className="flex items-center gap-3 text-white">
                    <div className="flex items-center gap-2 text-xl">
                        <FaDatabase />
                        <p>Master Data</p>
                    </div>
                </div>
                <div className="w-full h-[700px] bg-white rounded shadow-md flex flex-col p-10 gap-7">
                    <div className="flex items-center justify-between w-full h-max gap-3 md:flex-row flex-col-reverse">
                        <input 
                            type="text" 
                            className="h-10 border w-52 focus:outline-primary rounded indent-3 placeholder:font-light text-sm"
                            placeholder="cari nama..."
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
                                rows={DataUser}
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
                onClose={handleCloseModalUpdate}
                classname="min-h-[400px] h-max w-[90%] max-w-[450px] bg-white rounded px-6 py-7"
            >
                <div className="flex flex-col gap-7 w-full h-max">
                    <h1>Tambah User</h1>
                    <div className="flex flex-col w-full h-max gap-3 mb-5">
                        <InputField 
                            label="Nama"
                            type="text"
                            value={addData.name}
                            onChange={(e) => setAddData({...addData, name : e.target.value})}
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
                            onChange={handleSelectChange}
                            data={DataRole}
                            title="Hak Akses"
                        />
                    </div>
                    <button
                        className="h-10 px-5 bg-primary hover:opacity-65 rounded text-white"
                    >
                        Save
                    </button>
                </div>
            </Modals>

            <Modals 
                isOpen={modalUpdate}
                onClose={() => setModalAdd(false)}
                classname="min-h-[400px] h-max w-[90%] max-w-[450px] bg-white rounded px-6 py-7"
            >
                <div className="flex flex-col gap-7 w-full h-max">
                    <h1>Tambah User</h1>
                    <div className="flex flex-col w-full h-max gap-3 mb-5">
                        <InputField 
                            label="Nama"
                            type="text"
                            value={addData.name}
                            onChange={(e) => setAddData({...addData, name : e.target.value})}
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
                            onChange={handleSelectChange}
                            data={DataRole}
                            title="Hak Akses"
                        />
                    </div>
                    <button
                        className="h-10 px-5 bg-primary hover:opacity-65 rounded text-white"
                    >
                        Save
                    </button>
                </div>
            </Modals>

        </LayoutAdmin>
    )
}

export default Page