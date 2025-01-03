/*
  Warnings:

  - You are about to drop the `jenis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `satuan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "jenis";

-- DropTable
DROP TABLE "satuan";

-- CreateTable
CREATE TABLE "Satuan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Satuan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jenis" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Jenis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Barang" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "stok_minimum" DOUBLE PRECISION NOT NULL,
    "images" TEXT NOT NULL,
    "jenis_id" TEXT NOT NULL,
    "satuan_id" TEXT NOT NULL,

    CONSTRAINT "Barang_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Satuan_nama_key" ON "Satuan"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "Jenis_nama_key" ON "Jenis"("nama");

-- AddForeignKey
ALTER TABLE "Barang" ADD CONSTRAINT "Barang_jenis_id_fkey" FOREIGN KEY ("jenis_id") REFERENCES "Jenis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barang" ADD CONSTRAINT "Barang_satuan_id_fkey" FOREIGN KEY ("satuan_id") REFERENCES "Satuan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
