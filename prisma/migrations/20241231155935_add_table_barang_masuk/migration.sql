-- CreateTable
CREATE TABLE "BarangMasuk" (
    "id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stock" INTEGER NOT NULL,
    "barang_id" TEXT NOT NULL,

    CONSTRAINT "BarangMasuk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BarangKeluar" (
    "id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stock" INTEGER NOT NULL,
    "barang_id" TEXT NOT NULL,

    CONSTRAINT "BarangKeluar_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BarangMasuk" ADD CONSTRAINT "BarangMasuk_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "Barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarangKeluar" ADD CONSTRAINT "BarangKeluar_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "Barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
