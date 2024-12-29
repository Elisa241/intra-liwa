"use client";

import LayoutAdmin from "@/components/layout/LayoutAdmin"
import { Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { useState } from "react";
import { FaEye, FaPen, FaTrash } from "react-icons/fa";

const Page = () => {
    const [data, setData] = useState([]);

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


    return (
        <LayoutAdmin>
            <div className="flex flex-col gap-10 w-full h-max">
                <div className="flex items-center gap-3 text-white">
                    <h1 className="text-xl">Data User</h1>
                </div>
                <div className="w-full h-[700px] bg-white rounded shadow-md flex flex-col p-10 gap-7">
                    <div className="flex items-center justify-between w-full h-max gap-3 md:flex-row flex-col-reverse">
                        <input 
                            type="text" 
                            className="h-10 border w-52 focus:outline-primary rounded indent-3 placeholder:font-light text-sm"
                            placeholder="cari nama..."
                        />
                        <button
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
        </LayoutAdmin>
    )
}

export default Page