
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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ==========================
// SERVIR FRONTEND
// ==========================
app.use(express.static(path.join(__dirname, "../frontend")));

// ==========================
// CONEXIÓN SQL SERVER
// ==========================
getConnection()
.then(() => {

    console.log("✅ Conectado correctamente a SQL Server");

})
.catch((err) => {

    console.error(err);

});

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
// ABRIR INDEX
// ==========================
app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "../frontend/index.html"));

});

// ==========================
// SERVIDOR
// ==========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`🚀 Servidor iniciado en puerto ${PORT}`);

});