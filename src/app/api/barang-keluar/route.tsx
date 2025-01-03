import prisma from "@/libs/prisma";
import { createResponse } from "@/utils/response";


export const POST = async (request : Request) => {
    try {
        const body = await request.json();
        const { stock, tanggal, barang_id, id_barangMasuk } = body;

       // Validate input fields
       if (!tanggal || !stock || !barang_id) {
            return createResponse(400, "All fields (tanggal, stock, barang_id) are required");
        }

        // Ensure tanggal is a valid date
        const parsedDate = new Date(tanggal);
        if (isNaN(parsedDate.getTime())) {
            return createResponse(400, "Invalid date format for tanggal");
        }

        const existingBarangMasuk = await prisma.barangMasuk.findMany({
            where : {
                id : id_barangMasuk,
            }
        })

        if (!existingBarangMasuk) {
            return createResponse(402, "Barang Masuk with given ID not found");
        }

        await prisma.barangMasuk.update({
            where: {
                id : id_barangMasuk,
            },
            data : {
                stock : existingBarangMasuk[0].stock - parseInt(stock),
            }
        })

        await prisma.barangKeluar.create({
            data : {
                tanggal : parsedDate,
                stock : parseInt(stock),
                barang_id
            }
        })

        return createResponse(200, "success");
    } catch (error) {
        console.log(error);
        return createResponse(500, "Internal Server Error");
    }
}

export const GET = async (request : Request) => {
    try {
        const url = new URL(request.url);
        const { id, nama } = Object.fromEntries(url.searchParams)

        let data;

        if (id) {
            data = await prisma.barangKeluar.findUnique({
                where: { id: id },
                include : {
                    barang : {
                        include : {
                            jenis : true,
                            satuan : true
                        }
                    }
                }
            });
        } else if (nama) {
            data = await prisma.barangKeluar.findMany({
                where : {
                    barang : {
                        nama: { contains: nama, mode: 'insensitive' }
                    }
                },
                include : {
                    barang : {
                        include : {
                            jenis : true,
                            satuan : true
                        }
                    }
                }
            });
        } else {
            data = await prisma.barangKeluar.findMany({
                include : {
                    barang : {
                        include : {
                            jenis : true,
                            satuan : true
                        }
                    }
                }
            });
        }

        if (!data) {
            return createResponse(404, "Data not found!");
        }

        const datas = Array.isArray(data)
            ? data.map(item => ({
                ...item,
                tanggal: new Date(item.tanggal).toISOString().split('T')[0],
                nama_barang : item.barang.nama,
                stok_minimum : item.barang.stok_minimum,
                images : item.barang.images,
                jenis_barang: item.barang.jenis.nama,
                satuan_barang: item.barang.satuan.nama,
            }))
            : {
                ...data,
            }

        return createResponse(200, "success", datas);
    } catch (error) {
        console.log(error);
        return createResponse(500, "Internal Server Error");
    }
}



export const DELETE = async (request : Request) => {
    try {
        const url = new URL(request.url);
        const { id } = Object.fromEntries(url.searchParams);

        if (!id) {
            return createResponse(400, "ID is required");
        }

        await prisma.barangKeluar.delete({
            where: {
                id: id
            }
        })

        return createResponse(200, "success");
    } catch (error) {
        console.log(error);
        return createResponse(500, "Internal Server Error");
    }
}