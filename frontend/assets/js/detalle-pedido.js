const params = new URLSearchParams(window.location.search);

const idPedido = params.get("id");

async function cargarDetalle() {

    try {

        //=========================
        // INFORMACIÓN DEL PEDIDO
        //=========================

        const respuestaInfo = await fetch(
    `https://gdicakes-ricks.onrender.com/api/pedidos/info/${idPedido}`
);

        const datosInfo = await respuestaInfo.json();

        if (datosInfo.success) {

            const pedido = datosInfo.pedido;

            const fecha = new Date(pedido.fecha).toLocaleDateString("es-PE");

            document.getElementById("infoPedido").innerHTML = `

                <h2>Pedido #${pedido.id_pedido}</h2>

                <br>

                <div class="info-pedido">

                    <p><strong>Cliente:</strong> ${pedido.nombre} ${pedido.apellido}</p>

                    <p><strong>Fecha:</strong> ${fecha}</p>

                    <p><strong>Estado:</strong> ${pedido.estado}</p>

                    <p><strong>Teléfono:</strong> ${pedido.telefono || "-"}</p>

                    <p><strong>Dirección:</strong> ${pedido.direccion || "-"}</p>

                    <p><strong>Método de pago:</strong> ${pedido.metodo_pago}</p>

                </div>

                <hr>

            `;

        }

        //=========================
        // PRODUCTOS
        //=========================

        const respuesta = await fetch(
    `https://gdicakes-ricks.onrender.com/api/pedidos/${idPedido}`
);

        const productos = await respuesta.json();

        const contenedor = document.getElementById("productosPedido");

        let total = 0;

        let html = `

            <h2>Productos del pedido</h2>

            <br>

        `;

        productos.forEach(producto => {

            total += Number(producto.subtotal);

            html += `

                <div class="producto-detalle">

                    <img
    src="${producto.imagen}"
    onerror="this.src='assets/images/cake.png'">

                    <div class="producto-info">

                        <h3>${producto.nombre}</h3>

                        <p>Cantidad: ${producto.cantidad}</p>

                        <p>Precio: S/. ${Number(producto.precio).toFixed(2)}</p>

                        <p>Subtotal: <strong>S/. ${Number(producto.subtotal).toFixed(2)}</strong></p>

                    </div>

                </div>

            `;

        });

        html += `

            <hr>

            <div class="total-pedido">

                TOTAL:

                <strong>

                    S/. ${total.toFixed(2)}

                </strong>

            </div>

        `;

        contenedor.innerHTML = html;

    } catch (error) {

        console.log(error);

    }

}

cargarDetalle();