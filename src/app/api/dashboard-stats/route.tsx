import prisma from "@/libs/prisma";
import { createResponse } from "@/utils/response";


export const GET = async () => {
    try {
        const Barang = await prisma.barang.count();
        const BarangMasuk = await prisma.barangMasuk.count();
        const BarangKeluar = await prisma.barangKeluar.count();
        const Satuan = await prisma.satuan.count();
        const Jenis = await prisma.jenis.count();
        const User = await prisma.user.count();

        const data = {
            barang : Barang,
            barangMasuk : BarangMasuk,
            barangKeluar : BarangKeluar,
            satuan : Satuan,
            jenis : Jenis,
            user : User,
        }

        return createResponse(200, 'success', data);
    } catch (error) {
        console.log(error);
        return createResponse(500, "Internal Server Error");
    }
}