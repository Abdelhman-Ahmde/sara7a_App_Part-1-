import { decrypt } from "../../Utils/security/encryption.security.js";
import { successResponse } from "../../Utils/response/succes.response.js";
import { BadRequestException } from "../../Utils/response/error.response.js";
import { findByIdAndUpdate } from "../../DB/database.repositry.js";
import UserModel from "../../DB/models/user.models.js";

export const getProfile = async (req, res) => {
    let { phone } = req.user;
    phone = await decrypt({ encryptedData: phone });
    req.user.phone = phone;
    return successResponse({ res, data: req.user, message: "Done", statusCode: 200 })
}

export const updateProfileImage = async (req, res) => {
    const user = await findByIdAndUpdate({ model: UserModel, id: req.user._id, update: { profileImage: req.file.fieldname } });
    const { file } = req;
    if (!file) throw new BadRequestException("File is required");
    return successResponse({
        res,
        data: { user },
        message: "File uploaded successfully",
        statusCode: 200
    })
}

export const updateCoverImages = async (req, res) => {
    const user = await findByIdAndUpdate({
        model: UserModel,
        id: req.user._id,
        update: { coverImages: req.files?.map((file) => file.fieldname) }
    });
    const { files } = req;
    if (!files) throw new BadRequestException("File is required");
    return successResponse({
        res,
        data: { user },
        message: "File uploaded successfully",
        statusCode: 200
    })
}