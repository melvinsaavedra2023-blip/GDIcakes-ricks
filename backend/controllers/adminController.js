const { getConnection } = require("../config/db");

//=========================
// DASHBOARD
//=========================

const dashboard = async (req, res) => {

    try {

        const db = await getConnection();

        const ventas = await db.query(`
            SELECT COALESCE(SUM(total),0) AS total
            FROM pedidos
        `);

        const pedidos = await db.query(`
            SELECT COUNT(*) AS total
            FROM pedidos
            WHERE estado = 'Pendiente'
        `);

        const clientes = await db.query(`
            SELECT COUNT(*) AS total
            FROM usuarios
            WHERE rol = 'Cliente'
        `);

        const productos = await db.query(`
            SELECT COUNT(*) AS total
            FROM productos
        `);

        res.json({

            ventas: Number(ventas.rows[0].total),
            pedidos: Number(pedidos.rows[0].total),
            clientes: Number(clientes.rows[0].total),
            productos: Number(productos.rows[0].total)

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            mensaje: error.message

        });

    }

};

//=========================
// OBTENER CLIENTES
//=========================

const obtenerClientes = async (req, res) => {

    try {

        const db = await getConnection();

        const resultado = await db.query(`

            SELECT

                id_cliente,
                nombre,
                apellido,
                correo,
                telefono,
                fecha_registro

            FROM clientes

            ORDER BY id_cliente DESC

        `);

        res.json(resultado.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            mensaje: error.message

        });

    }

};

module.exports = {

    dashboard,
    obtenerClientes

};