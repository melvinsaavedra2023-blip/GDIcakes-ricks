async function handleCredentialResponse(response) {

    try {

        const respuesta = await fetch("http://localhost:3000/api/google", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                token: response.credential

            })

        });

        const datos = await respuesta.json();

        if (datos.success) {

            localStorage.setItem(

                "usuario",

                JSON.stringify(datos.usuario)

            );

            window.location.href = "index.html";

        } else {

            alert(datos.mensaje);

        }

    } catch (error) {

        console.error(error);

        alert("Error al iniciar sesión con Google.");

    }

}

window.handleCredentialResponse = handleCredentialResponse;