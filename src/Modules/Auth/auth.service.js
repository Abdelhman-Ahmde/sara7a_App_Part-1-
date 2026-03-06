import { create, findOne } from "../../DB/database.repositry.js";
import UserModel from "../../DB/models/user.models.js";
import { HashEnum } from "../../Utils/enums/security.enum.js";
import { ConflictException, NotFoundException } from "../../Utils/response/error.response.js";
import { successResponse } from "../../Utils/response/succes.response.js";
import { encrypt } from "../../Utils/security/encryption.security.js";
import { generateHash } from "../../Utils/security/hash.security.js";
//signup
export const signup = async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;
    //check if user is exists
    const user = await findOne({ model: UserModel, filter: { email } })
    if (user)
        throw ConflictException({ message: "User Is Exists" })
    //hach password
    const hashedPassword = await generateHash({
        plainText: password,
        algo: HashEnum.ARGON2,
    });
    //encrypt phone
    const encryptedPhone = await encrypt({ plainText: phone });
    //create user
    const newUser = await create({ model: UserModel, data: { firstName, lastName, email, password: hashedPassword, phone: encryptedPhone } })
    //return user
    return successResponse({ res, statusCode: 201, message: "User Created Successfully", data: { newUser } })
}
//login
export const login = async (req, res) => {
    const { email, password } = req.body;
    //check if user is exists
    const user = await findOne({ model: UserModel, filter: { email, password } })
    if (!user) throw NotFoundException({ message: "User Not Found" })

    //return user
    return successResponse({ res, statusCode: 200, message: "User Logged In Successfully", data: { user } })
}
