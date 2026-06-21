import jwt from "jsonwebtoken";
import { JWT_EXPIRES_TIME, JWT_REFRESH_EXPIRES_TIME, JWT_REFRESH_KEY_ADMIN, JWT_REFRESH_KEY_USER, JWT_SECRET_ADMIN, JWT_SECRET_USER } from "../../../config/config.service.js";
import { roleEnum, signatureEnum } from "../enums/user.enum.js";
import { v4 as uuidv4 } from 'uuid';


export const generateToken = async ({ payload, secretKey, options = { expiresIn: JWT_EXPIRES_TIME } }) => {
    return jwt.sign(payload, secretKey, options);
}
export const verifyToken = async ({ token, secretKey }) => {
    return jwt.verify(token, secretKey);
}
export const getSignature = ({ signatureLevel = signatureEnum.User }) => {
    let signature = { accessSignature: undefined, refreshSignature: undefined }
    switch (signatureLevel) {
        case signatureEnum.Admin:
            signature.accessSignature = JWT_SECRET_ADMIN;
            signature.refreshSignature = JWT_REFRESH_KEY_ADMIN;
            break;
        case signatureEnum.User:
            signature.accessSignature = JWT_SECRET_USER;
            signature.refreshSignature = JWT_REFRESH_KEY_USER;
            break;
        default:
            signature.accessSignature = JWT_SECRET_USER;
            signature.refreshSignature = JWT_REFRESH_KEY_USER;
            break;
    }
    return signature;
}
export const getNewLoginCredentials = async (user) => {
    // جلب المفاتيح السرية بناءً على دور المستخدم
    const signature = await getSignature({
        signatureLevel:
            user.role != roleEnum.Admin ? signatureEnum.User : signatureEnum.Admin
    });
    const jwtid = uuidv4();
    // إنشاء مفتاح وصول قصير الأمد
    const accessToken = await generateToken({
        payload: {
            id: user._id,
            role: user.role,
            provider: user.provider,
        },
        secretKey: signature.accessSignature,
        options: { expiresIn: JWT_EXPIRES_TIME , jwtid}
    });

    // إنشاء مفتاح تحديث طويل الأمد لتجنب تسجيل الدخول اليومي
    const refreshToken = await generateToken({
        payload: {
            id: user._id,
            role: user.role,
            provider: user.provider,
        },
        secretKey: signature.refreshSignature,
        options: { expiresIn: JWT_REFRESH_EXPIRES_TIME , jwtid }
    });

    return { accessToken, refreshToken };
}
