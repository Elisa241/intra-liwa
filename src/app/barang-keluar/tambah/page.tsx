"use client";

import LayoutAdmin from "@/components/layout/LayoutAdmin";
import ButtonSubmit from "@/components/ui/ButtonSubmit";
import InputField from "@/components/ui/InputField";
import RootState from "@/redux/store";
import { showDialog, showToast } from "@/utils/alertUtils";
import { DataBarangMasukProps } from "@/utils/interface/data";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { useSelector } from "react-redux";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const Page = () => {
    const [tanggalValue, setTanggalValue] = useState<string>('');
    const [stockValue, setStockValue] = useState<string>('');
    const [barangIdValue, setBarangIdValue] = useState<string>('');
    const [barangMasukIdValue, setBarangMasukIdValue] = useState<string>('');
    const [isLoadingAdd, setIsLoadingAdd] = useState<boolean>(false);

    const [BarangMasukValue, setBarangMasukValue] = useState<DataBarangMasukProps[] | null>(null);

    const token = useSelector((state : RootState) => state.auth.token);

    // state stock
    const [stockBarang, setStockBarang] = useState<string>('');
    const [totalStock, setTotalStock] = useState<number>(0);

    const fetchDataBarang = useCallback(async () => {
        try {
            const response = await fetch(`/api/barang-masuk`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setBarangMasukValue(data.data || null);
        } catch (error) {
            console.log(error);
            showDialog('error', 'error', "Internal server error");
        }
    }, [token]);

    const fetchDataBarangMasuk = useCallback(async () => {
        if (!barangMasukIdValue) return; // Jangan lakukan fetch jika ID belum ada

        try {
            const response = await fetch(`/api/barang-masuk?id=${barangMasukIdValue}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setStockBarang(data.data?.stock || 0); // Atur nilai default 0 jika tidak ada stock
            console.log(data);
        } catch (error) {
            console.log(error);
            showDialog('error', 'error', "Internal server error");
        }
    }, [token, barangMasukIdValue]);

    useEffect(() => {
        fetchDataBarang(); // Hanya fetch barang masuk ketika token berubah
    }, [fetchDataBarang]);

    useEffect(() => {
        fetchDataBarangMasuk(); // Hanya fetch barang masuk berdasarkan ID ketika ID berubah
    }, [fetchDataBarangMasuk, barangMasukIdValue]); 

    const handleBarangChange = (id: string) => {
        const selected = BarangMasukValue?.find((item) => item.id === id);
        if (selected) {
            setBarangIdValue(selected.barang_id ? selected.barang_id : ""); // Menyimpan id jika diperlukan
            setBarangMasukIdValue(id);
        } else {
            setBarangIdValue(''); 
            setBarangMasukIdValue('');
        }
    };

    useEffect(() => {
        const total = Number(stockBarang || 0) - Number(stockValue || 0);
        setTotalStock(total);
    }, [stockBarang, stockValue]);

    const handleAddData = async () => {
            if (
                tanggalValue === "" ||
                barangMasukIdValue === "" ||
                barangIdValue === "" ||
                stockValue === "" 
            ) {
                showDialog('warning', "warning", "Semua kolom harus di isi!");
                return;
            }
    
            setIsLoadingAdd(true);

            const data = {
                tanggal : tanggalValue,
                barang_id : barangIdValue,
                stock : stockValue,
                id_barangMasuk : barangMasukIdValue,
            }
            
            
            try {
                const response = await fetch(`/api/barang-keluar`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                })
                
                if (response.status === 200) {
                    showToast('success', "Berhasil Menambahkan Data");
                    setStockBarang('');
                    setTotalStock(0);

                    const today = new Date().toISOString().substring(0, 10);
                    setTanggalValue(today);
                    setBarangIdValue('');
                    setBarangMasukIdValue('');
                    setStockValue('0')
                }
            } catch (error) {
                console.log(error);
                showDialog('error', "Internal Server", "Internal Server Error");
            } finally { 
                setIsLoadingAdd(false);
            }
        }

        useEffect(() => {
            // Atur tanggalValue sesuai dengan tanggal saat ini
            const today = new Date().toISOString().substring(0, 10);
            setTanggalValue(today);
        }, []);
    

    return (
        <LayoutAdmin>
            <div className="flex flex-col gap-10 w-full h-max">
                <Breadcrumbs 
                    Icon={FaBoxOpen}
                    title="Barang Keluar"
                    link={[
                        {title : "Barang Keluar", link : "/barang-keluar"},
                        {title : "Tambah", link : "/barang-keluar/tambah"},
                    ]}
                />
                <div className="w-full h-max bg-white rounded shadow-md flex flex-col ">
                    <div className="h-14 w-full border-b flex items-center px-5">
                        <h1>Entri Barang Keluar</h1>
                    </div>
                    <div className="p-10 flex flex-1 flex-col w-full gap-7">
                        <div className="w-full h-full grid md:grid-cols-2 grid-cols-1 gap-7">
                            <InputField 
                                label="Tanggal"
                                type="date"
                                className="border rounded"
                                placeholder=""
                                value={tanggalValue}
                                onChange={(e) => setTanggalValue(e.target.value)}
                            />
                            <InputField 
                                label="Jumlah Keluar"
                                type="text"
                                className="border rounded"
                                placeholder=""
                                value={stockValue}
                                onChange={(e) => setStockValue(e.target.value)}
                            />
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium">Jenis Barang</span>
                                <select
                                    value={barangMasukIdValue}
                                    onChange={(e) => handleBarangChange(e.target.value)}
                                    className="h-12 w-full border rounded text-sm indent-3"
                                >
                                    <option value="">Pilih Jenis Barang</option>
                                    {BarangMasukValue?.map((item, index) => (
                                        <option key={index} value={item.id}>{item.nama_barang}- {item.stock} {item.satuan_barang}</option>
                                    ))}
                                </select>
                            </div>
                            <InputField 
                                className="border rounded"
                                placeholder=""
                                label="Stock"
                                type="text"
                                disabled={true}
                                value={stockBarang ? stockBarang : "0"}
                            />
                            <InputField 
                                className="border rounded"
                                placeholder=""
                                label="Total Stock"
                                type="text"
                                disabled={true}
                                value={totalStock ? totalStock : '0'}
                            />
                        </div>
                        <hr />
                        <div className="w-full h-max flex items-center gap-4">
                            <div className="h-max w-40">
                                <ButtonSubmit 
                                    title="Save"
                                    isLoading={isLoadingAdd}
                                    onClick={handleAddData}
                                />
                            </div>
                            <Link href={'/barang-keluar'}>
                                <button
                                    className="w-40 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white"
                                >
                                    Batal
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    )
}

export default Page
