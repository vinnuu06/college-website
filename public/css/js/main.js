document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       LOADER HANDLING
    ========================== */

    const loader = document.getElementById("loader");
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => loader.remove(), 500);
        }, 1200);
    }


    /* =========================
       LOGIN DROPDOWN (Mobile Safe)
    ========================== */

    const loginButton = document.querySelector(".group > button");
    const dropdown = document.querySelector(".group > div");

    if (loginButton && dropdown) {
        loginButton.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("hidden");
        });

        document.addEventListener("click", () => {
            dropdown.classList.add("hidden");
        });
    }


    /* =========================
       ACTIVE LINK HIGHLIGHT
    ========================== */

    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll("nav a").forEach(link => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.remove("hover:text-lion-gold");
            link.classList.add("text-lion-gold");
        }
    });

});
