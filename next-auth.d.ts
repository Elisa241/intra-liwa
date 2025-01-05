// next-auth.d.ts

import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

// Perluasan tipe session untuk menambahkan id
declare module "next-auth" {
    interface Session {
      user: {
        id: string;  // menambahkan properti id
        role : string;
      };
    }

    interface User {
      id: string;
      role : string;
    }
}
