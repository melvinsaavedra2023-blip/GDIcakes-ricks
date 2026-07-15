const express = require("express");

const router = express.Router();

const {
    login,
    registrar
} = require("../controllers/authController");
console.log({ login, registrar });

// LOGIN
router.post("/login", login);

// REGISTRO
router.post("/registro", registrar);

module.exports = router;