import prisma from "@/libs/prisma";
import { createResponse } from "@/utils/response";
import { deleteFile, uploadFile } from "@/utils/UploadFile";
import bcrypt from 'bcryptjs';

export const POST = async (request : Request) => {
    try {
        const formData = await request.formData();

        const username = formData.get('username') as string;
        const nama = formData.get('nama') as string;
        const password = formData.get('password') as string;
        const role = formData.get('role') as string;
        const image = formData.get('image') as File;

        const user = await prisma.user.findUnique({
            where : {
                username : username,
            }
        });

        if (user) {
            return createResponse(401, "User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const imageUrl = await uploadFile(image);

        await prisma.user.create({
            data : {
                username : username,
                nama : nama,
                password : hashedPassword,
                role : role as "administrator" | 'kepala_gudang' | 'admin_gudang',
                image : imageUrl
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
        // const user = await authorizeUser(request);

        // if (user instanceof Response) {
        //     return user; // Kembalikan respons error jika otorisasi gagal
        // }

        const url = new URL(request.url);
        const { id, username } = Object.fromEntries(url.searchParams);

        let users;

        if (id) {
            // Jika ada query id, cari berdasarkan id
            users = await prisma.user.findUnique({
                where: { id: id }, // pastikan id dalam format yang benar
            });
        } else if (username) {
            // Jika ada query username, cari berdasarkan username
            users = await prisma.user.findMany({
                where: { username: { contains: username, mode: 'insensitive' } }, // insensitive untuk pencarian tidak case-sensitive
            });
        }  else {
            // Jika tidak ada query, ambil semua data pengguna
            users = await prisma.user.findMany();
        }

        // Jika tidak ada data ditemukan
        if (!users) {
            return createResponse(404, "No users found");
        }

        // Kembalikan response dengan data pengguna
        return createResponse(200, "Users retrieved successfully", users);
    } catch (error) {
        console.log(error);
        return createResponse(500, "Internal Server Error");
    }
}

export const PUT = async (request: Request) => {
    try {

        const formData = await request.formData();

        const id = formData.get('id') as string; // Ambil ID pengguna
        const username = formData.get('username') as string;
        const nama = formData.get('nama') as string;
        const password = formData.get('password') as string | null;
        const role = formData.get('role') as string;
        const imageUpdate = formData.get('imageUpdate') as File | null;

        if (!id) {
            return createResponse(400, "ID is required");
        }

        // Mencari user berdasarkan ID
        const user = await prisma.user.findUnique({
            where: { id: id },
        });

        if (!user) {
            return createResponse(404, "User not found");
        }

        // Update password jika ada
        if (role && !['administrator', 'kepala_gudang', 'admin_gudang'].includes(role)) {
            return createResponse(400, "Invalid role");
        }

        // Jika password diberikan, hash password baru
        let hashedPassword: string | null = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Proses upload gambar jika ada
        let imageUrl: string | null = user.image; // Jika tidak ada update gambar, pakai gambar yang lama
        if (imageUpdate) {
            if (user.image) {
                await deleteFile(user.image);
            }
            imageUrl = await uploadFile(imageUpdate); // Fungsi uploadFile untuk menyimpan gambar
        }

        await prisma.user.update({
            where: { id: id },
            data: {
                username : username || user.username,
                nama: nama || user.nama,
                password: hashedPassword || user.password, // Jika password tidak diubah, tetap gunakan password lama
                role: role as 'administrator' | 'kepala_gudang' | 'admin_gudang' || user.role, // Jika role tidak diubah, tetap gunakan role lama
                image: imageUrl || user.image, // Update gambar jika ada
            },
        });

        return createResponse(200, "success");
    } catch (error) {
        console.error(error);
        return createResponse(500, "Internal Server Error");
    }
};

export const DELETE = async (request: Request) => {
    try {
        const url = new URL(request.url);
        const { id } = Object.fromEntries(url.searchParams);

        if (!id) {
            return createResponse(400, "ID is required");
        }

        const user = await prisma.user.findUnique({
            where: { id: id },
        });

        if (!user) {
            return createResponse(404, "User not found");
        }

        if (user.image) {
            await deleteFile(user.image);
        }

        // Menghapus user berdasarkan ID
        await prisma.user.delete({
            where: { id: id },
        });

        return createResponse(200, "User deleted successfully");
    } catch (error) {
        console.error(error);
        return createResponse(500, "Internal Server Error");
    }
};