const multer = require("multer");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");

//=========================
// CLOUDINARY STORAGE
//=========================

const storage = new CloudinaryStorage({

    cloudinary,

    params: {

        folder: "cakes-ricks",

        allowed_formats: [

            "jpg",
            "jpeg",
            "png",
            "webp"

        ]

    }

});

//=========================
// VALIDAR IMÁGENES
//=========================

const fileFilter = (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {

        cb(null, true);

    } else {

        cb(new Error("Solo se permiten imágenes."), false);

    }

};

//=========================
// MULTER
//=========================

const upload = multer({

    storage,
    fileFilter

});

module.exports = upload;