let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contador = document.getElementById("cart-count");
const sidebar = document.getElementById("cartSidebar");
const overlay = document.getElementById("overlay");
const items = document.getElementById("cartItems");
const total = document.getElementById("cartTotal");
const btnCheckout = document.querySelector(".checkout");

//=========================
// ACTUALIZAR
//=========================

function actualizarCarrito() {

    contador.textContent = carrito.reduce((t, p) => t + p.cantidad, 0);

    localStorage.setItem("carrito", JSON.stringify(carrito));

    renderCarrito();

}

//=========================
// AGREGAR
//=========================

function agregarAlCarrito(producto) {

    const existe = carrito.find(p => p.id_producto === producto.id_producto);

    if (existe) {

        existe.cantidad++;

    } else {

        producto.cantidad = 1;

        carrito.push(producto);

    }

    actualizarCarrito();

    abrirCarrito();

}

//=========================
// RENDER
//=========================

function renderCarrito() {

    if (carrito.length === 0) {

        items.innerHTML = `
            <p class="empty-cart">
                Tu carrito está vacío.
            </p>
        `;

        total.textContent = "S/. 0.00";

        btnCheckout.disabled = true;

        return;

    }

    btnCheckout.disabled = false;

    let html = "";

    let suma = 0;

    carrito.forEach((p, index) => {

        const subtotal = p.precio * p.cantidad;

        suma += subtotal;

        html += `

        <div class="cart-product">

            <img
  src="${p.imagen}"
  alt="${p.nombre}"
  onerror="this.src='assets/images/cake.png'">

            <div class="cart-info">

                <h4>${p.nombre}</h4>

                <div class="precio">

                    S/. ${parseFloat(p.precio).toFixed(2)}

                </div>

                <div class="cart-controls">

                    <button onclick="disminuirCantidad(${index})">

                        -

                    </button>

                    <span class="cantidad">

                        ${p.cantidad}

                    </span>

                    <button onclick="aumentarCantidad(${index})">

                        +

                    </button>

                </div>

                <div class="subtotal">

                    Subtotal:
                    <strong>S/. ${subtotal.toFixed(2)}</strong>

                </div>

            </div>

            <button class="eliminar" onclick="eliminarProducto(${index})">

                <i class="ri-delete-bin-6-line"></i>

            </button>

        </div>

        `;

    });

    items.innerHTML = html;

    total.textContent = "S/. " + suma.toFixed(2);

}

//=========================
// +
//=========================

function aumentarCantidad(index) {

    carrito[index].cantidad++;

    actualizarCarrito();

}

//=========================
// -
//=========================

function disminuirCantidad(index) {

    carrito[index].cantidad--;

    if (carrito[index].cantidad <= 0) {

        carrito.splice(index, 1);

    }

    actualizarCarrito();

}

//=========================
// ELIMINAR
//=========================

function eliminarProducto(index) {

    carrito.splice(index, 1);

    actualizarCarrito();

}

//=========================
// SIDEBAR
//=========================

function abrirCarrito() {

    sidebar.classList.add("active");

    overlay.classList.add("active");

}

function cerrarCarrito() {

    sidebar.classList.remove("active");

    overlay.classList.remove("active");

}

//=========================
// EVENTOS
//=========================

document.getElementById("cartButton").addEventListener("click", abrirCarrito);

document.getElementById("closeCart").addEventListener("click", cerrarCarrito);

overlay.addEventListener("click", cerrarCarrito);

btnCheckout.addEventListener("click", () => {

    if (carrito.length === 0) {

        return;

    }

    window.location.href = "checkout.html";

});

//=========================
// GLOBALES
//=========================

window.agregarAlCarrito = agregarAlCarrito;
window.eliminarProducto = eliminarProducto;
window.aumentarCantidad = aumentarCantidad;
window.disminuirCantidad = disminuirCantidad;

//=========================
// INICIAR
//=========================

actualizarCarrito();