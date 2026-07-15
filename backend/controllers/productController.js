const { getConnection } = require("../config/db");

//=========================
// OBTENER PRODUCTOS
//=========================

const obtenerProductos = async (req, res) => {

    try {

        const db = await getConnection();

        const resultado = await db.query(`
            SELECT
                id_producto,
                nombre,
                descripcion,
                precio,
                stock,
                imagen,
                estado,
                id_categoria
            FROM productos
            WHERE estado = true
            ORDER BY id_producto DESC
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

//=========================
// AGREGAR PRODUCTO
//=========================

const agregarProducto = async (req, res) => {

    try {

        const {
            nombre,
            descripcion,
            precio,
            stock,
            id_categoria
        } = req.body;

        const imagen = req.file
            ? req.file.filename
            : "cake.png";

        console.log("BODY:", req.body);
        console.log("ID CATEGORIA:", id_categoria);
        console.log("FILE:", req.file);

        const db = await getConnection();

        console.log({
            nombre,
            descripcion,
            precio,
            stock,
            imagen,
            id_categoria
        });

        await db.query(

            `
            INSERT INTO productos
            (
                nombre,
                descripcion,
                precio,
                stock,
                imagen,
                estado,
                id_categoria
            )
            VALUES
            (
                $1,$2,$3,$4,$5,true,$6
            )
            `,

            [
                nombre,
                descripcion,
                precio,
                stock,
                imagen,
                id_categoria
            ]

        );

        res.json({

            success: true,
            mensaje: "Producto registrado correctamente."

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
// EDITAR PRODUCTO
//=========================

const editarProducto = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            nombre,
            descripcion,
            precio,
            stock,
            id_categoria
        } = req.body;

        const db = await getConnection();

        // Obtener la imagen actual

        const productoActual = await db.query(

            `
            SELECT imagen
            FROM productos
            WHERE id_producto = $1
            `,

            [id]

        );

        if (productoActual.rows.length === 0) {

            return res.status(404).json({

                success: false,
                mensaje: "Producto no encontrado."

            });

        }

        // Conservar la imagen anterior si no se sube una nueva

        const imagen = req.file
            ? req.file.filename
            : productoActual.rows[0].imagen;

        await db.query(

            `
            UPDATE productos

            SET

                nombre = $1,
                descripcion = $2,
                precio = $3,
                stock = $4,
                imagen = $5,
                id_categoria = $6

            WHERE id_producto = $7
            `,

            [
                nombre,
                descripcion,
                precio,
                stock,
                imagen,
                id_categoria,
                id
            ]

        );

        res.json({

            success: true,
            mensaje: "Producto actualizado correctamente."

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
// ELIMINAR PRODUCTO
//=========================

const eliminarProducto = async (req, res) => {

    try {

        const { id } = req.params;

        const conexion = await getConnection();

        await conexion.request()

            .input("id", id)

            .query(`
                DELETE FROM Productos
                WHERE id_producto=@id
            `);

        res.json({

            success:true

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success:false

        });

    }

};

//=========================
// OBTENER PEDIDOS
//=========================

const obtenerPedidos = async (req, res) => {

    try {

        const db = await getConnection();

        const resultado = await db.query(`

            SELECT

                p.id_pedido,

                c.nombre || ' ' || c.apellido AS cliente,

                c.telefono,

                c.correo,

                c.direccion,

                p.fecha,

                p.total,

                p.estado,

                p.metodo_pago

            FROM pedidos p

            INNER JOIN clientes c

            ON p.id_cliente = c.id_cliente

            ORDER BY

            CASE p.estado

                WHEN 'Pendiente' THEN 1
                WHEN 'Preparando' THEN 2
                WHEN 'Enviado' THEN 3
                WHEN 'Entregado' THEN 4

                ELSE 5

            END,

            p.id_pedido DESC

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

    obtenerProductos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    obtenerPedidos

};