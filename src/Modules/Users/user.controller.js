import { Router } from "express";
import * as UserService from "./user.service.js";
import { authenticationAccess, authorization } from "../../Middlewares/auth.middleware.js";
import { roleEnum, tokenTypeEnum } from "../../Utils/enums/user.enum.js";
import { fileValidation, localFileUpload } from "../../Utils/multer/local.upload.js";
import { updateCoverPicSchema, updateProfilePicSchema } from "./user.validation.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";

const router = Router();
router.get(
    "/",
    authenticationAccess({ tokenType: tokenTypeEnum.Access }),
    authorization({ accessRoles: [roleEnum.Admin, roleEnum.User] }),
    UserService.getProfile
);
router.patch(
    "/update-profile-image",
    authenticationAccess({ tokenType: tokenTypeEnum.Access }),
    authorization({ accessRoles: [roleEnum.Admin, roleEnum.User] }),
    localFileUpload({
        customPath: "User",
        validation: [...fileValidation.image],
    }).single("attachment"),
    validationMiddleware(updateProfilePicSchema),
    UserService.updateProfileImage
);
router.patch(
    "/update-cover-images",
    authenticationAccess({ tokenType: tokenTypeEnum.Access }),
    authorization({ accessRoles: [roleEnum.Admin, roleEnum.User] }),
    localFileUpload({
        customPath: "User",
        validation: [...fileValidation.image]
    }).array("attachments", 6),
    validationMiddleware(updateCoverPicSchema), 
    UserService.updateCoverImages
);

export default router;