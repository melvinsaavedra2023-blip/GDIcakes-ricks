const contenedor = document.getElementById("productos");
const buscador = document.getElementById("buscador");

let listaProductos = [];

//=========================
// CARGAR PRODUCTOS
//=========================

async function cargarProductos(){

    const respuesta = await fetch("https://gdicakes-ricks.onrender.com/api/productos");

    listaProductos = await respuesta.json();

    mostrarProductos(listaProductos);

}

//=========================
// MOSTRAR PRODUCTOS
//=========================

function mostrarProductos(productos){

    contenedor.innerHTML = "";

    if(productos.length === 0){

        contenedor.innerHTML = `

            <h2 style="grid-column:1/-1;text-align:center">

                No se encontraron productos.

            </h2>

        `;

        return;

    }

    productos.forEach(producto=>{

        contenedor.innerHTML += `

        <div class="card">

            <img
            src="https://gdicakes-ricks.onrender.com/uploads/${producto.imagen}"
            onerror="this.src='assets/images/cake.png'">

            <div class="card-body">

                <h3>${producto.nombre}</h3>

                <p>${producto.descripcion}</p>

                <span class="precio">

                    S/. ${parseFloat(producto.precio).toFixed(2)}

                </span>

                <span class="stock">

                    ${producto.stock} disponibles

                </span>

                <button
                class="comprar"
                onclick='agregarAlCarrito(${JSON.stringify(producto)})'>

                    Añadir al carrito

                </button>

            </div>

        </div>

        `;

    });

}

//=========================
// BUSCADOR
//=========================

buscador.addEventListener("input",()=>{

    const texto = buscador.value.toLowerCase();

    const filtrados = listaProductos.filter(producto=>

        producto.nombre.toLowerCase().includes(texto) ||

        producto.descripcion.toLowerCase().includes(texto)

    );

    mostrarProductos(filtrados);

});

cargarProductos();