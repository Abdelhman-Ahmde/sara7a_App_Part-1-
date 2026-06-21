import joi from "joi";
import { generalFields } from "../../Middlewares/validation.middleware.js";
import { fileValidation } from "../../Utils/multer/local.upload.js";

export const updateProfilePicSchema = {
    file: joi.object({
        fieldname: generalFields.file.fieldname.valid("attachment").required(),
        originalname: generalFields.file.originalname.required(),
        encoding: generalFields.file.encoding.required(),
        mimetype: generalFields.file.mimetype.valid(...fileValidation.image).required(),
        size: generalFields.file.size.max(1024 * 1024 * 5).required(),
        destination: generalFields.file.destination.required(),
        filename: generalFields.file.filename.required(),
        path: generalFields.file.path.required(),
        fieldPath: generalFields.file.fieldPath.required()
    }).required()
}

export const updateCoverPicSchema = {
    files: joi.array().items(joi.object({
        fieldname: generalFields.file.fieldname.valid("attachments").required(),
        originalname: generalFields.file.originalname.required(),
        encoding: generalFields.file.encoding.required(),
        mimetype: generalFields.file.mimetype.valid(...fileValidation.image).required(),
        size: generalFields.file.size.max(1024 * 1024 * 5).required(),
        destination: generalFields.file.destination.required(),
        filename: generalFields.file.filename.required(),
        path: generalFields.file.path.required(),
        fieldPath: generalFields.file.fieldPath.required()
    })).required()
}

