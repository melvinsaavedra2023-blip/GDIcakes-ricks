const formulario = document.getElementById("checkoutForm");

const resumen = document.getElementById("resumenPedido");

const totalPedido = document.getElementById("totalPedido");

const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

let total = 0;

// ============================
// RESUMEN DEL PEDIDO
// ============================

if (resumen) {

    resumen.innerHTML = "";

    carrito.forEach(producto => {

        const subtotal = producto.precio * producto.cantidad;

        total += subtotal;

        resumen.innerHTML += `

        <div class="producto-resumen">

            <img
    src="http://localhost:3000/uploads/${producto.imagen}"
    alt="${producto.nombre}"
    onerror="this.src='assets/images/cake.png'">

            <div class="producto-info">

                <h4>${producto.nombre}</h4>

                <small>Cantidad: ${producto.cantidad}</small>

            </div>

            <strong>S/. ${subtotal.toFixed(2)}</strong>

        </div>

        `;

    });

    totalPedido.innerHTML = `

        <div class="total-box">

            <span>Total</span>

            <strong>S/. ${total.toFixed(2)}</strong>

        </div>

    `;

}

// ============================
// REGISTRAR PEDIDO
// ============================

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {

        alert("Debe iniciar sesión.");

        return;

    }

    if (carrito.length === 0) {

        alert("El carrito está vacío.");

        return;

    }

    const metodo_pago = document.getElementById("metodoPago").value;

    try {

        const respuesta = await fetch("http://localhost:3000/api/pedidos", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

           body: JSON.stringify({

    correo: usuario.correo,

    telefono: document.getElementById("telefono").value,

    direccion: document.getElementById("direccion").value,

    carrito,

    metodo_pago

})
        });

        const datos = await respuesta.json();

        if (datos.success) {

            localStorage.removeItem("carrito");

            window.location.href = "index.html";

        } else {

            alert(datos.mensaje);

        }

    } catch (error) {

        console.error(error);

        alert("Error al registrar el pedido.");

    }

});