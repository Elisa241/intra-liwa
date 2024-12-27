import prisma from "@/libs/prisma";
import bcrypt from 'bcryptjs';

export async function POST(request : Request) {
    const { username, password, role } = await request.json();

    try {
        const exisitingUser = await prisma.user.findUnique({
            where : {
                username : username,
            }
        })

        if (!exisitingUser) {
            return Response.json({
                status : 401,
                message : "User not found"
            });
        };

        const isPasswordValid = await bcrypt.compare(password, exisitingUser.password);

        if (!isPasswordValid) {
            return new Response(
                JSON.stringify({
                    status: 401,
                    message: 'Invalid password',
                }),
                { status: 401 }
            );
        }

        if (role && exisitingUser?.role !== role) {
            return new Response(
                JSON.stringify({
                    status: 403,
                    message: 'Role does not match',
                }),
                { status: 403 }
            );
        }

        return new Response(
            JSON.stringify({
                status: 200,
                message: 'Login successful',
                user: {
                    id: exisitingUser.id,
                    username: exisitingUser.username,
                    role: exisitingUser.role,
                },
            }),
            { status: 200 }
        );

        
    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({
                status: 500,
                message: 'Internal server error',
            }),
            { status: 500 }
        );
    }
}