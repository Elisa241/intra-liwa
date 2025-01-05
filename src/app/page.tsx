'use client';

import { IconsBoxClose, IconsBoxes, IconsBoxOpen } from "@/assets/icons";
import LayoutAdmin from "@/components/layout/LayoutAdmin";
import RootState from "@/redux/store";
import { DataBarangMasukProps, DataBarangProps, DataDashboardStats } from "@/utils/interface/data";
import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FaBox, FaHome, FaInfo } from "react-icons/fa";
import { useSelector } from "react-redux";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const Home = () => {
  const [data, setData] = useState<DataDashboardStats | null>(null);
  const [barangMinimum, setBarangMinimum] = useState<DataBarangProps[] | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);

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

      const updatedData = result.data.map((item: DataBarangProps, index : number) => ({
        ...item,
        no : index + 1,
        totalStock: Array.isArray(item.barangMasuk) // Pastikan `barangMasuk` adalah array
          ? item.barangMasuk.reduce(
              (acc: number, barang: DataBarangMasukProps) => acc + Number(barang.stock),
              0
            )
          : 0, // Atur default jika `barangMasuk` tidak ada atau bukan array
      }));

      const lowStock = updatedData.filter(
        (item: DataBarangProps) => Number(item.totalStock) <= Number(item.stok_minimum)
      );

      setBarangMinimum(lowStock);
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

  return (
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

        <div className="h-max w-full bg-white rounded shadow-md">
          <div className="h-14 flex items-center gap-3 border-b px-6">
            <FaInfo className="text-primary text-xl" />
            <h4 className="text-sm">Stock barang yang mencapai batas minimum</h4>
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
  );
};

export default Home;
