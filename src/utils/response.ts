// utils/response.ts

export const createResponse = (status: number, message: string, data?: object) => {
    return new Response(
        JSON.stringify({
            status,
            message,
            ...(data && { data }), // jika ada data, tambahkan ke response
        }),
        { 
            status,
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
};
