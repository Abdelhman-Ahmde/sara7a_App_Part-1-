import crypto from "node:crypto";
import { ENCRYPTION_SECRET } from "../../../config/config.service.js";


const IV_LENGTH = 16;
const ENCRYPTION_SECRET_KEY = ENCRYPTION_SECRET;

export const encrypt = async ({
    plainText,
}) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_SECRET_KEY, iv);
    let encrypted = cipher.update(plainText, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
}

export const decrypt = async ({ encryptedData }) => {
    const [iv, encryptedText] = encryptedData.split(":");
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_SECRET_KEY, Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encryptedText, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
}