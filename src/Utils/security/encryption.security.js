import crypto from "node:crypto";
import { ENCRYPTION_SECRET } from "../../../config/config.service.js";


const IV_LENGTH = 16;
const ENCRYPTION_SECRET_KEY = ENCRYPTION_SECRET;

export const encrypt = async ({
    plainText,
}) => {
    // توليد متجه عشوائي لمنع تطابق الرسائل المشفَرة لذات النص
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_SECRET_KEY, iv);

    // تحويل النص للحالة المُشفرة
    let encrypted = cipher.update(plainText, "utf-8", "hex");
    encrypted += cipher.final("hex");

    // دمج المتجه مع النص لتيسير فك التشفير لاحقاً
    return `${iv.toString("hex")}:${encrypted}`;
}

export const decrypt = async ({ encryptedData }) => {
    // فصل المتجه (IV) للبدء بالفك
    const [iv, encryptedText] = encryptedData.split(":");
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_SECRET_KEY, Buffer.from(iv, "hex"));

    // إرجاع النص لصيغة الحروف الطبيعية (utf-8)
    let decrypted = decipher.update(encryptedText, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
}
