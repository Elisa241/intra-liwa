/*
  Warnings:

  - You are about to drop the `jenis_barang` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `satuan_barang` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "jenis_barang";

-- DropTable
DROP TABLE "satuan_barang";

-- CreateTable
CREATE TABLE "satuan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "satuan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenis" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "jenis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "satuan_nama_key" ON "satuan"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_nama_key" ON "jenis"("nama");
