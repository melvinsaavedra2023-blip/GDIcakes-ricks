const { getConnection } = require("../config/db");

//=========================
// DASHBOARD
//=========================

const dashboard = async (req, res) => {

    try {

        const conexion = await getConnection();

        const ventas = await conexion.request().query(`
            SELECT ISNULL(SUM(total),0) AS total
            FROM Pedidos
        `);

        const pedidos = await conexion.request().query(`
    SELECT COUNT(*) AS total
    FROM Pedidos
    WHERE estado='Pendiente'
`);

        const clientes = await conexion.request().query(`
    SELECT COUNT(*) AS total
    FROM Usuarios
    WHERE rol='Cliente'
`);

        const productos = await conexion.request().query(`
            SELECT COUNT(*) AS total
            FROM Productos
        `);

        res.json({

            ventas: ventas.recordset[0].total,
            pedidos: pedidos.recordset[0].total,
            clientes: clientes.recordset[0].total,
            productos: productos.recordset[0].total

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: "Error al cargar dashboard"

        });

    }

};

//=========================
// OBTENER CLIENTES
//=========================

const obtenerClientes = async (req, res) => {

    try {

        const conexion = await getConnection();

        const resultado = await conexion.request().query(`

            SELECT

                id_cliente,
                nombre,
                apellido,
                correo,
                telefono,
                fecha_registro

            FROM Clientes

            ORDER BY id_cliente DESC

        `);

        res.json(resultado.recordset);

    } catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: "Error al obtener clientes"

        });

    }

};

module.exports = {

    dashboard,
    obtenerClientes

};