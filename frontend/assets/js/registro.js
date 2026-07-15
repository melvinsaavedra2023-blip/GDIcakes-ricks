const formulario = document.getElementById("registroForm");

formulario.addEventListener("submit", async function (e) {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmar = document.getElementById("confirmar").value.trim();

    if (
        !nombre ||
        !apellido ||
        !correo ||
        !usuario ||
        !password ||
        !confirmar
    ) {

        alert("Complete todos los campos.");

        return;

    }

    if (password !== confirmar) {

        alert("Las contraseñas no coinciden.");

        return;

    }

    try {

        const respuesta = await fetch("https://gdicakes-ricks.onrender.com/api/registro", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                nombre,
                apellido,
                correo,
                usuario,
                password

            })

        });

        const datos = await respuesta.json();

        if (datos.success) {

            alert("Cuenta creada correctamente.");

            window.location.href = "login.html";

        } else {

            alert(datos.mensaje);

        }

    } catch (error) {

        console.log(error);

        alert("Error del servidor.");

    }

});