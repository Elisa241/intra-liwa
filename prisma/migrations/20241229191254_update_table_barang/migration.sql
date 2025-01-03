/*
  Warnings:

  - You are about to alter the column `stok_minimum` on the `Barang` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Barang" ALTER COLUMN "stok_minimum" SET DATA TYPE INTEGER;
