
/* =========================================
   JACKUX HUB - APPLICATION
   Part 1: UI Interactions
   Version: 1.0
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // ---------- ELEMENTS ----------

    const sidebar = document.getElementById("sidebar");
    const menuButton = document.getElementById("menuButton");
    const closeSidebar = document.getElementById("closeSidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const themeButton = document.getElementById("themeButton");
    const userButton = document.getElementById("userButton");

    const navLinks = document.querySelectorAll(".nav-link");

    const homePage = document.getElementById("homePage");
    const dynamicPage = document.getElementById("dynamicPage");

    const currentPage = document.getElementById("currentPage");
    const dynamicTitle = document.getElementById("dynamicTitle");
    const dynamicDescription = document.getElementById("dynamicDescription");
    const dynamicContent = document.getElementById("dynamicContent");

    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");


    // ---------- MOBILE SIDEBAR ----------

    function openSidebar() {
        sidebar.classList.add("open");
        sidebarOverlay.classList.add("show");
    }

    function closeSidebarMenu() {
        sidebar.classList.remove("open");
        sidebarOverlay.classList.remove("show");
    }

    menuButton?.addEventListener("click", openSidebar);

    closeSidebar?.addEventListener("click", closeSidebarMenu);

    sidebarOverlay?.addEventListener("click", closeSidebarMenu);


    // ---------- THEME SYSTEM ----------

    const savedTheme = localStorage.getItem("jackux-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    }

    function updateThemeIcon() {
        themeButton.textContent =
            document.body.classList.contains("light-theme")
                ? "☀"
                : "◐";
    }

    updateThemeIcon();

    themeButton?.addEventListener("click", () => {

        document.body.classList.toggle("light-theme");

        const theme = document.body.classList.contains("light-theme")
            ? "light"
            : "dark";

        localStorage.setItem("jackux-theme", theme);

        updateThemeIcon();

    });


    // ---------- LOCAL USERNAME ----------

    function updateUsername() {

        const username = localStorage.getItem("jackux-username") || "Guest";

        const userLabel = document.querySelector(".user-label");
        const userAvatar = document.querySelector(".user-avatar");

        if (userLabel) {
            userLabel.textContent = username;
        }

        if (userAvatar) {
            userAvatar.textContent = username.charAt(0).toUpperCase();
        }

    }

    updateUsername();

    userButton?.addEventListener("click", () => {

        const currentUsername =
            localStorage.getItem("jackux-username") || "";

        const username = prompt(
            "Enter a display name (saved only on this device):",
            currentUsername
        );

        if (username === null) return;

        const cleanName = username.trim().slice(0, 24);

        if (!cleanName) {
            alert("Username cannot be empty.");
            return;
        }

        localStorage.setItem("jackux-username", cleanName);

        updateUsername();

    });


    // ---------- PAGE NAVIGATION ----------

    const pages = {

        home: {
            title: "Home",
            description: "Welcome to JACKUX HUB."
        },

        categories: {
            title: "Categories",
            description: "Explore all available resource categories."
        },

        scripts: {
            title: "All Scripts",
            description: "Browse our complete script library."
        },

        favorites: {
            title: "My Favorites",
            description: "Your saved scripts will appear here."
        },

        recent: {
            title: "Recently Viewed",
            description: "Find the resources you recently explored."
        },

        trending: {
            title: "Trending",
            description: "Discover popular resources."
        },

        latest: {
            title: "Latest Scripts",
            description: "Explore newly added resources."
        },

        about: {
            title: "About JACKUX HUB",
            description: "A resource platform for Roblox developers and Luau learners."
        },

        privacy: {
            title: "Privacy",
            description: "Learn how JACKUX HUB handles locally stored preferences."
        },

        admin: {
            title: "Admin Editor",
            description: "Local content management tools will be introduced in a later phase."
        }

    };


    function showPage(pageName) {

        const page = pages[pageName];

        if (!page) return;

        currentPage.textContent = page.title;

        navLinks.forEach(link => {

            link.classList.toggle(
                "active",
                link.dataset.page === pageName
            );

        });

        closeSidebarMenu();

        if (pageName === "home") {

            homePage.classList.remove("hidden");
            dynamicPage.classList.add("hidden");

        } else {

            homePage.classList.add("hidden");
            dynamicPage.classList.remove("hidden");

            dynamicTitle.textContent = page.title;
            dynamicDescription.textContent = page.description;

            dynamicContent.replaceChildren();

            const message = document.createElement("div");

            message.className = "script-card";

            const heading = document.createElement("h3");
            heading.textContent = page.title;

            const paragraph = document.createElement("p");
            paragraph.textContent =
                "This section will be developed in an upcoming JACKUX HUB update.";

            message.append(heading, paragraph);
            dynamicContent.appendChild(message);

        }

    }


    navLinks.forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

            const pageName = link.dataset.page;

            if (pageName) {

                showPage(pageName);

                history.replaceState(
                    null,
                    "",
                    "#" + pageName
                );

            }

        });

    });


    // ---------- HERO BUTTON NAVIGATION ----------

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        if (link.classList.contains("nav-link")) return;

        link.addEventListener("click", event => {

            const pageName = link.getAttribute("href").slice(1);

            if (pages[pageName]) {

                event.preventDefault();

                showPage(pageName);

                history.replaceState(
                    null,
                    "",
                    "#" + pageName
                );

            }

        });

    });


    // ---------- SEARCH INTERFACE ----------

    function performSearch() {

        const query = searchInput.value.trim();

        if (!query) {
            alert("Enter something to search.");
            searchInput.focus();
            return;
        }

        showPage("scripts");

        dynamicTitle.textContent = "Search Results";
        dynamicDescription.textContent =
            'Searching for: "' + query + '"';

        dynamicContent.replaceChildren();

        const message = document.createElement("div");
        message.className = "script-card";

        const heading = document.createElement("h3");
        heading.textContent = "Script Search";

        const paragraph = document.createElement("p");
        paragraph.textContent =
            "Your search interface is ready. Script searching will be connected to the library in Part 2.";

        message.append(heading, paragraph);
        dynamicContent.appendChild(message);

    }

    searchButton?.addEventListener("click", performSearch);

    searchInput?.addEventListener("keydown", event => {

        if (event.key === "Enter") {
            performSearch();
        }

    });


    // ---------- INITIAL PAGE ----------

    function initializePage() {

        const hash = location.hash.replace("#", "");

        if (pages[hash]) {
            showPage(hash);
        } else {
            showPage("home");
        }

    }

    initializePage();


    // ---------- CONSOLE MESSAGE ----------

    console.log(
        "%c JACKUX HUB ",
        "background:#ed2525;color:white;font-size:20px;font-weight:bold;padding:8px;"
    );

    console.log(
        "JACKUX HUB interface initialized successfully."
    );

});
          
