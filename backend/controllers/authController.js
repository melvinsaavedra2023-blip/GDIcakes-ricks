const { getConnection } = require("../config/db");

// =======================
// LOGIN
// =======================
const login = async (req, res) => {

    try {

        const { usuario, password } = req.body;

        if (!usuario || !password) {
            return res.status(400).json({
                success: false,
                mensaje: "Debe ingresar usuario y contraseña"
            });
        }

        const db = await getConnection();

        console.log("========== LOGIN ==========");
        console.log("Usuario:", usuario);
        console.log("Password:", password);

        const resultado = await db.query(
            `
            SELECT
                id_usuario,
                nombre,
                apellido,
                correo,
                usuario,
                rol
            FROM usuarios
            WHERE usuario = $1
            AND contrasena = $2
            `,
            [usuario, password]
        );

        console.log("Resultado:", resultado.rows);

        if (resultado.rows.length > 0) {

            return res.json({
                success: true,
                mensaje: "Bienvenido",
                usuario: resultado.rows[0]
            });

        }

        return res.status(401).json({
            success: false,
            mensaje: "Usuario o contraseña incorrectos"
        });

    } catch (error) {

        console.error("========== ERROR LOGIN ==========");
        console.error(error);
        console.error(error.message);
        console.error(error.stack);

        return res.status(500).json({
            success: false,
            mensaje: error.message
        });

    }

};

// =======================
// REGISTRO
// =======================
const registrar = async (req, res) => {

    try {

        const {
            nombre,
            apellido,
            correo,
            usuario,
            password
        } = req.body;

        const db = await getConnection();

        const existe = await db.query(
            `
            SELECT *
            FROM usuarios
            WHERE usuario = $1
            `,
            [usuario]
        );

        if (existe.rows.length > 0) {

            return res.status(400).json({
                success: false,
                mensaje: "Ese usuario ya existe."
            });

        }

        await db.query(
            `
            INSERT INTO usuarios
            (
                nombre,
                apellido,
                correo,
                usuario,
                contrasena,
                rol,
                estado
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                'Cliente',
                true
            )
            `,
            [
                nombre,
                apellido,
                correo,
                usuario,
                password
            ]
        );

        await db.query(
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

        res.json({
            success: true,
            mensaje: "Usuario registrado correctamente."
        });

    } catch (error) {

        console.error("========== ERROR REGISTRO ==========");
        console.error(error);

        res.status(500).json({
            success: false,
            mensaje: error.message
        });

    }

};

module.exports = {
    login,
    registrar
};