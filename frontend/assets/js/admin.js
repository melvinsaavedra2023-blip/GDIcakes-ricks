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

        const respuestaDashboard = await fetch(
            "http://localhost:3000/api/admin/dashboard"
        );

        const datos = await respuestaDashboard.json();

        document.getElementById("totalVentas").textContent =
            "S/. " + Number(datos.ventas || 0).toFixed(2);

        document.getElementById("totalPedidos").textContent =
            datos.pedidos || 0;

        document.getElementById("totalUsuarios").textContent =
            datos.clientes || 0;

        const respuestaProductos = await fetch(
            "http://localhost:3000/api/productos"
        );

        const productos = await respuestaProductos.json();

        document.getElementById("totalProductos").textContent =
            Array.isArray(productos) ? productos.length : 0;

    } catch (error) {

        console.error("Error Dashboard:", error);

    }

}

cargarDashboard();

//=========================
// PRODUCTOS
//=========================

menuProductos.addEventListener("click", mostrarProductos);

async function mostrarProductos() {

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/productos"
        );

        const productos = await respuesta.json();

        if (!Array.isArray(productos)) {

            contenido.innerHTML = `
                <h2>Error al cargar los productos</h2>
                <p>${productos.mensaje || "No se pudieron obtener los productos."}</p>
            `;

            return;

        }

        let html = `

        <h2>Productos</h2>

        <br>

        <button
            class="btn btn-editar"
            onclick="nuevoProducto()">

            <i class="ri-add-line"></i>

            Nuevo Producto

        </button>

        <br><br>

        <table>

            <thead>

                <tr>

                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody>

        `;

        productos.forEach(producto => {

            const imagen = producto.imagen
                ? `http://localhost:3000/uploads/${producto.imagen}`
                : "assets/images/cake.png";

            html += `

            <tr>

                <td>${producto.id_producto}</td>

                <td>

                    <img
                        src="${imagen}"
                        width="70"
                        height="70"
                        style="object-fit:cover;border-radius:10px"
                        onerror="this.src='assets/images/cake.png'">

                </td>

                <td>${producto.nombre}</td>

                <td>S/. ${Number(producto.precio).toFixed(2)}</td>

                <td>${producto.stock}</td>

                <td>

                    <button
                        class="btn btn-editar"
                        onclick="editarProducto(${producto.id_producto})">

                        <i class="ri-edit-line"></i>

                    </button>

                    <button
                        class="btn btn-eliminar"
                        onclick="eliminar(${producto.id_producto})">

                        <i class="ri-delete-bin-6-line"></i>

                    </button>

                </td>

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

        contenido.innerHTML = `
            <h2>Error</h2>
            <p>No se pudieron cargar los productos.</p>
        `;

    }

}

//=========================
// ELIMINAR PRODUCTO
//=========================

async function eliminar(id) {

    const confirmar = confirm("¿Desea eliminar este producto?");

    if (!confirmar) return;

    try {

        const respuesta = await fetch(
            `http://localhost:3000/api/productos/${id}`,
            {
                method: "DELETE"
            }
        );

        const datos = await respuesta.json();

        if (datos.success) {

            alert("Producto eliminado correctamente.");

            await mostrarProductos();

            await cargarDashboard();

        } else {

            alert(datos.mensaje || "No se pudo eliminar el producto.");

        }

    } catch (error) {

        console.error(error);

        alert("Error del servidor.");

    }

}

window.eliminar = eliminar;

//=========================
// NUEVO PRODUCTO
//=========================

function nuevoProducto() {

    contenido.innerHTML = `

        <h2>Nuevo Producto</h2>

        <br>

        <form id="formProducto" enctype="multipart/form-data">

            <input
                type="text"
                name="nombre"
                placeholder="Nombre del producto"
                required>

            <br><br>

            <textarea
                name="descripcion"
                placeholder="Descripción"
                required></textarea>

            <br><br>

            <input
                type="number"
                step="0.01"
                name="precio"
                placeholder="Precio"
                required>

            <br><br>

            <input
                type="number"
                name="stock"
                placeholder="Stock"
                required>

            <br><br>

            <input
                type="file"
                name="imagen"
                accept="image/*"
                required>

            <br><br>

            <select
                name="id_categoria"
                required>

                <option value="" selected disabled>Seleccione una categoría</option>
                <option value="1">Tortas</option>
                <option value="2">Cupcakes</option>
                <option value="3">Postres</option>
                <option value="4">Bebidas</option>

            </select>

            <br><br>

            <button
                type="submit"
                class="btn btn-editar">

                <i class="ri-save-line"></i>

                Guardar Producto

            </button>

            <button
                type="button"
                class="btn"
                onclick="mostrarProductos()">

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

    const formulario = document.getElementById("formProducto");

    const datos = new FormData(formulario);

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/productos",
            {
                method: "POST",
                body: datos
            }
        );

        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.success) {

            alert("Producto registrado correctamente.");

            await mostrarProductos();

            await cargarDashboard();

        } else {

            alert(resultado.mensaje || "No se pudo registrar el producto.");

        }

    } catch (error) {

        console.error(error);

        alert("Error del servidor.");

    }

}

window.guardarProducto = guardarProducto;
//=========================
// EDITAR PRODUCTO
//=========================

async function editarProducto(id) {

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/productos"
        );

        const productos = await respuesta.json();

        if (!Array.isArray(productos)) {

            alert("No se pudieron obtener los productos.");

            return;

        }

        const producto = productos.find(
            p => p.id_producto == id
        );

        if (!producto) {

            alert("Producto no encontrado.");

            return;

        }

        const imagen = producto.imagen
            ? `http://localhost:3000/uploads/${producto.imagen}`
            : "assets/images/cake.png";

        contenido.innerHTML = `

        <h2>Editar Producto</h2>

        <br>

        <form id="formEditar" enctype="multipart/form-data">

            <input
                type="text"
                name="nombre"
                value="${producto.nombre}"
                required>

            <br><br>

            <textarea
                name="descripcion"
                required>${producto.descripcion}</textarea>

            <br><br>

            <input
                type="number"
                step="0.01"
                name="precio"
                value="${producto.precio}"
                required>

            <br><br>

            <input
                type="number"
                name="stock"
                value="${producto.stock}"
                required>

            <br><br>

            <label><b>Imagen actual</b></label>

            <br><br>

            <img
                src="${imagen}"
                width="120"
                height="120"
                style="object-fit:cover;border-radius:10px"
                onerror="this.src='assets/images/cake.png'">

            <br><br>

            <input
                type="file"
                name="imagen"
                accept="image/*">

            <br><br>

            <select
                name="id_categoria"
                required>

                <option value="1" ${producto.id_categoria == 1 ? "selected" : ""}>Tortas</option>
                <option value="2" ${producto.id_categoria == 2 ? "selected" : ""}>Cupcakes</option>
                <option value="3" ${producto.id_categoria == 3 ? "selected" : ""}>Postres</option>
                <option value="4" ${producto.id_categoria == 4 ? "selected" : ""}>Bebidas</option>

            </select>

            <br><br>

            <button
                type="submit"
                class="btn btn-editar">

                <i class="ri-save-line"></i>

                Actualizar Producto

            </button>

            <button
                type="button"
                class="btn"
                onclick="mostrarProductos()">

                Cancelar

            </button>

        </form>

        `;

        document
            .getElementById("formEditar")
            .addEventListener(
                "submit",
                (e) => actualizarProducto(e, id)
            );

    } catch (error) {

        console.error(error);

        alert("Error al cargar el producto.");

    }

}

window.editarProducto = editarProducto;
//=========================
// ACTUALIZAR PRODUCTO
//=========================

async function actualizarProducto(e, id) {

    e.preventDefault();

    const formulario = document.getElementById("formEditar");

    const datos = new FormData(formulario);

    try {

        const respuesta = await fetch(

            `http://localhost:3000/api/productos/${id}`,

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
            "http://localhost:3000/api/pedidos"
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
            `http://localhost:3000/api/pedidos/${id}`
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
                ? `http://localhost:3000/uploads/${producto.imagen}`
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

            `http://localhost:3000/api/pedidos/${id}`,

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
            "http://localhost:3000/api/clientes"
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