const { getConnection } = require("../config/db");

// ==========================
// OBTENER PERFIL
// ==========================
const obtenerPerfil = async (req, res) => {

    try {

        const { id_usuario } = req.params;

        const conexion = await getConnection();

        const resultado = await conexion.query(

            `
            SELECT
                id_usuario,
                nombre,
                apellido,
                correo,
                usuario,
                contrasena,
                login_google
            FROM usuarios
            WHERE id_usuario = $1
            `,

            [id_usuario]

        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({

                success: false,
                mensaje: "Usuario no encontrado."

            });

        }

        res.json({

            success: true,
            usuario: resultado.rows[0]

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

        await conexion.query(

            `
            UPDATE usuarios
            SET
                nombre = $1,
                apellido = $2,
                usuario = $3
            WHERE id_usuario = $4
            `,

            [
                nombre,
                apellido,
                usuario,
                id_usuario
            ]

        );

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