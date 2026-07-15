const { getConnection } = require("../config/db");

//=========================
// OBTENER PRODUCTOS
//=========================

const obtenerProductos = async (req, res) => {

    try {

        const conexion = await getConnection();

        const resultado = await conexion.request().query(`
            SELECT
                id_producto,
                nombre,
                descripcion,
                precio,
                stock,
                imagen,
                estado,
                id_categoria
            FROM Productos
            WHERE estado = 1
            ORDER BY id_producto DESC
        `);

        res.json(resultado.recordset);

    } catch (error) {

        console.log(error);

        res.status(500).json({
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

        const imagen = req.file ? req.file.filename : "cake.png";

        const conexion = await getConnection();

        await conexion.request()

            .input("nombre", nombre)
            .input("descripcion", descripcion)
            .input("precio", precio)
            .input("stock", stock)
            .input("imagen", imagen)
            .input("id_categoria", id_categoria)

            .query(`
                INSERT INTO Productos
                (nombre,descripcion,precio,stock,imagen,estado,id_categoria)
                VALUES
                (@nombre,@descripcion,@precio,@stock,@imagen,1,@id_categoria)
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

        const conexion = await getConnection();

        // Obtener la imagen actual
        const productoActual = await conexion.request()

            .input("id", id)

            .query(`

                SELECT imagen

                FROM Productos

                WHERE id_producto=@id

            `);

        if (productoActual.recordset.length === 0) {

            return res.status(404).json({

                success: false,
                mensaje: "Producto no encontrado."

            });

        }

        // Si el usuario seleccionó una imagen nueva, usarla.
        // Si no, conservar la imagen anterior.

        const imagen = req.file
            ? req.file.filename
            : productoActual.recordset[0].imagen;

        await conexion.request()

            .input("id", id)
            .input("nombre", nombre)
            .input("descripcion", descripcion)
            .input("precio", precio)
            .input("stock", stock)
            .input("imagen", imagen)
            .input("id_categoria", id_categoria)

            .query(`

                UPDATE Productos

                SET

                    nombre=@nombre,
                    descripcion=@descripcion,
                    precio=@precio,
                    stock=@stock,
                    imagen=@imagen,
                    id_categoria=@id_categoria

                WHERE id_producto=@id

            `);

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

const obtenerPedidos = async (req,res)=>{

    try{

        const conexion = await getConnection();

        const resultado = await conexion.request()

.query(`

SELECT

    p.id_pedido,

    c.nombre + ' ' + c.apellido AS cliente,

    c.telefono,

    c.correo,

    c.direccion,

    p.fecha,

    p.total,

    p.estado,

    p.metodo_pago

FROM Pedidos p

INNER JOIN Clientes c

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

        res.json(resultado.recordset);

    }catch(error){

        console.log(error);

        res.status(500).json({

            success:false

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