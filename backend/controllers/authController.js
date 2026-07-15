const { getConnection } = require("../config/db");

// =========================
// LOGIN
// =========================
const login = async (req, res) => {

    try {

        const { usuario, password } = req.body;

        if (!usuario || !password) {
            return res.status(400).json({
                success: false,
                mensaje: "Debe ingresar usuario y contraseña"
            });
        }

        const conexion = await getConnection();

        const resultado = await conexion.request()
            .input("usuario", usuario)
            .input("password", password)
            .query(`
                SELECT
                    id_usuario,
                    nombre,
                    apellido,
                    correo,
                    usuario,
                    rol
                FROM Usuarios
                WHERE usuario=@usuario
                AND contrasena=@password
            `);

        if (resultado.recordset.length > 0) {

            return res.json({
                success: true,
                mensaje: "Bienvenido",
                usuario: resultado.recordset[0]
            });

        }

        return res.status(401).json({
            success: false,
            mensaje: "Usuario o contraseña incorrectos"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            mensaje: "Error interno del servidor"
        });

    }

};

// =========================
// REGISTRO
// =========================
const registrar = async (req, res) => {

    try {

        const {
            nombre,
            apellido,
            correo,
            usuario,
            password
        } = req.body;

        const conexion = await getConnection();

        // Verificar usuario existente
        const existe = await conexion.request()
            .input("usuario", usuario)
            .query(`
                SELECT *
                FROM Usuarios
                WHERE usuario=@usuario
            `);

        if (existe.recordset.length > 0) {

            return res.status(400).json({
                success: false,
                mensaje: "Ese usuario ya existe."
            });

        }

        // Registrar usuario
        await conexion.request()
            .input("nombre", nombre)
            .input("apellido", apellido)
            .input("correo", correo)
            .input("usuario", usuario)
            .input("password", password)
            .query(`
                INSERT INTO Usuarios
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
                    @nombre,
                    @apellido,
                    @correo,
                    @usuario,
                    @password,
                    'Cliente',
                    1
                )
            `);

        // Registrar cliente automáticamente
        await conexion.request()
            .input("nombre", nombre)
            .input("apellido", apellido)
            .input("correo", correo)
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

        return res.json({

            success: true,
            mensaje: "Usuario registrado correctamente."

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            mensaje: "Error interno del servidor."

        });

    }

};

module.exports = {
    login,
    registrar
};