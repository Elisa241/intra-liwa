"use client";

import LayoutAdmin from "@/components/layout/LayoutAdmin";
import InputField from "@/components/ui/InputField";
import RootState from "@/redux/store";
import { DataBarangMasukProps } from "@/utils/interface/data";
import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { FaFile, FaFileAlt, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { useSelector } from "react-redux";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Breadcrumbs from "@/components/ui/Breadcrumbs";

interface RowData {
    id? : string;
    tanggal : string;
    stock : number | string;
    barang_id : string;
    nama_barang? : string;
    stok_minimum : number;
    images? : string;
    jenis_barang? : string;
    satuan_barang? : string;
    no? : string | number;
}

const Page = () => {
    const [tanggalAwal, setTanggalAwal] = useState<string>('')
    const [tanggalAkhir, setTanggalAkhir] = useState<string>('')
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
    ];
    

    const fetchData = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (tanggalAwal) queryParams.append("tanggalAwal", tanggalAwal);
            if (tanggalAkhir) queryParams.append("tanggalAkhir", tanggalAkhir);
            if (searchTerm) queryParams.append("search", searchTerm);

            const response = await fetch(`/api/barang-masuk?${queryParams.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (response.ok) {
                setData(result.data || []);
            } 

        } catch (error) {
            console.log(error);
        }
    }

    const filteredData = (data?.filter((item: DataBarangMasukProps) =>
                item.nama_barang && item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
            ) || []).map((item, index) => ({
                ...item,
                no: index + 1,  // Menambahkan nomor berurutan mulai dari 1
            }));

    const handleTampilkan = () => {
        fetchData();
    }


    const handlePrintPdf = () => {
        const doc = new jsPDF();

        doc.setFontSize(14);
        doc.text("Laporan Barang Masuk", 105, 10, { align: "center" });

        const title = `tanggal ${tanggalAwal} sd ${tanggalAkhir}`
        doc.setFontSize(9);
        doc.text(title, 10, 20);

        const body = filteredData.map((row: RowData) => [
            { content: row.no,  },
            { content: row.tanggal,  },
            { content: row.nama_barang,  },
            { content: row.stock,  },
            { content: row.satuan_barang,  },
        ]);

        autoTable(doc, {
            columnStyles: { europe: { halign: 'center' } },
            theme: 'grid',
            head: [['No', 'Tanggal', 'Nama Barang', 'Stock', 'Satuan Barang']],
            body: body,
            styles: {
                font: 'Helvetica',
                fontSize: 10,
                cellPadding: 2,
                overflow: 'linebreak',
            },
            headStyles: {
                fillColor: [22, 160, 133],
                textColor: [255, 255, 255],
                halign: 'center',
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
            margin: { top: 30 },
        });

        

        doc.save('Laporan-Barang-Masuk.pdf');
    }

    const handleExport = () => {
        const body = filteredData.map((row : RowData) => ({
            No: row.no,
            Tanggal: row.tanggal,
            'Nama Barang': row.nama_barang,
            Stock: row.stock,
            'Satuan Barang': row.satuan_barang
        }));

        const worksheet = XLSX.utils.json_to_sheet(body);
                
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Barang Masuk");

        XLSX.writeFile(workbook, "Laporan Barang Masuk.xlsx");
    }

    return (
        <LayoutAdmin>
            <div className="flex flex-col gap-10 w-full h-max">
                <Breadcrumbs 
                    Icon={FaFile}
                    title="Laporan Barang Masuk"
                    link={[
                        {title : "Laporan Barang Masuk", link : "/laporan-barang-masuk"}
                    ]}
                />
                <div className="h-max w-full bg-white shadow rounded flex flex-col">
                    <div className="h-12 w-full border-b flex items-center px-5">
                        <p>Filter Data Barang Masuk</p>
                    </div>
                    <div className="grid md:grid-cols-2 grid-cols-1 px-5 gap-6 py-10">
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                            <InputField 
                                label="Tanggal Awal"
                                value={tanggalAwal}
                                onChange={(e) => setTanggalAwal(e.target.value)}
                                type="date"
                                placeholder=""
                                className="border rounded"
                            />
                            <InputField 
                                label="Tanggal Akhir"
                                value={tanggalAkhir}
                                onChange={(e) => setTanggalAkhir(e.target.value)}
                                type="date"
                                placeholder=""
                                className="border rounded"
                            />
                        </div>
                        <div className="grid md:grid-cols-3 grid-cols-1 gap-5 mt-5">
                            <button 
                                onClick={handleTampilkan}
                                className="px-8 h-12 bg-primary rounded-full text-white text-sm"
                            >
                                Tampilkan
                            </button>

                            <div 
                                onClick={handlePrintPdf}
                                className="center-flex gap-3 px-7 rounded-full bg-blue-500 hover:bg-blue-600 h-12 text-white cursor-pointer"
                            >
                                <FaFilePdf />
                                <p>Cetak</p>
                            </div>
                            <div 
                                onClick={handleExport}
                                className="center-flex gap-3 px-7 rounded-full bg-purple-500 hover:bg-purple-600 h-12 text-white cursor-pointer"
                            >
                                <FaFileExcel />
                                <p>Excel</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {data && tanggalAwal && tanggalAkhir && (
                    <div className="w-full h-max bg-white rounded shadow flex flex-col">
                        <div className="h-14 w-full border-b flex items-center px-5 gap-4">
                            <FaFileAlt className="text-lg text-primary" />
                            <p className="text-sm">Laporan Barang Masuk </p>
                        </div>
                        <div className="w-full h-max p-5 flex flex-col gap-5">
                            <div className='h-max w-full flex items-center justify-end'>
                                <input 
                                    type="text" 
                                    className="h-10 border w-52 focus:outline-primary rounded indent-3 placeholder:font-light text-sm"
                                    placeholder="cari nama..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className='w-full flex h-[350px]'>
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
                )}
            </div>
        </LayoutAdmin>
    )
}

export default Page