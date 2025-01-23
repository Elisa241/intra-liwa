export interface DataUserProps {
    id? : string;
    nama? : string;
    username? : string;
    password? : string;
    role? : string;
    image? : string;
}

export interface DataSatuanBarang {
    id? : string;
    nama? : string;
}

export interface DataJenisBarang {
    id? : string;
    nama? : string;
}

export interface DataBarangProps {
    id? : string;
    nama : string;
    stok_minimum : number;
    jenis_id : string;
    satuan_id : string;
    images? : string;
    satuan? : string;
    jenis? : string;
    jenis_barang? : string;
    satuan_barang? : string;
    totalStock? : number | string;
    no? : string | number;
    barangMasuk? : DataBarangMasukProps[] | DataBarangMasukProps
}

export interface DataBarangMasukProps {
    id? : string;
    tanggal : string;
    stock : number | string;
    barang_id : string;
    nama_barang? : string;
    stok_minimum : number;
    images? : string;
    jenis_barang? : string;
    satuan_barang? : string;
}

export interface DataDashboardStats {
    id : string;
    barang : number;
    barangMasuk :  number;
    barangKeluar :  number;
    satuan :  number;
    jenis :  number;
    user : number;
}

export interface DataUserProps {
    id? : string;
    nama? : string;
    username? : string;
    password? : string;
    role? : string;
    image? : string;
}