import path from "path";
import fs from "fs";

// Menentukan direktori penyimpanan file
const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");

// Fungsi untuk menangani upload file
export const uploadFile = async (file: Blob | File) => {
    // Membuat nama file dengan timestamp dan nama asli file
    const fileName = `${Date.now()}-${(file as File).name}`;
    const filePath = path.resolve(UPLOAD_DIR, fileName);

    // Membaca file menjadi buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Mengecek apakah folder uploads ada, jika tidak maka buat folder
    if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // Menyimpan file ke dalam server
    fs.writeFileSync(filePath, buffer);

    // Mengembalikan path atau URL file yang telah disimpan
    return fileName
};

export const deleteFile = (fileName: string) => {
    const filePath = path.resolve(UPLOAD_DIR, fileName);

    // Mengecek apakah file ada sebelum menghapus
    if (fs.existsSync(filePath)) {
        // Menghapus file
        fs.unlinkSync(filePath);
        return true; // Mengindikasikan bahwa file berhasil dihapus
    } else {
        return false; // Mengindikasikan bahwa file tidak ditemukan
    }
};