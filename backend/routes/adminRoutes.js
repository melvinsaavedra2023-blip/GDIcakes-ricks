const express = require("express");

const router = express.Router();

const {

    dashboard,
    obtenerClientes

} = require("../controllers/adminController");

//=========================
// DASHBOARD
//=========================

router.get(
    "/admin/dashboard",
    dashboard
);

//=========================
// CLIENTES
//=========================

router.get(
    "/clientes",
    obtenerClientes
);

module.exports = router;