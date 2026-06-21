import { resolve } from 'path';
import dotenv from 'dotenv';

// تحديد مسار ملفات البيئة بناءً على حالة التطبيق (تطوير أو إنتاج)
const envPath = {
    development: `.env.dev`,
    production: `.env.prod`
};
// تحميل المتغيرات البيئية من الملف المحدد
dotenv.config({ path: resolve(`./config/${envPath.development}`) });

export const PORT = process.env.PORT || 5000;
export const DB_URL = process.env.DB_URL;
export const SALT = parseInt(process.env.SALT);
export const ENCRYPTION_SECRET = process.env.ENCRYPTION_KEY;

// متعلقات المصادقة للمستخدمين العاديين
export const JWT_SECRET_USER = process.env.JWT_SECRET_USER_KEY;
export const JWT_REFRESH_KEY_USER = process.env.JWT_REFRESH_SECRET_USER_KEY;

// متعلقات المصادقة للمسؤولين
export const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN_KEY;
export const JWT_REFRESH_KEY_ADMIN = process.env.JWT_REFRESH_SECRET_ADMIN_KEY;

export const JWT_EXPIRES_TIME = process.env.JWT_EXPIRES;
export const JWT_REFRESH_EXPIRES_TIME = process.env.JWT_REFRESH_EXPIRES;
//social login
export const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
//redis
export const REDIS_URL = process.env.REDIS_URL;
