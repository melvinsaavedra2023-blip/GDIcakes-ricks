const btnCatalogo = document.getElementById("btnCatalogo");
const btnNosotros = document.getElementById("btnNosotros");

if (btnCatalogo) {

    btnCatalogo.addEventListener("click", () => {

        document.getElementById("catalogo").scrollIntoView({

            behavior: "smooth"

        });

    });

}

if (btnNosotros) {

    btnNosotros.addEventListener("click", () => {

        window.location.href = "nosotros.html";

    });

}