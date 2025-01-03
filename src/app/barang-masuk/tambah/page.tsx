"use client";

import LayoutAdmin from "@/components/layout/LayoutAdmin";
import ButtonSubmit from "@/components/ui/ButtonSubmit";
import InputField from "@/components/ui/InputField";
import RootState from "@/redux/store";
import { showDialog, showToast } from "@/utils/alertUtils";
import { DataBarangMasukProps, DataBarangProps, DataJenisBarang, DataSatuanBarang } from "@/utils/interface/data";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBoxOpen, FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";

const Page = () => {
    const [dataBarang, setDataBarang] = useState<DataBarangProps[] | null>(null);
    const [isLoadingAdd, setIsLoadingAdd] = useState<boolean>(false);
    const [addData, setAddData] = useState({
        tanggal : new Date().toISOString().slice(0, 10),
        stock : "",
        barang_id : "",
    })
    const [stockBarang, setStockBarang] = useState<string>('');
    const [totalStock, setTotalStock] = useState<number>(0);
    const token = useSelector((state : RootState) => state.auth.token);


    const fetchDataBarang = async () => {
        try {
            const response = await fetch(`/api/barang`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setDataBarang(data.data? data.data : null);
        } catch (error) {
            console.log(error);
            showDialog('error', 'error', "Internal server error");
        }
    }

    const fetchDataBarangMasuk = async () => {
        try {
            const response = await fetch(`/api/barang?id=${addData.barang_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (Array.isArray(data.data.barangMasuk)) {
                const totalStock = data.data.barangMasuk.reduce((acc : number, barang : DataBarangMasukProps) => {
                    return acc + (Number(barang.stock) || 0); 
                }, 0);
            
                setStockBarang(totalStock);
            }

        } catch (error) {
            console.log(error);
            showDialog('error', 'error', "Internal server error");
        }
    }

    useEffect(() => {
        fetchDataBarang();
    }, [token]);

    useEffect(() => {
        fetchDataBarangMasuk();
    }, [addData.barang_id]);

    const handleAddData = async () => {
        if (
            addData.tanggal === "" ||
            addData.barang_id === "" ||
            addData.stock === "" 
        ) {
            showDialog('warning', "warning", "Semua kolom harus di isi!");
            return;
        }

        setIsLoadingAdd(true);
        
        try {

            const response = await fetch(`/api/barang-masuk`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(addData),
            })
            
            if (response.status === 200) {
                showToast('success', "Berhasil Menambahkan Data");
                setAddData( {
                    tanggal : new Date().toISOString().slice(0, 10),
                    stock : "",
                    barang_id : "",
                })
                setStockBarang('');
                setTotalStock(0);
            }
        } catch (error) {
            console.log(error);
            showDialog('error', "Internal Server", "Internal Server Error");
        } finally { 
            setIsLoadingAdd(false);
        }
    }

    useEffect(() => {
        const total = Number(stockBarang || 0) + Number(addData.stock || 0);
        setTotalStock(total);
    }, [stockBarang, addData.stock]);


    return (
        <LayoutAdmin>
            <div className="flex flex-col gap-10 w-full h-max">
                <div className="flex items-center gap-5 text-white">
                    <div className="flex items-center gap-2 text-white text-2xl">
                        <FaBoxOpen />
                        <h1 className="text-lg font-medium">Barang Masuk</h1>
                    </div>
                    <div className="h-10 w-[1px] bg-white"></div>
                    <p>Barang Masuk</p>
                    <FaChevronRight />
                    <p>Tambah</p>
                </div>
                <div className="w-full h-max bg-white rounded shadow-md flex flex-col ">
                    <div className="h-14 w-full border-b flex items-center px-5">
                        <h1>Entri Barang Masuk</h1>
                    </div>
                    <div className="p-10 flex flex-1 flex-col w-full gap-7">
                        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-7">
                            <InputField 
                                className="border rounded"
                                placeholder=""
                                label="Tanggal"
                                type="date"
                                value={addData.tanggal}
                                onChange={(e) => setAddData({...addData, tanggal : e.target.value})}
                            />
                            <InputField 
                                className="border rounded"
                                placeholder="Masukan Jumlah Masuk"
                                label="Jumlah Masuk"
                                type="number"
                                value={addData.stock}
                                onChange={(e) => setAddData({...addData, stock: e.target.value})}
                            />
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium">Jenis Barang</span>
                                <select
                                    value={addData.barang_id}
                                    onChange={(e) => setAddData({...addData, barang_id: e.target.value})}
                                    className="h-12 w-full border rounded text-sm indent-3"
                                >
                                    <option value="">Pilih Jenis Barang</option>
                                    {dataBarang?.map((item, index) => (
                                        <option key={index} value={item.id}>{item.nama}</option>
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
                            <Link href={'/barang-masuk'}>
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
