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
import { showDialog } from "@/utils/alertUtils";
import Modals from "@/components/ui/Modals";

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
    const [modalIsActive, setModalIsActive] = useState<boolean>(false);
    const [tujuanTtd, setTujuanTtd] = useState<string>('');
    const [namaAdmin, setNamaAdmin] = useState<string>('');

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
            field : "satuan_barang",
            headerName : "Satuan Barang",
            flex : 1,
            disableColumnMenu: true
        },
        {
            field : "stock",
            headerName : "Jumlah Keluar",
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

            const response = await fetch(`/api/barang-keluar?${queryParams.toString()}`, {
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
        if(!tujuanTtd || !namaAdmin  ) {
            showDialog("error", "Error", "Tujuan Tanda tangan harus di isi!")
            return;
        }

        const doc = new jsPDF();

        doc.setFontSize(14);
        doc.text("Laporan Barang Keluar", 105, 10, { align: "center" });

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

        const pageHeight = doc.internal.pageSize.height; // Dapatkan tinggi halaman

        // Posisi untuk tanda tangan
        const signatureStartY = pageHeight - 40; // 40 unit dari bawah halaman

        doc.setFontSize(10);
        
        // Tanda tangan admin (sebelah kiri)
        doc.text("Kepala Subbagian Umum", 20, signatureStartY);
        doc.text(namaAdmin, 20, signatureStartY + 20);
        doc.text("198905052010121001", 20, signatureStartY + 25); 

        let NamaTujuan = ''
        let NIPTujuan = ""

        if (tujuanTtd === "Kepala Seksi PDMS") {
            NamaTujuan = "Irmayanti"
            NIPTujuan = "197402131994022002"
        } else if (tujuanTtd === "Kepala Seksi Bank") {
            NamaTujuan = "Achmad Slamet Subchan"
            NIPTujuan = "198210152001121002"
        } else if (tujuanTtd === "Kepala Seksi Veraki") {
            NamaTujuan = "Benie Habrian Iskandar"
            NIPTujuan = "198310052010121004"
        } else if (tujuanTtd === "Kepala Subbagian Umum") {
            NamaTujuan = "Bangkit Wicaksono"
            NIPTujuan = "198905052010121001"
        } else {
            NamaTujuan = ""
            NIPTujuan = ""
        }

       // Tanda tangan Kepala Gudang (sebelah kanan)
        doc.text(tujuanTtd, 140, signatureStartY); // Posisi awal teks "Kepala Gudang"
        doc.text(NamaTujuan, 140, signatureStartY + 20); // Teks, 10 unit di bawah garis
        doc.text(NIPTujuan, 140, signatureStartY + 25); 

        doc.save('Laporan-Barang-Keluar.pdf');
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

        XLSX.writeFile(workbook, "Laporan Barang Keluar.xlsx");
    }
    
    const handleModalClose = () => {
        setModalIsActive(false);
        setNamaAdmin('');
    }

    return (
        <>
            <LayoutAdmin>
                <div className="flex flex-col gap-10 w-full h-max">
                    <Breadcrumbs 
                        Icon={FaFile}
                        title="Laporan Barang Keluar"
                        link={[
                            {title : "Laporan Barang Keluar", link : "/laporan-barang-keluar"}
                        ]}
                    />
                    <div className="h-max w-full bg-white shadow rounded flex flex-col">
                        <div className="h-12 w-full border-b flex items-center px-5">
                            <p>Filter Data Barang Keluar</p>
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
                                    onClick={() => setModalIsActive(true)}
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
                                <p className="text-sm">Laporan Barang Keluar </p>
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
            
            <Modals
                classname=" h-max w-[90%] max-w-[400px] bg-white rounded px-6 py-7"
                isOpen={modalIsActive}
                onClose={handleModalClose}
            >
                <div className='flex flex-col gap-5'>
                    <InputField 
                        value={namaAdmin}
                        onChange={(e) => setNamaAdmin(e.target.value)}
                        label="Nama Kepala Subbagian Umum"
                        placeholder='Masukan Nama '
                        type="text"   
                        className='border rounded'                    
                    />
                    <div className='flex flex-col gap-2'>
                        <span className='text-xs font-medium'>Tujuan Tanda Tangan</span>
                        <select
                            onChange={(e) => setTujuanTtd(e.target.value)}
                            className='text-xs h-10 border rounded indent-3'
                        >
                            <option value="">--Pilih Tujuan--</option>
                            <option value="Kepala Seksi PDMS">Kepala Seksi PDMS</option>
                            <option value="Kepala Seksi Bank">Kepala Seksi Bank</option>
                            <option value="KaSi VeraKi">Kepala Seksi Veraki</option>
                            <option value="Kepala Subbagian Umum">Kepala Subbagian Umum</option>
                        </select>
                    </div>
                    <button
                        onClick={handlePrintPdf}
                        className='w-full h-10 bg-primary border text-white rounded text-sm'
                    >
                        Cetak
                    </button>
                </div>
            </Modals>    
        </>
    )
}

export default Page