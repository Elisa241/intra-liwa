import { del, put } from "@vercel/blob";

const token = process.env.BLOB_READ_WRITE_TOKEN;

export const uploadImage = async (file: File): Promise<string> => {
    if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed.');
    }

    if (file.size > 4 * 1024 * 1024) {
        throw new Error('File size must be less than 4MB.');
    }

    const { url } = await put(file.name, file, {
        access: 'public',
        multipart: true,
        token
    });

    return url;
};

export const deleteImageFromBlob = async (imageUrl: string): Promise<void> => {
    try {
        await del(imageUrl, {
            token
        });

    } catch (error) {
        console.error('Failed to delete image from Vercel Blob', error);
        throw new Error('Failed to delete image');
    }
};