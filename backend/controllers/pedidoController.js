
const { getConnection } = require("../config/db");

//=========================
// REGISTRAR PEDIDO
//=========================

const registrarPedido = async (req, res) => {

    try {

        const {
            correo,
            telefono,
            direccion,
            carrito,
            metodo_pago
        } = req.body;

        const conexion = await getConnection();

        // Actualizar datos del cliente
        await conexion.query(
            `
            UPDATE clientes
            SET telefono=$1,
                direccion=$2
            WHERE correo=$3
            `,
            [telefono, direccion, correo]
        );

        // Buscar cliente
        const cliente = await conexion.query(
            `
            SELECT id_cliente
            FROM clientes
            WHERE correo=$1
            `,
            [correo]
        );

        if (cliente.rows.length === 0) {

            return res.status(404).json({

                success:false,
                mensaje:"Cliente no encontrado."

            });

        }

        const id_cliente = cliente.rows[0].id_cliente;

        let total = 0;

        carrito.forEach(producto=>{

            total += producto.precio * producto.cantidad;

        });

        // Registrar pedido
        const pedido = await conexion.query(

            `
            INSERT INTO pedidos
            (
                id_cliente,
                total,
                estado,
                metodo_pago
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
            RETURNING id_pedido
            `,

            [
                id_cliente,
                total,
                "Pendiente",
                metodo_pago
            ]

        );

        const idPedido = pedido.rows[0].id_pedido;

        for(const producto of carrito){

            await conexion.query(

                `
                INSERT INTO detallepedido
                (
                    id_pedido,
                    id_producto,
                    cantidad,
                    precio,
                    subtotal
                )
                VALUES
                (
                    $1,$2,$3,$4,$5
                )
                `,

                [
                    idPedido,
                    producto.id_producto,
                    producto.cantidad,
                    producto.precio,
                    producto.precio * producto.cantidad
                ]

            );

            await conexion.query(

                `
                UPDATE productos
                SET stock = stock - $1
                WHERE id_producto=$2
                `,

                [
                    producto.cantidad,
                    producto.id_producto
                ]

            );

        }

        res.json({

            success:true,
            mensaje:"Pedido registrado correctamente."

        });

    } catch (error) {

    console.error("========== ERROR PEDIDO ==========");
    console.error(error);
    console.error(error.message);
    console.error(error.stack);

    return res.status(500).json({

        success: false,
        mensaje: error.message

    });

}
};
//=========================
// DETALLE DEL PEDIDO
//=========================

const obtenerDetallePedido = async (req, res) => {

    try {

        const { id } = req.params;

        const conexion = await getConnection();

        const resultado = await conexion.query(

            `
            SELECT

                p.nombre,
                p.imagen,
                d.cantidad,
                d.precio,
                d.subtotal

            FROM detallepedido d

            INNER JOIN productos p
            ON d.id_producto = p.id_producto

            WHERE d.id_pedido = $1
            `,

            [id]

        );

        res.json(resultado.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false

        });

    }

};

//=========================
// CAMBIAR ESTADO
//=========================

const cambiarEstadoPedido = async (req, res) => {

    try {

        const { id } = req.params;
        const { estado } = req.body;

        const conexion = await getConnection();

        await conexion.query(

            `
            UPDATE pedidos
            SET estado = $1
            WHERE id_pedido = $2
            `,

            [
                estado,
                id
            ]

        );

        res.json({

            success: true

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false

        });

    }

};
//=========================
// MIS PEDIDOS
//=========================

const obtenerMisPedidos = async (req, res) => {

    try {

        const { correo } = req.params;

        const conexion = await getConnection();

        const resultado = await conexion.query(

            `
            SELECT

                p.id_pedido,
                p.fecha,
                p.total,
                p.estado,
                p.metodo_pago

            FROM pedidos p

            INNER JOIN clientes c

            ON p.id_cliente = c.id_cliente

            WHERE c.correo = $1

            ORDER BY p.fecha DESC
            `,

            [correo]

        );

        res.json({

            success: true,

            pedidos: resultado.rows

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            mensaje: "Error interno."

        });

    }

};
//=========================
// INFORMACIÓN DEL PEDIDO
//=========================

const obtenerInfoPedido = async (req, res) => {

    try {

        const { id } = req.params;

        const conexion = await getConnection();

        const resultado = await conexion.query(

            `
            SELECT

                p.id_pedido,
                p.fecha,
                p.total,
                p.estado,
                p.metodo_pago,
                c.nombre,
                c.apellido,
                c.telefono,
                c.direccion

            FROM pedidos p

            INNER JOIN clientes c

            ON p.id_cliente = c.id_cliente

            WHERE p.id_pedido = $1
            `,

            [id]

        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({

                success: false

            });

        }

        res.json({

            success: true,

            pedido: resultado.rows[0]

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false

        });

    }

};
module.exports = {

    registrarPedido,
    obtenerDetallePedido,
    cambiarEstadoPedido,
    obtenerMisPedidos,
    obtenerInfoPedido

};