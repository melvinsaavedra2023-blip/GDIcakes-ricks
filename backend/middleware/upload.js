const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

//=========================
// CLOUDINARY STORAGE
//=========================

const storage = new CloudinaryStorage({

    cloudinary,

    params: async (req, file) => {

        return {
            folder: "cakes-ricks",

            resource_type: "image",

            allowed_formats: ["jpg", "jpeg", "png", "webp"],

            // 🔥 NOMBRE ÚNICO (EVITA SOBREESCRIBIR)
            public_id: Date.now() + "-" + file.originalname
        };
    }

});

//=========================
// VALIDAR IMÁGENES
//=========================

const fileFilter = (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten imágenes"), false);
    }

};

//=========================
// MULTER CONFIG
//=========================

const upload = multer({

    storage,
    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024 // 🔥 5MB límite
    }

});

module.exports = upload;