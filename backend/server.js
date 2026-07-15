require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const adminRoutes = require("./routes/adminRoutes");
const googleRoutes = require("./routes/googleRoutes");
const perfilRoutes = require("./routes/perfilRoutes");

const { getConnection } = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// ==========================
// CONEXIÓN POSTGRESQL
// ==========================
getConnection()
    const { pool } = require("./config/db");

pool.query("SELECT NOW()")
.then((r) => {
    console.log("✅ PostgreSQL responde:", r.rows[0]);
})
.catch((e) => {
    console.error("❌ PostgreSQL:", e);
});

// ==========================
// RUTA PRINCIPAL (LOGIN)
// ==========================
app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "../frontend/login.html"));

});

// ==========================
// ARCHIVOS ESTÁTICOS
// ==========================
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================
// API
// ==========================
app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", pedidoRoutes);
app.use("/api", adminRoutes);
app.use("/api", googleRoutes);
app.use("/api", perfilRoutes);

// ==========================
// SERVIDOR
// ==========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`🚀 Servidor iniciado en puerto ${PORT}`);

});