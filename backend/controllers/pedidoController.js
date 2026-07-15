const sql = require("mssql");
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

//=========================
// ACTUALIZAR DATOS DEL CLIENTE
//=========================

await conexion.request()

    .input("correo", sql.VarChar, correo)
    .input("telefono", sql.VarChar, telefono)
    .input("direccion", sql.VarChar, direccion)

    .query(`

        UPDATE Clientes

        SET

            telefono = @telefono,
            direccion = @direccion

        WHERE correo = @correo

    `);

        const cliente = await conexion.request()

            .input("correo", sql.VarChar, correo)

            .query(`
                SELECT id_cliente
                FROM Clientes
                WHERE correo=@correo
            `);

        if (cliente.recordset.length === 0) {

            return res.status(404).json({

                success:false,
                mensaje:"Cliente no encontrado."

            });

        }

        const id_cliente = cliente.recordset[0].id_cliente;

        let total = 0;

        carrito.forEach(producto=>{

            total += producto.precio * producto.cantidad;

        });

        const pedido = await conexion.request()

            .input("id_cliente",sql.Int,id_cliente)
            .input("total",sql.Decimal(10,2),total)
            .input("estado",sql.VarChar,"Pendiente")
            .input("metodo_pago",sql.VarChar,metodo_pago)

            .query(`

                INSERT INTO Pedidos
                (
                    id_cliente,
                    total,
                    estado,
                    metodo_pago
                )

                OUTPUT INSERTED.id_pedido

                VALUES
                (
                    @id_cliente,
                    @total,
                    @estado,
                    @metodo_pago
                )

            `);

        const idPedido = pedido.recordset[0].id_pedido;

        for (const producto of carrito) {

            await conexion.request()

                .input("id_pedido", sql.Int, idPedido)
                .input("id_producto", sql.Int, producto.id_producto)
                .input("cantidad", sql.Int, producto.cantidad)
                .input("precio", sql.Decimal(10,2), producto.precio)
                .input("subtotal", sql.Decimal(10,2), producto.precio * producto.cantidad)

                .query(`
                    INSERT INTO DetallePedido
                    (
                        id_pedido,
                        id_producto,
                        cantidad,
                        precio,
                        subtotal
                    )
                    VALUES
                    (
                        @id_pedido,
                        @id_producto,
                        @cantidad,
                        @precio,
                        @subtotal
                    )
                `);

            await conexion.request()

                .input("cantidad", sql.Int, producto.cantidad)
                .input("id_producto", sql.Int, producto.id_producto)

                .query(`
                    UPDATE Productos
                    SET stock = stock - @cantidad
                    WHERE id_producto = @id_producto
                `);

        }

        res.json({

            success:true,
            mensaje:"Pedido registrado correctamente."

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success:false,
            mensaje:"Error interno."

        });

    }

};

//=========================
// DETALLE DEL PEDIDO
//=========================

const obtenerDetallePedido = async (req,res)=>{

    try{

        const { id } = req.params;

        const conexion = await getConnection();

        const resultado = await conexion.request()

        .input("id",sql.Int,id)

        .query(`

        SELECT

        p.nombre,
        p.imagen,
        d.cantidad,
        d.precio,
        d.subtotal

        FROM DetallePedido d

        INNER JOIN Productos p

        ON d.id_producto=p.id_producto

        WHERE d.id_pedido=@id

        `);

        res.json(resultado.recordset);

    }catch(error){

        console.log(error);

        res.status(500).json({

            success:false

        });

    }

};

//=========================
// CAMBIAR ESTADO
//=========================

const cambiarEstadoPedido = async(req,res)=>{

    try{

        const { id } = req.params;

        const { estado } = req.body;

        const conexion = await getConnection();

        await conexion.request()

        .input("id",sql.Int,id)
        .input("estado",sql.VarChar,estado)

        .query(`

        UPDATE Pedidos

        SET estado=@estado

        WHERE id_pedido=@id

        `);

        res.json({

            success:true

        });

    }catch(error){

        console.log(error);

        res.status(500).json({

            success:false

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

        const resultado = await conexion.request()

            .input("correo", sql.VarChar, correo)

            .query(`

                SELECT

    p.id_pedido,
    p.fecha,
    p.total,
    p.estado,
    p.metodo_pago

FROM Pedidos p

                INNER JOIN Clientes c

                ON p.id_cliente = c.id_cliente

                WHERE c.correo = @correo

                ORDER BY p.fecha DESC

            `);

        res.json({

            success: true,

            pedidos: resultado.recordset

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

        const resultado = await conexion.request()

            .input("id", sql.Int, id)

            .query(`

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

                FROM Pedidos p

                INNER JOIN Clientes c

                ON p.id_cliente = c.id_cliente

                WHERE p.id_pedido=@id

            `);

        if (resultado.recordset.length === 0) {

            return res.status(404).json({

                success:false

            });

        }

        res.json({

            success:true,

            pedido:resultado.recordset[0]

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success:false

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