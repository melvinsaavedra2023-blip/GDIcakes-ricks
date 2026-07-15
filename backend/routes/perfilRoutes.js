const express = require("express");

const router = express.Router();

const {

    obtenerPerfil,
    actualizarPerfil

} = require("../controllers/perfilController");

// ==========================
// OBTENER PERFIL
// ==========================

router.get("/perfil/:id_usuario", obtenerPerfil);

// ==========================
// ACTUALIZAR PERFIL
// ==========================

router.put("/perfil/:id_usuario", actualizarPerfil);

module.exports = router;