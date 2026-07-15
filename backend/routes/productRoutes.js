const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {

    obtenerProductos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    obtenerPedidos

} = require("../controllers/productController");

//=========================
// PRODUCTOS
//=========================

router.get("/productos", obtenerProductos);

router.post(
    "/productos",
    upload.single("imagen"),
    agregarProducto
);

router.put(
    "/productos/:id",
    upload.single("imagen"),
    editarProducto
);

router.delete("/productos/:id", eliminarProducto);

//=========================
// PEDIDOS
//=========================

router.get("/pedidos", obtenerPedidos);

module.exports = router;