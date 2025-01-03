import prisma from "@/libs/prisma";
import { createResponse } from "@/utils/response";
import bcrypt from 'bcryptjs';

export const POST = async (request : Request) => {
    try {
        const body = await request.json();
        const { username, nama, password, role } = body;
        
        if (!body || !body.username || !body.nama || !body.password || !body.role) {
            return createResponse(400, 'All fields are required');
        }

        const user = await prisma.user.findUnique({
            where : {
                username : username,
            }
        });

        if (user) {
            return createResponse(401, "User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data : {
                username : username,
                nama : nama,
                password : hashedPassword,
                role : role
            }
        })

        return createResponse(200, "success");
    } catch (error) {
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
        const body = await request.json();
        const { id, username, nama, password, role } = body;

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
        const updatedData: any = {
            username: username || user.username,
            nama: nama || user.nama,
            role: role || user.role,
        };

        if (password) {
            updatedData.password = await bcrypt.hash(password, 10);
        }

        // Melakukan update data user
        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: updatedData,
        });

        return createResponse(200, "User updated successfully", updatedUser);
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