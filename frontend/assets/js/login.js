const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();

    const password = document.getElementById("password").value.trim();

    if (!usuario || !password) {

        alert("Complete todos los campos.");

        return;

    }

    try {

        const respuesta = await fetch(

            "https://gdicakes-ricks.onrender.com/api/login",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    usuario,
                    password

                })

            }

        );

        const datos = await respuesta.json();

        if (datos.success) {

            // Guardar usuario en sesión
            localStorage.setItem(
                "usuario",
                JSON.stringify(datos.usuario)
            );

            // Redireccionar según el rol
            if (datos.usuario.rol === "Administrador") {

                window.location.href = "admin.html";

            } else {

                window.location.href = "index.html";

            }

        } else {

            alert(datos.mensaje);

        }

    } catch (error) {

        console.error(error);

        alert("No se pudo conectar con el servidor.");

    }

});