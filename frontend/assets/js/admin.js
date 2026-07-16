const contenido = document.getElementById("contenidoAdmin");
const menuProductos = document.getElementById("menuProductos");
const menuPedidos = document.getElementById("menuPedidos");
const menuClientes = document.getElementById("menuUsuarios");
const cerrarSesion = document.getElementById("cerrarSesion");

//=========================
// DASHBOARD
//=========================

async function cargarDashboard() {
    try {
        const res = await fetch("https://gdicakes-ricks.onrender.com/api/admin/dashboard");
        const datos = await res.json();

        document.getElementById("totalVentas").textContent =
            "S/. " + Number(datos.ventas || 0).toFixed(2);

        document.getElementById("totalPedidos").textContent = datos.pedidos || 0;
        document.getElementById("totalUsuarios").textContent = datos.clientes || 0;

        const resProd = await fetch("https://gdicakes-ricks.onrender.com/api/productos");
        const productos = await resProd.json();

        document.getElementById("totalProductos").textContent =
            Array.isArray(productos) ? productos.length : 0;

    } catch (err) {
        console.error("Dashboard error:", err);
    }
}

cargarDashboard();

//=========================
// PRODUCTOS
//=========================

menuProductos.addEventListener("click", mostrarProductos);

async function mostrarProductos() {
    try {
        const res = await fetch("https://gdicakes-ricks.onrender.com/api/productos");
        const productos = await res.json();

        let html = `
        <h2>Productos</h2>
        <button onclick="nuevoProducto()">Nuevo</button>
        <table>
        <thead>
        <tr>
        <th>ID</th><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Acciones</th>
        </tr>
        </thead><tbody>
        `;

        productos.forEach(p => {
            const img = p.imagen && p.imagen.startsWith("http")
                ? p.imagen
                : "assets/images/cake.png";

            html += `
            <tr>
                <td>${p.id_producto}</td>
                <td><img src="${img}" width="70" onerror="this.src='assets/images/cake.png'"></td>
                <td>${p.nombre}</td>
                <td>${p.precio}</td>
                <td>${p.stock}</td>
                <td>
                    <button onclick="editarProducto(${p.id_producto})">✏️</button>
                    <button onclick="eliminar(${p.id_producto})">🗑️</button>
                </td>
            </tr>
            `;
        });

        html += "</tbody></table>";
        contenido.innerHTML = html;

    } catch (err) {
        console.error(err);
    }
}

//=========================
// NUEVO PRODUCTO
//=========================

function nuevoProducto() {
    contenido.innerHTML = `
    <h2>Nuevo Producto</h2>
    <form id="formNuevo">
        <input name="nombre" placeholder="Nombre"><br>
        <input name="precio" placeholder="Precio"><br>
        <input name="stock" placeholder="Stock"><br>
        <input type="file" name="imagen"><br>
        <button type="submit">Guardar</button>
    </form>
    `;

    document.getElementById("formNuevo").addEventListener("submit", guardarProducto);
}

async function guardarProducto(e) {
    e.preventDefault();

    const form = document.getElementById("formNuevo");
    const data = new FormData(form);

    console.log("ENVIANDO:", data.get("imagen"));

    const res = await fetch("https://gdicakes-ricks.onrender.com/api/productos", {
        method: "POST",
        body: data
    });

    const result = await res.json();
    console.log(result);

    alert("Producto creado");
    mostrarProductos();
}

//=========================
// EDITAR PRODUCTO
//=========================

async function editarProducto(id) {
    const res = await fetch(`https://gdicakes-ricks.onrender.com/api/productos`);
    const productos = await res.json();

    const p = productos.find(x => x.id_producto == id);

    contenido.innerHTML = `
    <h2>Editar</h2>
    <form id="formEditar">
        <input name="nombre" value="${p.nombre}"><br>
        <input name="precio" value="${p.precio}"><br>
        <input name="stock" value="${p.stock}"><br>
        <input type="file" name="imagen"><br>
        <button type="submit">Actualizar</button>
    </form>
    `;

    document.getElementById("formEditar")
        .addEventListener("submit", (e) => actualizarProducto(e, id));
}

async function actualizarProducto(e, id) {
    e.preventDefault();

    const form = document.getElementById("formEditar");
    const data = new FormData(form);

    console.log("ENVIANDO IMAGEN:", data.get("imagen"));

    const res = await fetch(
        `https://gdicakes-ricks.onrender.com/api/productos/${id}`,
        {
            method: "PUT",
            body: data
        }
    );

    const result = await res.json();
    console.log(result);

    alert("Producto actualizado");
    mostrarProductos();
}

//=========================
// ELIMINAR
//=========================

async function eliminar(id) {
    await fetch(`https://gdicakes-ricks.onrender.com/api/productos/${id}`, {
        method: "DELETE"
    });

    alert("Eliminado");
    mostrarProductos();
}

window.editarProducto = editarProducto;
window.eliminar = eliminar;
window.nuevoProducto = nuevoProducto;

//=========================
// NUEVO PRODUCTO
//=========================

function nuevoProducto() {

    contenido.innerHTML = `

        <h2>Nuevo Producto</h2>

        <br>

        <form id="formProducto">

            <input type="text" name="nombre" placeholder="Nombre del producto" required>
            <br><br>

            <textarea name="descripcion" placeholder="Descripción" required></textarea>
            <br><br>

            <input type="number" step="0.01" name="precio" placeholder="Precio" required>
            <br><br>

            <input type="number" name="stock" placeholder="Stock" required>
            <br><br>

            <input type="file" name="imagen" accept="image/*" required>
            <br><br>

            <select name="id_categoria" required>
                <option value="" disabled selected>Seleccione categoría</option>
                <option value="1">Tortas</option>
                <option value="2">Cupcakes</option>
                <option value="3">Postres</option>
                <option value="4">Bebidas</option>
            </select>

            <br><br>

            <button type="submit" class="btn btn-editar">
                Guardar Producto
            </button>

            <button type="button" class="btn" onclick="mostrarProductos()">
                Cancelar
            </button>

        </form>
    `;

    document
        .getElementById("formProducto")
        .addEventListener("submit", guardarProducto);
}

window.nuevoProducto = nuevoProducto;


//=========================
// GUARDAR PRODUCTO
//=========================

async function guardarProducto(e) {

    e.preventDefault();

    const form = document.getElementById("formProducto");
    const datos = new FormData(form);

    console.log("IMAGEN ENVIADA:", datos.get("imagen"));

    try {

        const res = await fetch(
            "https://gdicakes-ricks.onrender.com/api/productos",
            {
                method: "POST",
                body: datos
            }
        );

        const result = await res.json();
        console.log("RESPUESTA:", result);

        if (res.ok) {
            alert("Producto registrado correctamente.");
            mostrarProductos();
            cargarDashboard();
        } else {
            alert(result.mensaje || "Error al registrar producto");
        }

    } catch (error) {
        console.error(error);
        alert("Error del servidor");
    }
}

window.guardarProducto = guardarProducto;


//=========================
// EDITAR PRODUCTO
//=========================

async function editarProducto(id) {

    try {

        const res = await fetch(
            "https://gdicakes-ricks.onrender.com/api/productos"
        );

        const productos = await res.json();

        const producto = productos.find(p => p.id_producto == id);

        if (!producto) {
            alert("Producto no encontrado");
            return;
        }

        const imagen = producto.imagen && producto.imagen.startsWith("http")
            ? producto.imagen
            : "assets/images/cake.png";

        contenido.innerHTML = `

        <h2>Editar Producto</h2>

        <br>

        <form id="formEditar">

            <input type="text" name="nombre" value="${producto.nombre}" required>
            <br><br>

            <textarea name="descripcion" required>${producto.descripcion}</textarea>
            <br><br>

            <input type="number" step="0.01" name="precio" value="${producto.precio}" required>
            <br><br>

            <input type="number" name="stock" value="${producto.stock}" required>
            <br><br>

            <label><b>Imagen actual</b></label>
            <br><br>

            <img src="${imagen}" width="120"
                style="object-fit:cover;border-radius:10px"
                onerror="this.src='assets/images/cake.png'">

            <br><br>

            <input type="file" name="imagen" accept="image/*">
            <br><br>

            <select name="id_categoria" required>
                <option value="1" ${producto.id_categoria == 1 ? "selected" : ""}>Tortas</option>
                <option value="2" ${producto.id_categoria == 2 ? "selected" : ""}>Cupcakes</option>
                <option value="3" ${producto.id_categoria == 3 ? "selected" : ""}>Postres</option>
                <option value="4" ${producto.id_categoria == 4 ? "selected" : ""}>Bebidas</option>
            </select>

            <br><br>

            <button type="submit" class="btn btn-editar">
                Actualizar Producto
            </button>

            <button type="button" class="btn" onclick="mostrarProductos()">
                Cancelar
            </button>

        </form>
        `;

        document
            .getElementById("formEditar")
            .addEventListener("submit", (e) => actualizarProducto(e, id));

    } catch (error) {
        console.error(error);
        alert("Error al cargar producto");
    }
}

window.editarProducto = editarProducto;


//=========================
// ACTUALIZAR PRODUCTO
//=========================

async function actualizarProducto(e, id) {

    e.preventDefault();

    const form = document.getElementById("formEditar");
    const datos = new FormData(form);

    console.log("IMAGEN UPDATE:", datos.get("imagen"));

    try {

        const res = await fetch(
            `https://gdicakes-ricks.onrender.com/api/productos/${id}`,
            {
                method: "PUT",
                body: datos
            }
        );

        const result = await res.json();
        console.log("RESPUESTA UPDATE:", result);

        if (res.ok) {
            alert("Producto actualizado");
            mostrarProductos();
            cargarDashboard();
        } else {
            alert(result.mensaje || "Error al actualizar");
        }

    } catch (error) {
        console.error(error);
        alert("Error del servidor");
    }
}

window.actualizarProducto = actualizarProducto;
//=========================
// ACTUALIZAR PRODUCTO
//=========================

async function actualizarProducto(e, id) {

    e.preventDefault();

    const formulario = document.getElementById("formEditar");

    const datos = new FormData();

    // Campos normales
    datos.append("nombre", formulario.nombre.value);
    datos.append("descripcion", formulario.descripcion.value);
    datos.append("precio", formulario.precio.value);
    datos.append("stock", formulario.stock.value);
    datos.append("id_categoria", formulario.id_categoria.value);

    // 🔥 ARCHIVO (ESTO ES LO IMPORTANTE)
    const fileInput = formulario.imagen;

    if (fileInput.files.length > 0) {
        datos.append("imagen", fileInput.files[0]);
        console.log("ENVIANDO IMAGEN:", fileInput.files[0]);
    } else {
        console.log("NO SE SELECCIONÓ IMAGEN");
    }

    try {

        const respuesta = await fetch(
            `https://gdicakes-ricks.onrender.com/api/productos/${id}`,
            {
                method: "PUT",
                body: datos
            }
        );

        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.success) {

            alert("Producto actualizado correctamente.");

            await mostrarProductos();
            await cargarDashboard();

        } else {

            alert(resultado.mensaje || "No se pudo actualizar el producto.");

        }

    } catch (error) {

        console.error(error);
        alert("Error del servidor.");

    }

}

window.actualizarProducto = actualizarProducto;
//=========================
// PEDIDOS
//=========================

menuPedidos.addEventListener("click", mostrarPedidos);

async function mostrarPedidos() {

    try {

        const respuesta = await fetch(
            "https://gdicakes-ricks.onrender.com/api/pedidos"
        );

        const pedidos = await respuesta.json();

        if (!Array.isArray(pedidos)) {

            contenido.innerHTML = `
                <h2>Pedidos</h2>
                <p>${pedidos.mensaje || "No se pudieron cargar los pedidos."}</p>
            `;

            return;

        }

        let html = `

        <h2>Pedidos</h2>

        <br>

        <table>

            <thead>

                <tr>

                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Dirección</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Pago</th>
                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody>

        `;

        pedidos.forEach(pedido => {

            html += `

            <tr>

                <td>${pedido.id_pedido}</td>

                <td>${pedido.cliente}</td>

                <td>${pedido.telefono || "-"}</td>

                <td>${pedido.correo}</td>

                <td>${pedido.direccion || "-"}</td>

                <td>${pedido.fecha ? new Date(pedido.fecha).toLocaleDateString() : "-"}</td>

                <td>S/. ${Number(pedido.total).toFixed(2)}</td>

                <td>

                    <select id="estado${pedido.id_pedido}">

                        <option value="Pendiente" ${pedido.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>

                        <option value="Preparando" ${pedido.estado === "Preparando" ? "selected" : ""}>Preparando</option>

                        <option value="Enviado" ${pedido.estado === "Enviado" ? "selected" : ""}>Enviado</option>

                        <option value="Entregado" ${pedido.estado === "Entregado" ? "selected" : ""}>Entregado</option>

                    </select>

                </td>

                <td>${pedido.metodo_pago}</td>

                <td>

                    <button
                        class="btn btn-editar"
                        onclick="verDetalle(${pedido.id_pedido})">

                        <i class="ri-eye-line"></i>

                    </button>

                    <button
                        class="btn btn-editar"
                        onclick="guardarEstado(${pedido.id_pedido})">

                        <i class="ri-save-line"></i>

                    </button>

                </td>

            </tr>

            `;

        });

        html += `

            </tbody>

        </table>

        <br>

        <div id="detallePedido"></div>

        `;

        contenido.innerHTML = html;

    } catch (error) {

        console.error(error);

        alert("Error al cargar los pedidos.");

    }

}
//=========================
// VER DETALLE PEDIDO
//=========================

async function verDetalle(id) {

    try {

        const respuesta = await fetch(
            `https://gdicakes-ricks.onrender.com/api/pedidos/${id}`
        );

        const productos = await respuesta.json();

        if (!Array.isArray(productos)) {

            alert(productos.mensaje || "No se pudo obtener el detalle del pedido.");

            return;

        }

        let html = `

            <h3>Detalle del Pedido #${id}</h3>

            <br>

            <table>

                <thead>

                    <tr>

                        <th>Imagen</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>

                    </tr>

                </thead>

                <tbody>

        `;

        productos.forEach(producto => {

            const imagen = producto.imagen
                ? producto.imagen
                : "assets/images/cake.png";

            html += `

                <tr>

                    <td>

                        <img
                            src="${imagen}"
                            width="60"
                            height="60"
                            style="object-fit:cover;border-radius:8px"
                            onerror="this.src='assets/images/cake.png'">

                    </td>

                    <td>${producto.nombre}</td>

                    <td>${producto.cantidad}</td>

                    <td>S/. ${Number(producto.precio).toFixed(2)}</td>

                    <td>S/. ${Number(producto.subtotal).toFixed(2)}</td>

                </tr>

            `;

        });

        html += `

                </tbody>

            </table>

        `;

        document.getElementById("detallePedido").innerHTML = html;

    } catch (error) {

        console.error(error);

        alert("No se pudo cargar el detalle del pedido.");

    }

}

window.verDetalle = verDetalle;

//=========================
// CAMBIAR ESTADO
//=========================

async function guardarEstado(id) {

    try {

        const estado = document.getElementById(`estado${id}`).value;

        const respuesta = await fetch(

            `https://gdicakes-ricks.onrender.com/api/pedidos/${id}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    estado

                })

            }

        );

        const datos = await respuesta.json();

        if (respuesta.ok && datos.success) {

            alert("Estado actualizado correctamente.");

            await mostrarPedidos();

            await cargarDashboard();

        } else {

            alert(datos.mensaje || "No se pudo actualizar el estado.");

        }

    } catch (error) {

        console.error(error);

        alert("Error del servidor.");

    }

}

window.guardarEstado = guardarEstado;

//=========================
// CLIENTES
//=========================

menuClientes.addEventListener("click", mostrarClientes);

async function mostrarClientes() {

    try {

        const respuesta = await fetch(
            "https://gdicakes-ricks.onrender.com/api/clientes"
        );

        const clientes = await respuesta.json();

        if (!Array.isArray(clientes)) {

            contenido.innerHTML = `
                <h2>Clientes Registrados</h2>
                <p>${clientes.mensaje || "No se pudieron cargar los clientes."}</p>
            `;

            return;

        }

        let html = `

            <h2>Clientes Registrados</h2>

            <br>

            <table>

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Fecha Registro</th>

                    </tr>

                </thead>

                <tbody>

        `;

        clientes.forEach(cliente => {

            html += `

                <tr>

                    <td>${cliente.id_cliente}</td>

                    <td>${cliente.nombre}</td>

                    <td>${cliente.apellido}</td>

                    <td>${cliente.correo}</td>

                    <td>${cliente.telefono || "-"}</td>

                    <td>${
                        cliente.fecha_registro
                        ? new Date(cliente.fecha_registro).toLocaleDateString()
                        : "-"
                    }</td>

                </tr>

            `;

        });

        html += `

                </tbody>

            </table>

        `;

        contenido.innerHTML = html;

    } catch (error) {

        console.error(error);

        alert("Error al cargar los clientes.");

    }

}

window.mostrarClientes = mostrarClientes;

//=========================
// CERRAR SESIÓN
//=========================

cerrarSesion.addEventListener("click", () => {

    if (!confirm("¿Desea cerrar sesión?")) return;

    localStorage.removeItem("usuario");
    localStorage.removeItem("carrito");

    window.location.href = "login.html";

});