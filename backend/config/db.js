const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on("error", (err) => {
    console.error("❌ PostgreSQL:", err);
});

async function getConnection() {
    const client = await pool.connect();

    console.log("✅ Conexión obtenida");

    client.release();

    return pool;
}

module.exports = {
    getConnection,
    pool
};