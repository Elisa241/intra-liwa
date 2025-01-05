import prisma from "@/libs/prisma";
import { createToken } from "@/utils/jwt";
import { createResponse } from "@/utils/response";
import bcrypt from 'bcryptjs';

export const POST = async (request : Request) => {
    try {
        const body = await request.json();
        const { username, password, role } = body;

        if (!body || !body.username  || !body.password || !body.role) {
            return createResponse(405, "All fields are required");
        }
        
        const exisitingUser = await prisma.user.findUnique({
            where : {
                username : username,
            }
        })

        if (!exisitingUser) {
            return createResponse(402, "User not found");
        };

        const isPasswordValid = await bcrypt.compare(password, exisitingUser.password);

        if (!isPasswordValid) {
            return createResponse(401, "Invalid password");
        }

        if (role && exisitingUser?.role !== role) {
            return createResponse(403, "Role does not match");
        }

        const payload = {
            username : exisitingUser.username,
            id : exisitingUser.id,
            role : exisitingUser.role
        }

        const token = createToken(payload);

        await prisma.user.update({
            where : {
                id : exisitingUser.id
            },
            data : {
                token : token
            }
        })

        return createResponse(200, "Login successful", {
            token : token
        });

        
    } catch {
        return createResponse(500, "Internal Server Error");
    }
}