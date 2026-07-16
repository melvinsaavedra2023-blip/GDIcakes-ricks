const { getConnection } = require("../config/db");

//=========================
// OBTENER PRODUCTOS
//=========================
const obtenerProductos = async (req, res) => {
    try {

        const db = await getConnection();

        const result = await db.query(`
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

        res.json(result.rows);

    } catch (error) {
        console.error("ERROR OBTENER PRODUCTOS:", error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener productos"
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

        let imagen = "assets/images/cake.png";

        if (req.file && req.file.path) {
            imagen = req.file.path;
        }

        const db = await getConnection();

        await db.query(`
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
            VALUES ($1,$2,$3,$4,$5,true,$6)
        `, [
            nombre,
            descripcion,
            precio,
            stock,
            imagen,
            id_categoria
        ]);

        res.json({
            success: true,
            mensaje: "Producto creado correctamente"
        });

    } catch (error) {
        console.error("ERROR AGREGAR PRODUCTO:", error);
        res.status(500).json({
            success: false,
            mensaje: "Error al crear producto"
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

        const actual = await db.query(`
            SELECT imagen
            FROM productos
            WHERE id_producto = $1
        `, [id]);

        if (actual.rows.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Producto no encontrado"
            });
        }

        let imagen = actual.rows[0].imagen;

        // 🔥 ARREGLA IMÁGENES ANTIGUAS (FRAPPÉ)
        if (!imagen || !imagen.startsWith("http")) {
            imagen = "assets/images/cake.png";
        }

        // 🔥 SOLO SI SUBE NUEVA
        if (req.file && req.file.path) {
            imagen = req.file.path;
        }

        await db.query(`
            UPDATE productos
            SET
                nombre = $1,
                descripcion = $2,
                precio = $3,
                stock = $4,
                imagen = $5,
                id_categoria = $6
            WHERE id_producto = $7
        `, [
            nombre,
            descripcion,
            precio,
            stock,
            imagen,
            id_categoria,
            id
        ]);

        res.json({
            success: true,
            mensaje: "Producto actualizado correctamente"
        });

    } catch (error) {
        console.error("ERROR EDITAR PRODUCTO:", error);
        res.status(500).json({
            success: false,
            mensaje: "Error al actualizar producto"
        });
    }
};


//=========================
// ELIMINAR PRODUCTO (SOFT DELETE)
//=========================
const eliminarProducto = async (req, res) => {
    try {

        const { id } = req.params;

        const db = await getConnection();

        await db.query(`
            UPDATE productos
            SET estado = false
            WHERE id_producto = $1
        `, [id]);

        res.json({
            success: true,
            mensaje: "Producto eliminado correctamente"
        });

    } catch (error) {
        console.error("ERROR ELIMINAR PRODUCTO:", error);
        res.status(500).json({
            success: false,
            mensaje: "Error al eliminar producto"
        });
    }
};


//=========================
// OBTENER PEDIDOS
//=========================
const obtenerPedidos = async (req, res) => {
    try {

        const db = await getConnection();

        const result = await db.query(`
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

        res.json(result.rows);

    } catch (error) {
        console.error("ERROR PEDIDOS:", error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener pedidos"
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