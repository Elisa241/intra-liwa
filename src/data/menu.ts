
import { CiLogin, CiLogout } from "react-icons/ci";
import {  FaBoxes, FaBoxOpen,  FaFile,  FaFileExport,  FaHome,  FaUser } from "react-icons/fa";


export const DataMenuAdmin = [
    {
        title: "Dashboard",
        Icon: FaHome,
        link: "/",
        type: "button", // Menandai bahwa ini adalah tombol
    },
    {
        title: "Master",
        Icon: null,
        type: "submenu", // Menandai bahwa ini adalah menu
        submenu: [
            {
                title: "Barang",
                Icon: FaBoxes,
                type: "menu",
                submenu: [
                    { title: "Data Barang", link: "/data-barang" },
                    { title: "Jenis Barang", link: "/data-jenis" },
                    { title: "Satuan Barang", link: "/data-satuan" },
                ],
            },
        ],
    },
    {
        title: "Transaksi",
        Icon: null,
        type: "menu",
        submenu: [
            { 
                title: "Barang Masuk", 
                Icon: CiLogin, 
                link: "/barang-masuk",
                type : "button",
                submenu : [

                ]
            },
            { 
                title: "Barang Keluar", 
                Icon: CiLogout, 
                link: "/barang-keluar",
                type : "button",
                submenu : [
                    
                ]
            },
        ],
    },
    {
        title: "Laporan",
        Icon: null,
        type: "menu",
        submenu: [
            { 
                title: "Laporan Stock", 
                Icon: FaFile, 
                link: "/laporan-stock",
                type : "button",
                submenu : [
                    
                ]
            },
            { 
                title: "Laporan Barang Masuk", 
                Icon: FaFileExport, 
                link: "/laporan-barang-masuk",
                type : "button"
            },
            { 
                title: "Laporan Barang Keluar", 
                Icon: FaFileExport, 
                link: "/laporan-barang-keluar",
                type : "button",
                submenu : [
                    
                ]
            },
        ],
    },
    {
        title: "Manajemen User",
        Icon: null,
        type: "menu",
        submenu: [
            { 
                title: "Manajemen User", 
                Icon: FaUser, 
                link: "/data-user", 
                type : "button",
                submenu : [
                    
                ]
            },
        ],
    },
];

export const DataMenuAdminGudang = [
    {
        title: "Dashboard",
        Icon: FaHome,
        link: "/",
        type: "button", // Menandai bahwa ini adalah tombol
    },
    {
        title: "Master",
        Icon: null,
        type: "submenu", // Menandai bahwa ini adalah menu
        submenu: [
            {
                title: "Barang",
                Icon: FaBoxes,
                type: "menu",
                submenu: [
                    { title: "Data Barang", link: "/data-barang" },
                    { title: "Jenis Barang", link: "/data-jenis" },
                    { title: "Satuan Barang", link: "/data-satuan" },
                ],
            },
        ],
    },
    {
        title: "Transaksi",
        Icon: null,
        type: "menu",
        submenu: [
            { 
                title: "Barang Masuk", 
                Icon: FaBoxOpen, 
                link: "/barang-masuk",
                type : "button",
                submenu : [

                ]
            },
            { 
                title: "Barang Keluar", 
                Icon: FaBoxOpen, 
                link: "/barang-keluar",
                type : "button",
                submenu : [
                    
                ]
            },
        ],
    },
    {
        title: "Laporan",
        Icon: null,
        type: "menu",
        submenu: [
            { 
                title: "Laporan Stock", 
                Icon: FaFile, 
                link: "/laporan-stock",
                type : "button",
                submenu : [
                    
                ]
            },
            { 
                title: "Laporan Barang Masuk", 
                Icon: FaFileExport, 
                link: "/laporan-barang-masuk",
                type : "button"
            },
            { 
                title: "Laporan Barang Keluar", 
                Icon: FaFileExport, 
                link: "/laporan-barang-keluar",
                type : "button",
                submenu : [
                    
                ]
            },
        ],
    }
]

export const DataMenuKepalaGudang = [
    {
        title: "Dashboard",
        Icon: FaHome,
        link: "/",
        type: "button", // Menandai bahwa ini adalah tombol
    },
    {
        title: "Laporan",
        Icon: null,
        type: "menu",
        submenu: [
            { 
                title: "Laporan Stock", 
                Icon: FaFile, 
                link: "/laporan-stock",
                type : "button",
                submenu : [
                    
                ]
            },
            { 
                title: "Laporan Barang Masuk", 
                Icon: FaFileExport, 
                link: "/laporan-barang-masuk",
                type : "button"
            },
            { 
                title: "Laporan Barang Keluar", 
                Icon: FaFileExport, 
                link: "/laporan-barang-keluar",
                type : "button",
                submenu : [
                    
                ]
            },
        ],
    },
]