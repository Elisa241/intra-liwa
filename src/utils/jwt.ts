import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'asdasdasdasdasdas';

// Membuat token
export const createToken = (payload: object) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

// Verifikasi token


