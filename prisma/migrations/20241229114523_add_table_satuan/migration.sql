-- CreateTable
CREATE TABLE "satuan_barang" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "satuan_barang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenis_barang" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "jenis_barang_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "satuan_barang_nama_key" ON "satuan_barang"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_barang_nama_key" ON "jenis_barang"("nama");
