import prisma from "@/libs/prisma";
import { createResponse } from "@/utils/response";
import bcrypt from 'bcryptjs';


export const POST = async (request : Request) => {
    try {
        const body = await request.json();
        const { username, nama, password, role } = body;

        if (!body || !body.username || !body.nama || !body.password || !body.role) {
            return createResponse(400, "All fields are required");
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
        
    } catch {
        return createResponse(500, "Internal Server Error");
    }
}