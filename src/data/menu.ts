import { SidebarMenuProps } from "@/utils/interface/components";
import {  FaBoxOpen, FaDatabase, FaFileAlt, FaHome } from "react-icons/fa";

export const MenuAdmin: SidebarMenuProps[] = [
    {
        title : "Dashboard",
        Icon : FaHome,
        link : "/"

    }, 
    {
        title : "Master Data",
        Icon : FaDatabase,
        type : "submenu",
        menu : [
            {
                title : "Data User",
                link : "/data-user"
            },
            {
                title : "Data Barang",
                link : "/data-barang"
            },
            {
                title : "Jenis Barang",
                link : "/data-jenis"
            }, 
            {
                title : "Satuan Barang",
                link : "/data-satuan"
            }
        ]
    }, 
    {
        title : "Barang Masuk",
        Icon : FaBoxOpen,
        link : "/barang-masuk"
    }, 
    {
        title : "Barang Keluar",
        Icon : FaBoxOpen,
        link : "/barang-keluar"
    }, 
    {
        title : "Laporan",
        Icon : FaFileAlt,
        type : "submenu",
        menu : [
            {
                title : "Laporan Stock",
                link : "/laporan-stock"
            },
            {
                title : "Laporan Barang Masuk",
                link : "/barang"
            },
            {
                title : "Laporan Barang Keluar",
                link : "/jenis-barang"
            },
        ]
    }, 
 
]