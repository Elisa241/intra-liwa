"use client";

import { DataMenuHome } from "@/data/menu";
import Link from "next/link";
// hapus baris import React, { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

const page = () => {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false); // Sembunyikan animasi setelah beberapa detik
    }, 6000); // Sesuaikan durasi animasi (dalam milidetik)

    return () => clearTimeout(timer); // Bersihkan timer saat komponen unmount
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/sign-in" });
  };

  return (
    <div className="w-full h-screen bg-black primary center-flex relative">
      {showAnimation ? (
        // Bagian logo animasi
        <div className="logo-container">
          <div className="square">
            <div className="letter">I</div>
            <div className="bottom-line"></div>
            <div className="left-line"></div>
          </div>
          <div className="logo-text">INTRA LIWA</div>
          <style jsx>{`
            .logo-container {
              text-align: center;
              font-family: "Poppins", sans-serif;
            }

            .square {
              position: relative;
              width: 100px;
              height: 100px;
              margin: 0 auto;
            }

            .square::before,
            .square::after {
              content: "";
              position: absolute;
              background-color: #a020f0;
              opacity: 0;
            }

            /* Garis atas */
            .square::before {
              top: 0;
              left: 0;
              height: 4px;
              width: 100%;
              animation: moveTopLine 2s forwards 2s; /* Muncul kedua */
            }

            /* Garis kanan */
            .square::after {
              top: 0;
              right: 0;
              width: 4px;
              height: 100%;
              animation: moveRightLine 2s forwards 2s; /* Muncul kedua */
            }

            .bottom-line {
              position: absolute;
              bottom: 0;
              left: 25%; /* 25% lebar untuk celah */
              background-color: #a020f0;
              height: 4px;
              width: 75%; /* Panjang garis bawah */
              animation: moveBottomLine 2s forwards; /* Muncul pertama */
            }

            .left-line {
              position: absolute;
              top: 0;
              left: 0;
              background-color: #a020f0;
              width: 4px;
              height: 75%; /* Tinggi garis celah di bagian bawah */
              animation: moveLeftLine 2s forwards; /* Muncul pertama */
            }

            @keyframes moveBottomLine {
              0% {
                width: 0;
              }
              100% {
                width: 75%;
              }
            }

            @keyframes moveLeftLine {
              0% {
                height: 0;
              }
              100% {
                height: 75%;
              }
            }

            @keyframes moveTopLine {
              0% {
                width: 0;
                opacity: 1;
              }
              100% {
                width: 100%;
                opacity: 1;
              }
            }

            @keyframes moveRightLine {
              0% {
                height: 0;
                opacity: 1;
              }
              100% {
                height: 100%;
                opacity: 1;
              }
            }

            .letter {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-size: 30px;
              color: #a020f0;
              font-weight: bold;
              opacity: 0;
              visability: hidden;
              animation: fadeInLetter 2s forwards 4s, rotateLetter 2s forwards 4s;
            }

            .logo-text {
              margin-top: 10px;
              font-size: 18px;
              font-weight: 600;
              color:white;
              letter-spacing: 2px;
              text-transform: uppercase;
              opacity: 0;
              visability: hidden;
              animation: fadeInText 2s forwards 4s;
            }

            @keyframes fadeInText {
              0% {
                opacity: 0;
                transform: translateY(20px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes fadeInLetter {
              0% {
                opacity: 0;
                display: none;
              }
              100% {
                opacity: 1;
                display: block;
              }
            }

            @keyframes rotateLetter {
              0% {
                transform: translate(-50%, -50%) rotate(0deg);
              }
              100% {
                transform: translate(-50%, -50%) rotate(360deg);
              }
            }
          `}</style>
        </div>
      ) : (
        // Bagian menu setelah animasi selesai
        <>
    <button
      onClick={handleLogout}
      className="px-6 py-3 bg-gradient-to-r from-[#6a0572] to-[#320d6d] text-white rounded-full text-lg font-semibold hover:opacity-90 transition-all duration-300 ease-in-out shadow-lg hover:shadow-2xl transform hover:scale-105 absolute top-4 right-4"
  >
        Logout
    </button>

        {/* Logo Intra Liwa di kiri atas */}
        <div className="absolute top-4 left-4 flex items-center">
          <div className="logo-container">
            <div className="square">
              <span className="letter">I</span>
              <div className="top-line"></div>
              <div className="right-line"></div>
              <div className="bottom-line"></div>
              <div className="left-line"></div>
            </div>
            <div className="logo-text">INTRA LIWA</div>
          </div>

          <style jsx>{`
            .logo-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              font-family: "Poppins", sans-serif;
            }

            .square {
              position: relative;
              width: 50px; /* Ukuran kotak */
              height: 50px;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .letter {
              font-size: 24px;
              color: #a020f0; /* Warna huruf "I" */
              font-weight: bold;
            }

            // Garis atas //
            .top-line {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%; /* Panjang penuh untuk menyambung */
              height: 4px;
              background-color: #a020f0;
            }

            /* Garis kanan */
            .right-line {
              position: absolute;
              top: 0;
              right: 0;
              width: 4px;
              height: 100%; /* Tinggi penuh */
              background-color: #a020f0;
            }

            /* Garis bawah */
            .bottom-line {
              position: absolute;
              bottom: 0;
              left: 12px; /* Celah di kiri bawah */
              width: calc(100% - 12px); /* Panjang penuh dengan celah */
              height: 4px;
              background-color: #a020f0;
            }

            /* Garis kiri */
            .left-line {
              position: absolute;
              top: 0;
              left: 0;
              width: 4px;
              height: calc(100% - 12px); /* Tinggi penuh dengan celah di bawah */
              background-color: #a020f0;
            }

            .logo-text {
              margin-top: 6px; /* Jarak antara kotak dan teks */
              font-size: 14px; /* Ukuran teks */
              font-weight: 600;
              color: white; /* Warna teks */
              letter-spacing: 2px;
              text-transform: uppercase;
            }
          `}</style>
        </div>


        {/* Menu setelah animasi */}
          <div className="w-[90%] max-w-[1200px] mx-auto mt-16">
          
          {/* Teks di atas menu */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-pink-800">Inventaris dan Kinerja</h2>
          </div>

          {/* Grid menu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {DataMenuHome.map((item, index) => (
              <Link key={index} href={item.link}>
                <div className="relative group h-[200px] bg-gradient-to-br from-[#6a0572] to-[#2cb67d] rounded-3xl p-6 flex flex-col justify-center items-center shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
                  
                  {/* Ikon */}
                    <div className="absolute top-[-20px] left-[-20px] w-[80px] h-[80px] bg-[#6a0572] rounded-full blur-2xl opacity-30"></div>
                      <div className="absolute bottom-[-20px] right-[-20px] w-[80px] h-[80px] bg-[#2cb67d] rounded-full blur-2xl opacity-30"></div>

                  {/* Judul menu */}
                    <p className="text-white font-semibold text-2xl mb-2 group-hover:text-[#f8f9fa] transition-colors duration-300">
                      {item.title}
                    </p>

                  {/* Status */}
                    {item.active === false && (
                      <p className="text-sm font-light text-[#f8f9fa] mt-2 group-hover:text-gray-300 transition-all duration-300">
                        Dalam Proses Pembuatan
                      </p>
                    )}

                  {/* Efek hover tambahan */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
                </>
              )}
            </div>
          );
        };

        export default page;
