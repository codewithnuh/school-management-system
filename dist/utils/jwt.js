import { SignJWT, jwtVerify } from 'jose';
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET); // Use an environment variable
export const createJWT = async (payload, expiresIn = '1h') => {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(JWT_SECRET);
};
export const verifyJWT = async (token) => {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
};
