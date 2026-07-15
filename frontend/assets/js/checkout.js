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
                src="https://gdicakes-ricks.onrender.com/uploads/${producto.imagen}"
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

if (formulario) {

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    console.log("🚀 Submit ejecutado");

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    console.log("Usuario:", usuario);

    console.log("Carrito:", carrito);

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

        console.log("🚀 Enviando pedido...");

        const respuesta = await fetch("https://gdicakes-ricks.onrender.com/api/pedidos", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                correo: usuario.correo,
                telefono: document.getElementById("telefono").value,
                direccion: document.getElementById("direccion").value,
                carrito: carrito,
                metodo_pago: metodo_pago

            })

        });

        console.log("Status:", respuesta.status);

        const datos = await respuesta.json();

        console.log("Respuesta:", datos);

        if (datos.success) {

            localStorage.removeItem("carrito");

            alert("Pedido registrado correctamente.");

            window.location.href = "index.html";

        } else {

            alert(datos.mensaje);

        }

    } catch (error) {

        console.error("ERROR FETCH:", error);

        alert("Error al registrar el pedido.");

    }

});

}