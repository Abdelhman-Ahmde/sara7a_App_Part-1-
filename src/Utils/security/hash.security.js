import { hash, compare } from "bcrypt";
import * as argon2 from "argon2";
import { SALT } from "../../../config/config.service.js";
import { HashEnum } from "../enums/security.enum.js";

export const generateHash = async ({
    plainText,
    salt = SALT,
    algo = HashEnum.BCRYPT,
}) => {
    let hashResult = "";
    switch (algo) {
        case HashEnum.BCRYPT:
            hashResult = await hash(plainText, salt);
            break;
        case HashEnum.ARGON2:
            hashResult = await argon2.hash(plainText);
            break;
        default:
            hashResult = await hash(plainText, salt);
            break;
    }
    return hashResult;
}

export const compareHash = async ({
    plainText,
    cipherText,
    algo = HashEnum.BCRYPT,
}) => {
    let match = false;
    switch (algo) {
        case HashEnum.BCRYPT:
            match = await compare(plainText, cipherText);
            break;
        case HashEnum.ARGON2:
            match = await argon2.verify(cipherText, plainText);
            break;
        default:
            match = await compare(plainText, cipherText);
            break;
    }
    return match;
}
