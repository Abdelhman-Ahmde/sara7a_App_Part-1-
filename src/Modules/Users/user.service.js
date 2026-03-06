import * as dbService from "../../DB/database.repositry.js";
import { successResponse } from "../../Utils/response/succes.response.js";
import { NotFoundException } from "../../Utils/response/error.response.js";
import { decrypt } from "../../Utils/security/encryption.security.js";
import UserModel from "../../DB/models/user.models.js";

export const getProfile = async (req, res) => {
    const { id } = req.params;
    const user = await dbService.findById({ model: UserModel, id: id })
    if (user) {
        user.phone = await decrypt({ encryptedData: user.phone })
    }
    if (!user) throw NotFoundException({ message: "User Not Found" })
    return successResponse({ res, data: { user }, message: "Done", statusCode: 200 })
}