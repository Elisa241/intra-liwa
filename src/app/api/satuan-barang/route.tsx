import prisma from "@/libs/prisma";
import { createResponse } from "@/utils/response";

export const POST = async (request : Request) => {
    try {
        const body = await request.json();
        const { nama } = body;

        if (!body || !body.nama) {
            return createResponse(400, "All fields are required");
        }

        const data = await prisma.satuan.findUnique({
            where: {
                nama: nama
            }
        });

        if (data) {
            return createResponse(409, "data already exists");
        }

        await prisma.satuan.create({
            data: {
                nama
            }
        });

        return createResponse(200, "success");
    } catch  {
        return createResponse(500, "Internal Server Error");
    }
}

export const GET = async (request : Request) => {
    try {
        const url = new URL(request.url);
        const { id, nama } = Object.fromEntries(url.searchParams);

        let data;

        if (id) {
            data = await prisma.satuan.findUnique({
                where: {
                    id: id
                }
            });
        } else if (nama) {
            data = await prisma.satuan.findMany({
                where: {
                    nama: nama
                }
            });
        } else {
            data = await prisma.satuan.findMany();
        }

        if (!data) {
            return createResponse(404, "Data not found!");
        }

        return createResponse(200, "success", data);
    } catch  {
        return createResponse(500, "Internal Server Error");
    }
}

export const PUT = async (request : Request) => {
    try {
        const body = await request.json();
        const { id, nama } = body;

        if (!id) {
            return createResponse(400, "ID is required");
        };

        const data = await prisma.satuan.findUnique({
            where: {
                id: id
            }
        });

        if (!data) {
            return createResponse(404, "data not found!");
        }

        await prisma.satuan.update({
            where: {
                id: id
            },
            data: {
                nama: nama
            }
        })

        return createResponse(200, "Success");
    } catch  {
        return createResponse(500, "Internal Server Error");
    }
}

export const DELETE = async (request : Request) => {
    try {
        const url = new URL(request.url);
        const { id } = Object.fromEntries(url.searchParams);

        if (!id) {
            return createResponse(400, "ID is required");
        }

        const data = await prisma.satuan.findUnique({
            where: {
                id: id
            }
        });

        if (!data) {
            return createResponse(404, "data not found!");
        }

        await prisma.satuan.delete({
            where: {
                id: id
            }
        })

        return createResponse(200, "satuan barang deleted successfully");
    } catch  {
        return createResponse(500, "Internal Server Error");
    }
}