import { resolve } from 'path';
import dotenv from 'dotenv';

const envPath = {
    development: `.env.dev`,
    production: `.env.prod`
};
dotenv.config({ path: resolve(`./config/${envPath.development}`) });

export const PORT = process.env.PORT || 5000;
export const DB_URL = process.env.DB_URL;
export const SALT = parseInt(process.env.SALT);
export const ENCRYPTION_SECRET = process.env.ENCRYPTION_KEY;
