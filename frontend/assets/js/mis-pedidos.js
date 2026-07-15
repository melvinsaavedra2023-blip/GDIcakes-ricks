const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {

    window.location.href = "login.html";

}

async function cargarPedidos() {

    try {

        const respuesta = await fetch(

            `http://localhost:3000/api/mis-pedidos/${usuario.correo}`

        );

        const datos = await respuesta.json();

        const contenedor = document.getElementById("listaPedidos");

        if (!datos.success || datos.pedidos.length === 0) {

            contenedor.innerHTML = `

                <div class="pedido-card">

                    <h2>No tienes pedidos todavía.</h2>

                </div>

            `;

            return;

        }

        let html = "";

        datos.pedidos.forEach(pedido => {

            let clase = "";

            switch (pedido.estado) {

    case "Pendiente":

        clase = "pendiente";

        break;

    case "Preparando":

        clase = "preparacion";

        break;

    case "Enviado":

        clase = "preparacion";

        break;

    case "Entregado":

        clase = "entregado";

        break;

    default:

        clase = "pendiente";

        break;

}

const fecha = new Date(pedido.fecha).toLocaleDateString("es-PE");
            html += `

                <div class="pedido-card">

                    <div class="pedido-top">

                        <div>

                            <div class="numero">

                                Pedido #${pedido.id_pedido}

                            </div>

                            <div class="fecha">

                                ${fecha}

                            </div>

                        </div>

                        <span class="estado ${clase}">

                            ${pedido.estado}

                        </span>

                    </div>

                    <div class="info">

                        <div>

                            <span>Total</span>

                            <strong>S/. ${parseFloat(pedido.total).toFixed(2)}</strong>

                        </div>

                        <div>

                            <span>Método de pago</span>

                            <strong>${pedido.metodo_pago}</strong>

                        </div>

                        <div>

                            <span>ID Pedido</span>

                            <strong>#${pedido.id_pedido}</strong>

                        </div>

                    </div>

                    <button

                        class="btn-detalle"

                        onclick="verDetalle(${pedido.id_pedido})">

                        Ver detalles

                    </button>

                </div>

            `;

        });

        contenedor.innerHTML = html;

    } catch (error) {

        console.log(error);

    }

}

function verDetalle(id) {

    window.location.href = `detalle-pedido.html?id=${id}`;

}

cargarPedidos();