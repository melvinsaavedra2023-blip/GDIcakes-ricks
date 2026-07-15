const multer = require("multer");
const path = require("path");

//=========================
// CONFIGURACIÓN
//=========================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, path.join(__dirname, "../uploads"));

    },

    filename: (req, file, cb) => {

        const nombre = Date.now() + path.extname(file.originalname);

        cb(null, nombre);

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