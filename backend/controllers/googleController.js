const { OAuth2Client } = require("google-auth-library");
const sql = require("mssql");
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

        const usuario = await conexion.request()

            .input("correo", sql.VarChar, correo)

            .query(`

                SELECT *

                FROM Usuarios

                WHERE correo=@correo

            `);

        //=========================
        // SI NO EXISTE
        //=========================

        if (usuario.recordset.length === 0) {

            const usuarioGenerado = correo.split("@")[0];

            await conexion.request()

                .input("nombre", sql.VarChar, nombre)
                .input("apellido", sql.VarChar, apellido)
                .input("correo", sql.VarChar, correo)
                .input("usuario", sql.VarChar, usuarioGenerado)

                .query(`

                    INSERT INTO Usuarios
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
                        @nombre,
                        @apellido,
                        @correo,
                        @usuario,
                        NULL,
                        'Cliente',
                        1,
                        1
                    )

                `);

            await conexion.request()

                .input("nombre", sql.VarChar, nombre)
                .input("apellido", sql.VarChar, apellido)
                .input("correo", sql.VarChar, correo)

                .query(`

                    INSERT INTO Clientes
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
                        @nombre,
                        @apellido,
                        '',
                        @correo,
                        '',
                        GETDATE(),
                        1
                    )

                `);

        }

        //=========================
        // DEVOLVER USUARIO
        //=========================

        const resultado = await conexion.request()

            .input("correo", sql.VarChar, correo)

            .query(`

                SELECT

                    id_usuario,
                    nombre,
                    apellido,
                    correo,
                    usuario,
                    rol,
                    login_google

                FROM Usuarios

                WHERE correo=@correo

            `);

        res.json({

            success: true,
            usuario: resultado.recordset[0]

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