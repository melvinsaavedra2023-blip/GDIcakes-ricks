const menuToggle = document.getElementById("menuToggle");

const menu = document.getElementById("menu");

if(menuToggle){

    menuToggle.addEventListener("click",()=>{

        menu.classList.toggle("activo");

        const icono = menuToggle.querySelector("i");

        if(menu.classList.contains("activo")){

            icono.className="ri-close-line";

        }else{

            icono.className="ri-menu-line";

        }

    });

    document.querySelectorAll("#menu a").forEach(link=>{

        link.addEventListener("click",()=>{

            menu.classList.remove("activo");

            menuToggle.querySelector("i").className="ri-menu-line";

        });

    });

}