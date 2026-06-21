import multer from "multer";
import path from "node:path";
import fs from "node:fs";


export const fileValidation = {
    image: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg"],
    video: ["video/mp4", "video/mpeg", "video/avi"],
    document: ["application/pdf", "application/msword", "application/zip"],
}

export const localFileUpload = ({
    customPath = "general",
    validation = []
}) => {
    const basePath = `uploads/${customPath}`;
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            let userBasePath = basePath;
            if(req.user?._id) userBasePath += `/${req.user._id.toString()}`;
            const fullPath = path.resolve(`./src/${userBasePath}`);
            if(!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, {recursive: true});
            cb(null, path.resolve(fullPath));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-'+file.originalname;
            file.fieldPath = `/${basePath}/${req.user?._id}/${uniqueSuffix}`
            cb(null, uniqueSuffix);
        }
    });

    const fileFilter = (req, file,cb) => {
        if(validation.includes(file.mimetype)){
            cb(null, true);
        }else{
            return cb(new Error("Invalid file type"));
        }
    }
    return multer({ fileFilter,storage });
}

