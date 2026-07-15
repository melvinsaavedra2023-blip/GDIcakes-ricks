const { OAuth2Client } = require("google-auth-library");
const { getConnection } = require("../config/db");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const loginGoogle = async (req, res) => {

    try {

        const { token } = req.body;

        if (!token) {

            return res.status(400).json({
                success: false,
                mensaje: "Token no recibido."
            });

        }

        const ticket = await client.verifyIdToken({

            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID

        });

        const payload = ticket.getPayload();

        const nombre = payload.given_name || "";
        const apellido = payload.family_name || "";
        const correo = payload.email;

        const conexion = await getConnection();

        //=========================
        // BUSCAR USUARIO
        //=========================

        const usuario = await conexion.query(

            `
            SELECT *
            FROM usuarios
            WHERE correo = $1
            `,

            [correo]

        );

        //=========================
        // SI NO EXISTE
        //=========================

        if (usuario.rows.length === 0) {

            const usuarioGenerado = correo.split("@")[0];

            await conexion.query(

                `
                INSERT INTO usuarios
                (
                    nombre,
                    apellido,
                    correo,
                    usuario,
                    contrasena,
                    rol,
                    estado,
                    login_google
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    NULL,
                    'Cliente',
                    true,
                    true
                )
                `,

                [
                    nombre,
                    apellido,
                    correo,
                    usuarioGenerado
                ]

            );

            await conexion.query(

                `
                INSERT INTO clientes
                (
                    nombre,
                    apellido,
                    telefono,
                    correo,
                    direccion,
                    fecha_registro,
                    estado
                )
                VALUES
                (
                    $1,
                    $2,
                    '',
                    $3,
                    '',
                    CURRENT_DATE,
                    true
                )
                `,

                [
                    nombre,
                    apellido,
                    correo
                ]

            );

        }

        //=========================
        // DEVOLVER USUARIO
        //=========================

        const resultado = await conexion.query(

            `
            SELECT
                id_usuario,
                nombre,
                apellido,
                correo,
                usuario,
                rol,
                login_google
            FROM usuarios
            WHERE correo = $1
            `,

            [correo]

        );

        res.json({

            success: true,
            usuario: resultado.rows[0]

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            mensaje: "Error con Google."

        });

    }

};

module.exports = {
    loginGoogle
};