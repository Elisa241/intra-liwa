
import prisma from '@/libs/prisma';
import { createResponse } from '@/utils/response';
import { deleteFile, uploadFile } from '@/utils/UploadFile';

export const POST = async (request: Request) => {
    try {
        const formData = await request.formData();

        const image = formData.get('image') as File | null;
        const nama = formData.get('nama') as string;
        const stock_minimum = formData.get('stock_minimum') as string;
        const jenis_id = formData.get('jenis_id') as string;
        const satuan_id = formData.get('satuan_id') as string;

        // Validasi input
        if (!nama || !stock_minimum || !jenis_id || !satuan_id) {
            return createResponse(400, "All fields except image are required");
        }

        let url: string | null = null;

        // Jika ada file gambar, lakukan upload
        if (image) {
            url = await uploadFile(image);

            if (!url) {
                return createResponse(400, "Failed to upload image");
            }
        }

        // Buat data baru di database
        await prisma.barang.create({
            data: {
                nama: nama,
                stok_minimum: parseInt(stock_minimum, 10),
                jenis_id: jenis_id,
                satuan_id: satuan_id,
                images : url
            },
        });

        return createResponse(200, "Success");
    } catch (error) {
        console.log(error);
        return createResponse(500, "Internal Server Error");
    }
};

export const GET = async (request : Request) => {
    try {
        const url = new URL(request.url);
        const { id, nama } = Object.fromEntries(url.searchParams);
        
        let barang;

        if (id) {
            barang = await prisma.barang.findUnique({
                where: { id: id },
                include : {
                    jenis : true,
                    satuan : true,
                    barangMasuk : true,
                    barangKeluar : true,
                }
            });
        } else if (nama) {
            barang = await prisma.barang.findMany({
                where: { nama: { contains: nama.toLowerCase(), } },
                include : {
                    jenis : true,
                    satuan : true,
                    barangMasuk : true,
                    barangKeluar : true,
                }
            });
        } else {
            barang = await prisma.barang.findMany({
                include : {
                    jenis : true,
                    satuan : true,
                    barangKeluar : true,
                    barangMasuk : true,
                }
            });
        }

        if (!barang) {
            return createResponse(404, "Data not found!");
        }

        const data = Array.isArray(barang)
            ? barang.map(item => ({
                ...item,
                jenis: item.jenis.nama,
                satuan: item.satuan.nama
            }))
            : {
                ...barang,
                jenis_barang: barang.jenis.nama,
                satuan_barang: barang.satuan.nama
            };

        return createResponse(200, "success", data);
    } catch (error) {
        console.log(error);
        return createResponse(500, "Internal Server Error");
    }
}

export const DELETE = async (request : Request) => { 
    try {
        const url = new URL(request.url);
        const { id } = Object.fromEntries(url.searchParams);

        // await deleteImageFromBlob(url);

        const data = await prisma.barang.findUnique({
            where: { id: id },
        });

        if (!data) {
            return createResponse(404, "Data not found!");
        }

        if (data.images) {
            await deleteFile(data.images)
        }

        await prisma.barang.delete({
            where: { id: id },
        });

        return createResponse(200, "success");
    } catch (error) {
        console.log(error);
        return createResponse(500, "Internal Server Error");
    }
}

export const PUT = async (request: Request) => {
    try {
        const formData = await request.formData();

        const id = formData.get('id') as string;
        const nama = formData.get('nama') as string;
        const stock_minimum = formData.get('stock_minimum') as string;
        const image = formData.get('image') as File | null;
        const jenis_id = formData.get('jenis_id') as string;
        const satuan_id = formData.get('satuan_id') as string;

        // Check if the data exists in the database
        const data = await prisma.barang.findUnique({
            where: { id },
        });

        if (!data) {
            return createResponse(404, "Data not found!");
        }

        let updatedImageUrl = data.images; // Default to current image URL

        // If a new image is provided, upload it and delete the old one
        if (image) {
            if (data.images) {
                await deleteFile(data.images);
            }
            updatedImageUrl = await uploadFile(image);
        }

        // Update the data in the database
        await prisma.barang.update({
            where: { id },
            data: {
                nama,
                stok_minimum: parseInt(stock_minimum, 10),
                jenis_id,
                satuan_id,
                images: updatedImageUrl,
            },
        });

        return createResponse(200, "Success");
    } catch (error) {
        console.error(error);
        return createResponse(500, "Internal Server Error");
    }
};