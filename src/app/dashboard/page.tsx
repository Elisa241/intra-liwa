'use client';

import { IconsBoxClose, IconsBoxes, IconsBoxOpen } from "@/assets/icons";
import LayoutAdmin from "@/components/layout/LayoutAdmin";
import RootState from "@/redux/store";
import { DataBarangMasukProps, DataBarangProps, DataDashboardStats } from "@/utils/interface/data";
import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FaBox, FaFile, FaHome, FaInfo } from "react-icons/fa";
import { useSelector } from "react-redux";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { showDialog } from "@/utils/alertUtils";
import Modals from "@/components/ui/Modals";
import InputField from "@/components/ui/InputField";

const Page = () => {
    const [data, setData] = useState<DataDashboardStats | null>(null);
    const [barangMinimum, setBarangMinimum] = useState<DataBarangProps[] | null>(null);
    const token = useSelector((state: RootState) => state.auth.token);

    const [modalIsActive, setModalIsActive] = useState<boolean>(false);

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(`/api/dashboard-stats`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch dashboard stats");

            const result = await response.json();
            setData(result.data || null);
        } catch (error) {
            console.log("Error fetching dashboard stats:", error);
        }
    }, [token]);

    const fetchDatBarang = useCallback(async () => {
        try {
            const response = await fetch(`/api/barang`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
        
            if (!response.ok) throw new Error("Failed to fetch barang data");
        
            const result = await response.json();
        
            const updatedData = result.data.map((item: DataBarangProps, index: number) => ({
                ...item,
                no: index + 1,
                totalStock: Array.isArray(item.barangMasuk)
                ? item.barangMasuk.reduce(
                    (acc: number, barang: DataBarangMasukProps) => acc + Number(barang.stock),
                    0
                    )
                : 0,
            }));
        
        
            setBarangMinimum(updatedData);
        } catch (error) {
            console.log("Error fetching barang data:", error);
        }
    }, [token]);

    

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchDatBarang();
    }, [fetchDatBarang]);

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

    const handleCloseModal = () => {
        setModalIsActive(false);
        setNamaPemohon('');
        setNamaBarang('');
        setJenisBarang('');
        setJumlahBarang('');
        setKeterangan('');
        setItems([])
    }

    const [namaPemohon, setNamaPemohon] = useState('');
    const [namaBarang, setNamaBarang] = useState('');
    const [jenisBarang, setJenisBarang] = useState('');
    const [jumlahBarang, setJumlahBarang] = useState('');
    const [keterangan, setKeterangan] = useState('');

    interface Item {
        namaBarang: string;
        jenisBarang: string;
        jumlahBarang: string;
        keterangan: string;
    }

    // State for storing the list of items
    const [items, setItems] = useState<Item[]>([]);

    const addItem = () => {
        if (!namaBarang || !jenisBarang  || !jumlahBarang) {
            showDialog('error', "error", "Form Tidak boleh kosong");
            return;
        }

        const newItem = {
            namaBarang: namaBarang,
            jenisBarang: jenisBarang,
            jumlahBarang: jumlahBarang,
            keterangan: keterangan,
        };
        // Add the new item to the state
        setItems([...items, newItem]);

        // Clear form fields after adding the ite
        setNamaBarang('');
        setJenisBarang('');
        setJumlahBarang('');
        setKeterangan('');
    };

    const handleLaporanRequest = () => {
        if (!namaPemohon) {
            showDialog('error', "error", "Nama Pemohon harus diisi");
            return;
        }

        setItems([])

        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text("Laporan Permintaan Barang", 105, 10, { align: "center" });

        doc.setFontSize(10);
        doc.text("Dibuat pada: " + new Date().toLocaleString(), 10, 30);

        const body = items.map((item, index) => [
            { content: index + 1 },  // Serial number
            { content: item.namaBarang },
            { content: item.jumlahBarang },
            { content: item.jenisBarang },
            { content: item.keterangan },
        ]);

        autoTable(doc, {
            columnStyles: { europe: { halign: 'center' } },
            theme: 'grid',
            head: [['No', 'Nama Barang', 'Jumlah Barang', 'Jenis Barang', 'Keterangan']],
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

        const pageHeight = doc.internal.pageSize.height; // Dapatkan tinggi halaman

        // Posisi untuk tanda tangan
        const signatureStartY = pageHeight - 40; // 40 unit dari bawah halaman

        doc.setFontSize(10);

        doc.text("Pemohon", 140, signatureStartY); // Posisi awal teks "Kepala Gudang"
        doc.text(namaPemohon, 140, signatureStartY + 20);
        doc.save('Laporan Permintaan Barang.pdf')
    }


    return (
        <>
            <LayoutAdmin>
                <div className="flex flex-col gap-10 w-full h-max">
                    <Breadcrumbs 
                        Icon={FaHome}
                        title="Dashboard"
                        link={[
                            {title : "Dashboard", link : "/"}
                        ]}
                    />

                    <div className="h-max w-full bg-white rounded shadow-md grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-5">
                        <div className="flex items-center gap-3 h-28">
                            <div className="h-full w-32 center-flex">
                            <Image src={IconsBoxes} alt="IconsBoxes" className="h-16 w-16" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <h4 className="font-medium">Data Barang</h4>
                                <h5>{data?.barang}</h5>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 h-28">
                            <div className="h-full w-32 center-flex">
                            <Image src={IconsBoxOpen} alt="IconsBoxOpen" className="h-16 w-16" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <h4 className="font-medium">Data Barang Masuk</h4>
                                <h5>{data?.barangMasuk}</h5>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 h-28">
                            <div className="h-full w-32 center-flex">
                            <Image src={IconsBoxClose} alt="IconsBoxClose" className="h-16 w-16" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <h4 className="font-medium">Data Barang Keluar</h4>
                                <h5>{data?.barangKeluar}</h5>
                            </div>
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        <div className="bg-white rounded shadow-md h-28 p-4 flex items-center gap-5">
                            <div className="h-full w-20 bg-blue-400 center-flex text-white text-3xl rounded">
                            <FaBox />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h4 className="font-medium">Data Jenis Barang</h4>
                                <p>{data?.jenis}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded shadow-md h-28 p-4 flex items-center gap-5">
                            <div className="h-full w-20 bg-red-400 center-flex text-white text-3xl rounded">
                            <FaBox />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h4 className="font-medium">Data Satuan</h4>
                                <p>{data?.satuan}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded shadow-md h-28 p-4 flex items-center gap-5">
                            <div className="h-full w-20 bg-yellow-400 center-flex text-white text-3xl rounded">
                            <FaBox />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h4 className="font-medium">Data User</h4>
                                <p>{data?.user}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full bg-white h-max rounded shadow-md">
                        <div className="h-14 flex items-center gap-3 border-b px-6">
                            <FaFile className="text-primary text-xl" />
                            <h4 className="text-sm">Laporan permintaan barang</h4>
                        </div>
                        <div className="h-[120px] w-full center-flex">
                            <button
                                onClick={() => setModalIsActive(true)}
                                className="h-10 px-6 bg-primary text-white rounded hover:opacity-90 text-sm"
                            >
                                Download
                            </button>
                        </div>
                    </div>

                    <div className="h-max w-full bg-white rounded shadow-md">
                        <div className="h-14 flex items-center gap-3 border-b px-6">
                            <FaInfo className="text-primary text-xl" />
                            <h1 className="text-sm">Stock barang </h1>
                        </div>
                        <div className="w-full h-[500px] p-6">
                            <Paper 
                                sx={{
                                    height: "100%",
                                    width: "100%",
                                    overflowY: "auto",
                                    boxShadow: "none", // Hilangkan shadow
                                }}
                            >
                                <DataGrid 
                                    rows={barangMinimum || []}
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

            <Modals
                classname=" h-max w-[90%] max-w-[700px] bg-white rounded px-6 py-7"
                isOpen={modalIsActive}
                onClose={handleCloseModal}
            >
                <div className='flex flex-col gap-5'>
                    <div className="grid grid-cols-2 gap-2">
                        <InputField 
                            value={namaBarang}
                            onChange={(e) => setNamaBarang(e.target.value)}
                            label="Nama Barang"
                            placeholder='Masukan Nama '
                            type="text"   
                            className='border rounded'                    
                        />
                        <InputField 
                            value={jenisBarang}
                            onChange={(e) => setJenisBarang(e.target.value)}
                            label="Jenis Barang"
                            placeholder='Masukan Nama '
                            type="text"   
                            className='border rounded'                    
                        />
                        <InputField 
                            value={jumlahBarang}
                            onChange={(e) => setJumlahBarang(e.target.value)}
                            label="Jumlah Barang"
                            placeholder='Masukan Nama '
                            type="text"   
                            className='border rounded'                    
                        />
                        <InputField 
                            value={keterangan}
                            onChange={(e) => setKeterangan(e.target.value)}
                            label="Keterangan"
                            placeholder='Masukan Nama '
                            type="text"   
                            className='border rounded'                    
                        />
                    </div>
                    <button
                        onClick={addItem}
                        className="h-10 px-3 bg-primary text-xs text-white rounded"
                    >
                        Tambah
                    </button>

                    <div className="h-[200px] w-full border rounded  gap-3 overflow-y-auto p-4 grid grid-cols-2 ">
                        {items.map((item, index) => (
                            <div key={index} className="h-20 w-full border rounded flex flex-col justify-center px-3 py-1">
                                <div className="flex items-center gap-2 text-[10px] font-medium">
                                    <p>Nama Barang :</p>
                                    <p>{item.namaBarang}</p>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-medium">
                                    <p>Jenis Barang :</p>
                                    <p>{item.jenisBarang}</p>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-medium">
                                    <p>Jumlah Barang :</p>
                                    <p>{item.jumlahBarang}</p>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-medium">
                                    <p>Keterangan :</p>
                                    <p>{item.keterangan}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <InputField 
                        value={namaPemohon}
                        onChange={(e) => setNamaPemohon(e.target.value)}
                        label="Nama Pemohon"
                        placeholder='Masukan Nama '
                        type="text"   
                        className='border rounded'                    
                    />
                
                    <button
                        onClick={handleLaporanRequest}
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
