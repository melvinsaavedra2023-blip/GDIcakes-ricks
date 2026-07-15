const sql = require("mssql");
const { getConnection } = require("../config/db");

// ==========================
// OBTENER PERFIL
// ==========================
const obtenerPerfil = async (req, res) => {

    try {

        const { id_usuario } = req.params;

        const conexion = await getConnection();

        const resultado = await conexion.request()

            .input("id_usuario", sql.Int, id_usuario)

            .query(`

                SELECT

id_usuario,
nombre,
apellido,
correo,
usuario,
contrasena,
login_google

FROM Usuarios

                WHERE id_usuario = @id_usuario

            `);

        if (resultado.recordset.length === 0) {

            return res.status(404).json({

                success: false,
                mensaje: "Usuario no encontrado."

            });

        }

        res.json({

            success: true,
            usuario: resultado.recordset[0]

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            mensaje: "Error interno."

        });

    }

};

// ==========================
// ACTUALIZAR PERFIL
// ==========================
const actualizarPerfil = async (req, res) => {

    try {

        const { id_usuario } = req.params;

        const {

            nombre,
            apellido,
            usuario

        } = req.body;

        const conexion = await getConnection();

        await conexion.request()

            .input("id_usuario", sql.Int, id_usuario)
            .input("nombre", sql.VarChar, nombre)
            .input("apellido", sql.VarChar, apellido)
            .input("usuario", sql.VarChar, usuario)

            .query(`

                UPDATE Usuarios

                SET

                    nombre=@nombre,
                    apellido=@apellido,
                    usuario=@usuario

                WHERE id_usuario=@id_usuario

            `);

        res.json({

            success: true,
            mensaje: "Perfil actualizado correctamente."

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            mensaje: "Error al actualizar."

        });

    }

};

module.exports = {

    obtenerPerfil,
    actualizarPerfil

};