import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from "@/libs/prisma";
import bcrypt from 'bcryptjs';
// hapus baris ini jika tidak digunakan
// import { createToken } from "@/utils/jwt";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Username" },
                password: { label: "Password", type: "password", placeholder: "Password" },
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where : {
                        username : credentials?.username,
                    }
                })

                if (!user) {
                    throw new Error('User not found');
                }

                const isPasswordValid = credentials?.password ? await bcrypt.compare(credentials.password, user.password) : false;

                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }

                return { ...user };
            }
        })
    ],
    pages: {
        signIn: '/sign-in', // Optional, customize the login page
    },
    session: {
        strategy: 'jwt', // Use JWT for sessions
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET, // Tentukan secret untuk menandatangani token
        maxAge: 24 * 60 * 60, // 24 jam (dalam detik)
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                id: token.id as string,
                role : token.role as string
            };
            return session;
        },
    },
})

export { handler as GET, handler as POST }