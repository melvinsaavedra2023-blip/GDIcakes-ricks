const sql = require("mssql");
require("dotenv").config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
    connectionTimeout: 5000,
    requestTimeout: 5000
};

async function getConnection() {
    try {
        const pool = await sql.connect(config);
        console.log("✅ Conectado correctamente a SQL Server");
        return pool;
    } catch (error) {
        console.error("❌ Error al conectar con SQL Server:");
        console.error(error.message);
        throw error;
    }
}

module.exports = {
    getConnection,
    sql
};