// app/middleware.ts

import { authorizeUser } from '@/utils/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request: Request) {
    console.log('Middleware is running');
    const user = await authorizeUser(request);

    if (user instanceof Response) {
        return user; // Kembalikan respons error jika otorisasi gagal
    }

    // Lanjutkan permintaan jika otorisasi berhasil
    return NextResponse.next();
}

// Tentukan beberapa path yang akan menggunakan middleware ini
export const config = {
    matcher: [
        '/api/user/*',        // Semua path API
    ],
};
