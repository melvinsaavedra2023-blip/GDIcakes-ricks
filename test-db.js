require("dotenv").config();

const { Client } = require("pg");

const client = new Client({
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
});

(async () => {
    try {
        await client.connect();
        console.log("✅ Conectado");

        const res = await client.query("SELECT NOW()");
        console.log(res.rows);

        await client.end();
    } catch (err) {
        console.error("❌ ERROR:");
        console.error(err);
    }
})();