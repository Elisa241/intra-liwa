const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Seeder untuk Satuan Barang
    const satuanData = [
        { nama: 'Unit' },
        { nama: 'Kilogram' },
        { nama: 'Liter' },
        { nama: 'Meter' },
        { nama: 'Box' },
        { nama: 'Pack' },
    ];

    for (const satuan of satuanData) {
        await prisma.satuan.upsert({
        where: { nama: satuan.nama },
        update: {},
        create: satuan,
        });
    }

    console.log('Seeder untuk Satuan selesai.');

    // Seeder untuk Jenis Barang
    const jenisData = [
        { nama: 'Elektronik' },
        { nama: 'Peralatan Kantor' },
        { nama: 'Bahan Makanan' },
        { nama: 'Bahan Bangunan' },
        { nama: 'Pakaian' },
        { nama: 'Barang Konsumsi' },
        { nama: 'Kebutuhan Rumah Tangga' },
    ];

    for (const jenis of jenisData) {
        await prisma.jenis.upsert({
        where: { nama: jenis.nama },
        update: {},
        create: jenis,
        });
    }

    console.log('Seeder untuk Jenis selesai.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
