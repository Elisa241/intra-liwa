import jwt from 'jsonwebtoken';
import { createResponse } from './response';
import { NextResponse } from 'next/server';
import prisma from '@/libs/prisma';
import { JWTPayload } from './interface/payload';

const SECRET_KEY = process.env.JWT_SECRET || 'asdasdasdasdasdas';

// Membuat token
export const createToken = (payload: object) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

// Verifikasi token
export const verifyToken = (token: string): JWTPayload | null => {
    try {
        if (!token || token.split('.').length !== 3) {
            throw new Error('Malformed token');
        }

        const decoded = jwt.verify(token, SECRET_KEY) as JWTPayload;
        return decoded;
    } catch (error: any) {
        console.error("JWT Error:", error);

        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        }
        if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token signature');
        }
        if (error.name === 'NotBeforeError') {
            throw new Error('Token is not active yet');
        }

        throw new Error('Invalid token');
    }
};

export const authorizeUser = async (request: Request) => {
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
        return new Response(JSON.stringify({ message: "Unauthorized: No token provided" }), { status: 401 });
    }

    try {
        const decoded = verifyToken(token);

        if (!decoded) {
            return createResponse(401, "Unauthorized: Invalid token")
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return createResponse(404, "Unauthorized: User Not Found")
        }

        return user; // Token valid, dan user ditemukan
    } catch (error: any) {
        return createResponse(403, error.message);
    }
};

