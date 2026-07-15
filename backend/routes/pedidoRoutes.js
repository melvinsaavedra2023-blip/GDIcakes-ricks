const express = require("express");

const router = express.Router();

const {

    registrarPedido,
    obtenerDetallePedido,
    cambiarEstadoPedido,
    obtenerMisPedidos,
    obtenerInfoPedido

} = require("../controllers/pedidoController");

//=========================
// REGISTRAR PEDIDO
//=========================

router.post(
    "/pedidos",
    registrarPedido
);

//=========================
// INFORMACIÓN DEL PEDIDO
//=========================

router.get(
    "/pedidos/info/:id",
    obtenerInfoPedido
);

//=========================
// DETALLE PEDIDO
//=========================

router.get(
    "/pedidos/:id",
    obtenerDetallePedido
);

//=========================
// CAMBIAR ESTADO
//=========================

router.put(
    "/pedidos/:id",
    cambiarEstadoPedido
);

//=========================
// MIS PEDIDOS
//=========================

router.get(
    "/mis-pedidos/:correo",
    obtenerMisPedidos
);

module.exports = router;