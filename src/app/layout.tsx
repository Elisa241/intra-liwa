"use client";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Provider } from 'react-redux';
import { store } from "@/redux/store";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],  // Array berat font yang didukung
  subsets: ["latin"],  // Menentukan subset yang diinginkan (misalnya latin)
});

// export const metadata: Metadata = {
//   title: "GudangKu",
//   description: "Aplikasi Gudang Ku",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
