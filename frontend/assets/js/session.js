const perfil = document.getElementById("perfil");

if (perfil) {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // ==========================
    // USUARIO CON SESIÓN
    // ==========================
    if (usuario) {

        let opcionAdmin = "";

        if (usuario.rol === "Administrador") {

            opcionAdmin = `

                <a href="admin/dashboard.html">

                    <i class="ri-dashboard-line"></i>

                    Panel Administrador

                </a>

            `;

        }

        perfil.innerHTML = `

        <div class="perfil-menu">

            <button id="btnPerfil" class="perfil-btn">

                <i class="ri-user-3-fill"></i>

            </button>

            <div id="menuPerfil" class="menu-perfil">

               <div class="menu-header">

    <h3>Hola, ${usuario.nombre}</h3>

</div>

                <hr>

                

                <a href="mis-pedidos.html">

                    <i class="ri-shopping-bag-line"></i>

                    Mis Pedidos

                </a>

                ${opcionAdmin}

                <hr>

                <a href="#" id="cerrarSesion">

                    <i class="ri-logout-box-r-line"></i>

                    Cerrar sesión

                </a>

            </div>

        </div>

        `;

        const btnPerfil = document.getElementById("btnPerfil");
        const menuPerfil = document.getElementById("menuPerfil");

        btnPerfil.addEventListener("click", function (e) {

            e.stopPropagation();

            menuPerfil.classList.toggle("activo");

        });

        menuPerfil.addEventListener("click", function (e) {

            e.stopPropagation();

        });

        document.addEventListener("click", function () {

            menuPerfil.classList.remove("activo");

        });

        document.getElementById("cerrarSesion").addEventListener("click", function (e) {

            e.preventDefault();

            localStorage.removeItem("usuario");

            window.location.href = "login.html";

        });

    }

    // ==========================
    // SIN SESIÓN
    // ==========================
    else {

        perfil.innerHTML = `

        <button id="btnLogin" class="perfil-btn">

            <i class="ri-user-3-line"></i>

        </button>

        `;

        document.getElementById("btnLogin").addEventListener("click", function () {

            window.location.href = "login.html";

        });

    }

}