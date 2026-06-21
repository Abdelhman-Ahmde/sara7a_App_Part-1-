import { CLIENT_ID } from "../../../config/config.service.js";
import { create, findOne, updateOne } from "../../DB/database.repositry.js";
import TokenModel from "../../DB/models/token.models.js";
import UserModel from "../../DB/models/user.models.js";
import { logoutAllKey, revokeTokenKey, set } from "../../DB/redis.service.js";
import { HashEnum } from "../../Utils/enums/security.enum.js";
import { logoutTypeEnum, providerEnum } from "../../Utils/enums/user.enum.js";
import { BadRequestException, ConflictException, NotFoundException } from "../../Utils/response/error.response.js";
import { successResponse } from "../../Utils/response/succes.response.js";
import { encrypt } from "../../Utils/security/encryption.security.js";
import { compareHash, generateHash } from "../../Utils/security/hash.security.js";
import { getNewLoginCredentials } from "../../Utils/tokens/token.js";
import { OAuth2Client } from 'google-auth-library';

// signup
export const signup = async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;
    // خطوة أمان لمنع احتكار أو تكرار الحسابات بنفس البريد الإلكتروني

    if (await findOne({ model: UserModel, filter: { email } }))
        throw ConflictException({ message: "User Is Exists" })

    // تأمين كلمة المرور حتى لا تُقرأ كنص صريح بواسطة المطورين أو المخترقين
    const hashedPassword = await generateHash({
        plainText: password,
        algo: HashEnum.ARGON2,
    });

    // تأمين رقم الهاتف وتشفيره لحماية الخصوصية
    const encryptedPhone = await encrypt({ plainText: phone });

    // إدخال بيانات المستخدم بصيغتها الآمنة إلى قاعدة البيانات
    const user = await create({
        model: UserModel,
        data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone: encryptedPhone
        }

    })

    // إرسال رد الإتمام بنجاح
    return successResponse({ res, statusCode: 201, message: "User Created Successfully", data: { user } })
}
// login
export const login = async (req, res) => {
    const { email, password } = req.body;

    // التأكد من أن البريد الإلكتروني مسجل بالفعل بالنظام
    const user = await findOne({ model: UserModel, filter: { email } })
    if (!user) throw NotFoundException({ message: "User Not Found" })

    // مطابقة الكلمة المدخلة بالمُخزنة المشفرة لضمان صحة المالك
    const isPasswordValid = await compareHash({
        plainText: password,
        cipherText: user.password,
        algo: HashEnum.ARGON2,
    });
    if (!isPasswordValid) throw BadRequestException({ message: "Invalid Email or Password" })

    // إصدار كل من الـ Access Token والـ Refresh Token لهذا المستخدم
    const credentials = await getNewLoginCredentials(user);

    // الرد الناجح للمستدعي
    return successResponse({ res, statusCode: 200, message: "User Logged In Successfully", data: { credentials } })
}
// refresh token
export const refreshToken = async (req, res) => {

    // تسليم التوكن الجديد في الاستجابة
    return successResponse({
        res,
        statusCode: 200,
        message: "User Logged In Successfully",
        data: { accessToken: req.accessToken }
    });
}
// verify google token
async function verifyGoogleToken({ idToken }) {
    const client = new OAuth2Client(CLIENT_ID);
    const ticket = await client.verifyIdToken({
        idToken,
        audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
}
// social login
export const googleLogin = async (req, res) => {
    const { idToken } = req.body;
    const { email, picture, given_name, family_name, email_verified } = await verifyGoogleToken({ idToken });
    if (!email_verified) throw BadRequestException({ message: "Email Not Verified" });
    const user = await findOne({ model: UserModel, filter: { email } })
    if (user) {
        //login
        if (user.provider === providerEnum.Google) {
            const credentials = await getNewLoginCredentials(user);
            return successResponse({
                res,
                statusCode: 200,
                message: "Login With Google Successfully",
                data: { credentials }
            })
        }
    }
    else {
        //create user
        const newUser = await create({
            model: UserModel,
            data: {
                firstName: given_name,
                lastName: family_name,
                email,
                profileImage: picture,
                provider: providerEnum.Google,
            },

        })
        const credentials = await getNewLoginCredentials(newUser);
        return successResponse({
            res,
            statusCode: 201,
            message: "User Created Successfully",
            data: { credentials, newUser }
        })
    }
}
// logout with ttl of mongoDB
export const logout = async (req, res) => {
    const { flag } = req.body;
    let status = 200;
    switch (flag) {
        case logoutTypeEnum.Logout:
            await create({
                model: TokenModel,
                data: {
                    userId: req.user._id,
                    jti: req.decodedToken.jti,
                    expiresIn: req.decodedToken.exp - Date.now(),
                }
            });
            status = 201;
            break;
        case logoutTypeEnum.LogoutAll:
            await updateOne({
                model: UserModel,
                filter: { _id: req.user.id },
                update: {
                    changeCredentialTime: Date.now(),
                }
            });
            status = 200;
            break;
    }

    return successResponse({
        res,
        statusCode: status,
        message: "User Logged Out Successfully",
    })
}
// logout with ttl of redis
export const logoutRedis = async (req, res) => {
    const { flag } = req.body;
    let status = 200;
    switch (flag) {
        case logoutTypeEnum.Logout:
            await set({
                key: revokeTokenKey({ userId: req.user._id, jti: req.decodedToken.jti }),
                value: req.decodedToken.jti,
                ttl: req.decodedToken.exp - Math.floor(Date.now() / 1000),
            });
            status = 201;
            break;
        // logout from all devices
        case logoutTypeEnum.LogoutAll:
            await set({
                key: logoutAllKey({userId: req.user._id}),
                value: Date.now(),
                ttl: null,
            });
            status = 200;
            break;
    }

    return successResponse({
        res,
        statusCode: status,
        message: "User Logged Out Successfully",
    })
}