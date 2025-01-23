"use client";

import LayoutAdmin from '@/components/layout/LayoutAdmin';
import SelectOption from '@/components/ui/SelectOption';
import RootState from '@/redux/store';
import { DataBarangMasukProps, DataBarangProps } from '@/utils/interface/data';
import { Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, {  useState } from 'react';
import { FaFile, FaFileAlt, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Modals from '@/components/ui/Modals';
import { showDialog } from '@/utils/alertUtils';
import InputField from '@/components/ui/InputField';

interface RowData {
    id? : string;
    nama : string;
    stok_minimum : number;
    jenis_id : string;
    satuan_id : string;
    images? : string;
    jenis? : string;
    satuan? : string;
    totalStock? : number | string;
    no? : string | number;
}

const Page = () => {
    const [data, setData] = useState<DataBarangProps[] | null>(null);
    const [dataMinimum, setDataMinimum] = useState<DataBarangProps[] | null>(null);
    const [filterValue, setFilterValue] = useState('');
    const [isDataFetched, setIsDataFetched] = useState(false); // Track whether data is fetched
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchTermMinimum, setSearchTermMinimum] = useState<string>("");

    const [modalIsActive, setModalIsActive] = useState<boolean>(false);
    const [tujuanTtd, setTujuanTtd] = useState<string>('');
    const [namaAdmin, setNamaAdmin] = useState<string>('');

    const token = useSelector((state: RootState) => state.auth.token);

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
            field : "totalStock",
            headerName : "Stok",
            flex : 1,
            disableColumnMenu: true
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
    ];

    const fetchData = async () => {
        try {
            const response = await fetch('/api/barang', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            const updatedData = data.data.map((item: DataBarangProps) => ({
                ...item,
                totalStock: Array.isArray(item.barangMasuk) // Pastikan `barangMasuk` adalah array
                    ? item.barangMasuk.reduce(
                        (acc: number, barang: DataBarangMasukProps) => acc + Number(barang.stock),
                        0
                    )
                    : 0, // Atur default jika `barangMasuk` tidak ada atau bukan array
                }));

            const lowStock = updatedData.filter((item : DataBarangProps) => Number(item.totalStock) <= Number(item.stok_minimum))
            setDataMinimum(lowStock);
            setData(updatedData);
            setIsDataFetched(true); // Set to true after data is fetched

        } catch (error) {
            console.log(error)
        }
    };

    const filteredData = (data?.filter((item: DataBarangProps) =>
            item.nama && item.nama.toLowerCase().includes(searchTerm.toLowerCase())
        ) || []).map((item, index) => ({
            ...item,
            no: index + 1,  // Menambahkan nomor berurutan mulai dari 1
        }));

    const filteredDataMinimum = (dataMinimum?.filter((item: DataBarangProps) =>
            item.nama && item.nama.toLowerCase().includes(searchTerm.toLowerCase())
        ) || []).map((item, index) => ({
            ...item,
            no: index + 1,  // Menambahkan nomor berurutan mulai dari 1
        }));

    const handleButtonClick = () => {
        setIsDataFetched(false); // Reset before fetching new data
        fetchData();
    };


    const handlePrintPdf = () => {
        if(!tujuanTtd || !namaAdmin  ) {
            showDialog("error", "Error", "Tujuan Tanda tangan harus di isi!")
            return;
        }

        const doc = new jsPDF();
        
        const title = filterValue === 'minimum' ? "Laporan Stok Minimum Barang" : "Laporan Stok Seluruh Barang";
        doc.setFontSize(14);
        doc.text(title, 105, 10, { align: "center" });

        doc.setFontSize(10);
        doc.text("Dibuat pada: " + new Date().toLocaleString(), 10, 30);

        const dataToExport = filterValue === 'minimum' ? filteredDataMinimum : filteredData;
        // Judul laporan
        const body = dataToExport.map((row: RowData) => [
            { content: row.no,  },
            { content: row.nama,  },
            { content: row.totalStock,  },
            { content: row.jenis,  },
            { content: row.satuan,  },
        ]);
    
        // Menambahkan tabel
        autoTable(doc, {
            columnStyles: { europe: { halign: 'center' } },
            theme: 'grid',
            head: [['No', 'Nama', 'Stok', 'Jenis Barang', 'Satuan Barang']],
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
            margin: { top: 40 },
        });

        // Tambahkan form tanda tangan
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

    
        // Menyimpan dan mendownload PDF
        doc.save(`${title.replace(/\s+/g, "_").toLowerCase()}.pdf`);
    };

    const handleExport = () => {
        const dataToExport = filterValue === 'minimum' ? filteredDataMinimum : filteredData;
        // Judul laporan
        const body = dataToExport.map((row: RowData) => ({
            No: row.no,
            Nama: row.nama,
            Stok: row.totalStock,
            'Jenis Barang': row.jenis,
            'Satuan Barang': row.satuan
        }));

        const worksheet = XLSX.utils.json_to_sheet(body);
        
        const workbook = XLSX.utils.book_new();
        const title = filterValue === 'minimum' ? "Laporan Stok Minimum Barang" : "Laporan Stok Seluruh Barang";
        XLSX.utils.book_append_sheet(workbook, worksheet, title);

        XLSX.writeFile(workbook, `${title.replace(/\s+/g, "_").toLowerCase()}.xlsx`);
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
                        title="Laporan Stock"
                        link={[
                            {title : "Laporan Stock", link : "/laporan-stock"}
                        ]}
                    />
                    <div className="h-max w-full bg-white shadow rounded flex flex-col">
                        <div className="h-12 w-full border-b flex items-center px-5">
                            <p>Filter Data Stock</p>
                        </div>
                        <div className="flex flex-1 w-full items-center justify-between md:flex-row flex-col px-5 gap-6 py-10">
                            <div className="flex items-center md:flex-row flex-col gap-3 w-full">
                                <SelectOption
                                    title="Stok"
                                    className="w-[200px] md:w-[300px] border h-12 rounded text-sm px-1"
                                    label="pilih"
                                    data={[
                                        {
                                            value: 'seluruh',
                                            label: 'Seluruh',
                                        },
                                        {
                                            value: 'minimum',
                                            label: 'Minimum',
                                        },
                                    ]}
                                    value={filterValue}
                                    onChange={(e) => setFilterValue(e.target.value)} // Update filterValue
                                />
                                <button
                                    onClick={handleButtonClick} // Fetch data when clicked
                                    className="px-8 h-12 bg-primary rounded-full mt-5 text-white text-sm"
                                >
                                    Tampilkan
                                </button>
                            </div>
                            {filterValue && isDataFetched && (
                                <div className="flex items-center gap-3">
                                    <div 
                                        onClick={() => setModalIsActive(true)}
                                        className="center-flex gap-3 px-7 rounded-full bg-blue-500 hover:bg-blue-600 h-12 text-white mt-5 cursor-pointer"
                                    >
                                        <FaFilePdf />
                                        <p>Cetak</p>
                                    </div>
                                    <div 
                                        onClick={handleExport} 
                                        className="center-flex gap-3 px-7 rounded-full bg-purple-500 hover:bg-purple-600 h-12 text-white mt-5 cursor-pointer"
                                    >
                                        <FaFileExcel />
                                        <p>Excel</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Only render the report sections when a filterValue is selected */}
                    {filterValue && isDataFetched && (
                        <>
                            {filterValue === 'seluruh' ? (
                                <div className="w-full h-max bg-white rounded shadow flex flex-col">
                                    <div className="h-14 w-full border-b flex items-center px-5 gap-4">
                                        <FaFileAlt className="text-lg text-primary" />
                                        <p className="text-sm">Laporan Stok Seluruh Barang</p>
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
                            ) : (
                                <div className="w-full h-max bg-white rounded shadow flex flex-col">
                                    <div className="h-14 w-full border-b flex items-center px-5 gap-4">
                                        <FaFileAlt className="text-lg text-primary" />
                                        <p className="text-sm">Laporan Stok Minimum Barang</p>
                                    </div>
                                    <div className="w-full h-max p-5 flex flex-col gap-5">
                                        <div className='h-max w-full flex items-center justify-end'>
                                            <input 
                                                type="text" 
                                                className="h-10 border w-52 focus:outline-primary rounded indent-3 placeholder:font-light text-sm"
                                                placeholder="cari nama..."
                                                value={searchTermMinimum}
                                                onChange={(e) => setSearchTermMinimum(e.target.value)}
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
                                                    rows={filteredDataMinimum || []}
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
                        </>
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
                            className='text-xs h-12 border rounded indent-3'
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
    );
};

export default Page;
