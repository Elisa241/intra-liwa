"use client";

import LayoutAdmin from "@/components/layout/LayoutAdmin";
import ButtonSubmit from "@/components/ui/ButtonSubmit";
import InputField from "@/components/ui/InputField";
import RootState from "@/redux/store";
import { showDialog, showToast } from "@/utils/alertUtils";
import { DataJenisBarang, DataSatuanBarang } from "@/utils/interface/data";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaDatabase } from "react-icons/fa";
import { FaPhotoFilm } from "react-icons/fa6";
import { useSelector } from "react-redux";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const Page = () => {
    const [dataJenis, setDataJenis] = useState<DataJenisBarang[] | null>(null);
    const [dataSatuan, setDataSatuan] = useState<DataSatuanBarang[] | null>(null);
    const [isLoadingAdd, setIsLoadingAdd] = useState<boolean>(false);
    const [addData, setAddData] = useState({
        nama: "",
        stok_minimum : "",
        jenis_id : "",
        satuan_id : "",
        image: null as File | null,
    })
    const token = useSelector((state : RootState) => state.auth.token);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          const file = e.target.files[0];
          setAddData({...addData, image: file });
        } 
    };

    // Fungsi untuk mengambil data jenis barang
    const fetchDataJenis = useCallback(async () => {
        try {
            const response = await fetch(`/api/jenis-barang`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setDataJenis(data.data ? data.data : null);
        } catch (error) {
            console.log(error);
        }
    }, [token]); // Menambahkan token sebagai dependensi

    // Fungsi untuk mengambil data satuan barang
    const fetchDataSatuan = useCallback(async () => {
        try {
            const response = await fetch(`/api/satuan-barang`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setDataSatuan(data.data ? data.data : null);
        } catch (error) {
            console.log(error);
        }
    }, [token]); // Menambahkan token sebagai dependensi

    // useEffect untuk menjalankan fungsi saat token berubah
    useEffect(() => {
        fetchDataJenis();
        fetchDataSatuan();
    }, [fetchDataJenis, fetchDataSatuan]);

    const handleAddData = async () => {
        if (
            addData.nama === "" ||
            addData.stok_minimum === "" ||
            addData.jenis_id === "" ||
            addData.satuan_id === "" ||
            !addData.image
        ) {
            showDialog('warning', "warning", "Semua kolom harus di isi!");
            return;
        }

        setIsLoadingAdd(true);
        
        try {
            const dataBarang = new FormData;
            dataBarang.append('nama', addData.nama);
            dataBarang.append('stock_minimum', addData.stok_minimum.toString());
            dataBarang.append('jenis_id', addData.jenis_id);
            dataBarang.append('satuan_id', addData.satuan_id);
            
            if (addData.image) {
                dataBarang.append('image', addData.image);
            }

            const response = await fetch(`/api/barang`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: dataBarang,
            })
            
            if (response.status === 200) {
                showToast('success', "Berhasil Menambahkan Data");
                setAddData( {
                    nama: "",
                    stok_minimum : "",
                    jenis_id : "",
                    satuan_id : "",
                    image: null,
                })
            }
        } catch (error) {
            console.log(error);
            showDialog('error', "Internal Server", "Internal Server Error");
        } finally { 
            setIsLoadingAdd(false);
        }
    }

    return (
        <LayoutAdmin>
            <div className="flex flex-col gap-10 w-full h-max">
                <Breadcrumbs 
                    Icon={FaDatabase}
                    title="Master Data"
                    link={[
                        {title : "Data Barang", link : "/data-barang"},
                        {title : "Tambah", link : "/data-barang/tambah"},
                    ]}
                />
                <div className="w-full h-max bg-white rounded shadow-md flex flex-col ">
                    <div className="h-14 w-full border-b flex items-center px-5">
                        <h1>Entri Data Barang</h1>
                    </div>
                    <div className="p-10 flex flex-1 flex-col w-full gap-7">
                        <div className="w-full h-full flex md:flex-row flex-col-reverse gap-7">
                            <div className="w-full h-full flex-col gap-3 flex">
                                <InputField 
                                    className="border rounded"
                                    placeholder="Masukan Nama"
                                    label="Nama"
                                    type="text"
                                    value={addData.nama}
                                    onChange={(e) => setAddData({...addData, nama : e.target.value})}
                                />
                                <InputField 
                                    className="border rounded"
                                    placeholder="Masukan Stock Minimum"
                                    label="Stock Minimum"
                                    type="number"
                                    value={addData.stok_minimum}
                                    onChange={(e) => setAddData({...addData, stok_minimum: e.target.value})}
                                />
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium">Jenis Barang</span>
                                    <select
                                        value={addData.jenis_id}
                                        onChange={(e) => setAddData({...addData, jenis_id: e.target.value})}
                                        className="h-12 w-full border rounded text-sm indent-3"
                                    >
                                        <option value="">Pilih Jenis Barang</option>
                                        {dataJenis?.map((item, index) => (
                                            <option key={index} value={item.id}>{item.nama}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium">Satuan Barang</span>
                                    <select
                                        value={addData.satuan_id}
                                        onChange={(e) => setAddData({...addData, satuan_id: e.target.value})}
                                        className="h-12 w-full border rounded text-sm indent-3"
                                    >
                                        <option value="">Pilih Jenis Barang</option>
                                        {dataSatuan?.map((item, index) => (
                                            <option key={index} value={item.id}>{item.nama}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="w-full h-full flex flex-col gap-3">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium">Foto Barang</span>
                                    <div className="h-12 w-full border flex items-center rounded">
                                        <input 
                                            type="file" 
                                            className="w-full text-sm indent-3"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>
                                {addData.image ? (
                                    <div className="h-[200px] w-full shadow center-flex" >
                                        <Image 
                                            src={URL.createObjectURL(addData.image)}
                                            alt="Image add data"
                                            width={100}
                                            height={100}
                                        />
                                    </div>
                                ) : (
                                    <div className="h-[200px] w-full shadow center-flex">
                                        <FaPhotoFilm className="text-3xl" />
                                    </div>
                                )}
                                <div className="flex flex-col text-[12px] text-red-500">
                                    <p>Keterangan:</p>
                                    <p>- Tipe file yang bisa diunggah adalah *.jpg atau *.png.</p>
                                    <p>- Ukuran file yang bisa diunggah maksimal 1 Mb.</p>
                                </div>
                            </div>       
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
                            <Link href={'/data-barang'}>
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