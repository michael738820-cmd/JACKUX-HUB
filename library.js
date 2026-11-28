
/* =========================================
   JACKUX HUB - SCRIPT LIBRARY
   Part 2: Categories and Script Browsing
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const data = window.JACKUX_DATA;

    if (!data) {
        console.error("JACKUX_DATA was not found. Check data.js.");
        return;
    }

    const categoryGrid = document.getElementById("categoryGrid");
    const featuredScripts = document.getElementById("featuredScripts");
    const latestScripts = document.getElementById("latestScripts");
    const dynamicContent = document.getElementById("dynamicContent");
    const dynamicTitle = document.getElementById("dynamicTitle");
    const dynamicDescription = document.getElementById("dynamicDescription");

    const getSaved = (key) => {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch {
            return [];
        }
    };

    const save = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    let favorites = getSaved("jackux-favorites");
    let recent = getSaved("jackux-recent");

    function makeElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    }

    function getCategory(id) {
        return data.categories.find(category => category.id === id);
    }

    function createScriptCard(script) {
        const card = makeElement("article", "script-card");

        const category = getCategory(script.category);
        const heading = makeElement("h3", "", script.name);
        const description = makeElement("p", "", script.description);
        const type = makeElement(
            "span",
            "script-type",
            script.type || "Script"
        );

        const actions = makeElement("div", "script-card-actions");

        const viewButton = makeElement("button", "", "View Script");
        viewButton.type = "button";
        viewButton.addEventListener("click", () => {
            showScript(script.id);
        });

        const favoriteButton = makeElement(
            "button",
            "favorite-button",
            favorites.includes(script.id) ? "♥ Saved" : "♡ Save"
        );

        favoriteButton.type = "button";
        favoriteButton.addEventListener("click", () => {
            toggleFavorite(script.id);
            favoriteButton.textContent = favorites.includes(script.id)
                ? "♥ Saved"
                : "♡ Save";
            updateCounts();
        });

        actions.append(viewButton, favoriteButton);

        if (category) {
            card.append(makeElement("small", "", category.name));
        }

        card.append(heading, description, type, actions);
        return card;
    }

    function renderCards(container, scripts) {
        if (!container) return;

        container.replaceChildren();

        if (!scripts.length) {
            container.append(
                makeElement("p", "empty-message", "No scripts found here yet.")
            );
            return;
        }

        scripts.forEach(script => {
            container.appendChild(createScriptCard(script));
        });
    }

    
    function renderCategories(container = categoryGrid) {
        if (!container) return;

        container.replaceChildren();

        data.categories.forEach(category => {
            const card = makeElement("article", "category-card");

            card.append(
                makeElement("div", "category-icon", category.icon || "📁"),
                makeElement("h3", "", category.name),
                makeElement("p", "", category.description),
                makeElement(
                    "small",
                    "",
                    `${data.scripts.filter(s => s.category === category.id).length} scripts`
                )
            );

            const button = makeElement("button", "", "Explore Category");
            button.type = "button";
            button.addEventListener("click", () => {
                showCategory(category.id);
            });

            card.appendChild(button);
            container.appendChild(card);
        });
    }
   

    function toggleFavorite(id) {
        favorites = favorites.includes(id)
            ? favorites.filter(item => item !== id)
            : [...favorites, id];

        save("jackux-favorites", favorites);
    }

    function updateCounts() {
        const scriptCount = document.getElementById("scriptCount");
        const categoryCount = document.getElementById("categoryCount");
        const favoriteCount = document.getElementById("favoriteCount");

        if (scriptCount) scriptCount.textContent = data.scripts.length;
        if (categoryCount) categoryCount.textContent = data.categories.length;
        if (favoriteCount) favoriteCount.textContent = favorites.length;
    }

    function openDynamicPage(title, description) {
        document.getElementById("homePage")?.classList.add("hidden");
        document.getElementById("dynamicPage")?.classList.remove("hidden");

        if (dynamicTitle) dynamicTitle.textContent = title;
        if (dynamicDescription) dynamicDescription.textContent = description;

        if (dynamicContent) dynamicContent.replaceChildren();

        const currentPage = document.getElementById("currentPage");
        if (currentPage) currentPage.textContent = title;
    }

    function showCategory(id) {
        const category = getCategory(id);
        if (!category) return;

        const scripts = data.scripts.filter(s => s.category === id);

        openDynamicPage(category.name, category.description);
        renderCards(dynamicContent, scripts);
        history.replaceState(null, "", "#categories");
    }

    function showScript(id) {
        const script = data.scripts.find(item => item.id === id);
        if (!script) return;

        recent = [id, ...recent.filter(item => item !== id)].slice(0, 20);
        save("jackux-recent", recent);

        openDynamicPage(script.name, script.description);

        const category = getCategory(script.category);
        const details = makeElement("div", "script-card");

        details.append(
            makeElement("h2", "", script.name),
            makeElement("p", "", script.description),
            makeElement("p", "", `Type: ${script.type || "Script"}`),
            makeElement("p", "", `Location: ${script.location || "Not specified"}`)
        );

        const code = makeElement("pre", "code-viewer");
        const codeText = makeElement("code", "", script.code || "");
        code.appendChild(codeText);

        const copyButton = makeElement("button", "", "Copy Code");
        copyButton.type = "button";
        copyButton.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(script.code || "");
                copyButton.textContent = "Copied!";
            } catch {
                copyButton.textContent = "Copy unavailable";
            }
        });

        const backButton = makeElement("button", "", "Back to Scripts");
        backButton.type = "button";
        backButton.addEventListener("click", showAllScripts);

        details.append(code, copyButton, backButton);
        dynamicContent.appendChild(details);

        history.replaceState(null, "", `#script-${script.id}`);
    }

    function showAllScripts() {
        openDynamicPage("All Scripts", "Browse the complete script library.");
        renderCards(dynamicContent, data.scripts);
        history.replaceState(null, "", "#scripts");
    }

    function showFavorites() {
        const scripts = data.scripts.filter(s => favorites.includes(s.id));
        openDynamicPage("My Favorites", "Scripts saved on this device.");
        renderCards(dynamicContent, scripts);
    }

    function showRecent() {
        const scripts = recent
            .map(id => data.scripts.find(s => s.id === id))
            .filter(Boolean);

        openDynamicPage("Recently Viewed", "Your recently opened scripts.");
        renderCards(dynamicContent, scripts);
    }

    function showSearchResults(query) {
        const term = query.toLowerCase();

        const results = data.scripts.filter(script => {
            const category = getCategory(script.category);

            return (
                script.name.toLowerCase().includes(term) ||
                script.description.toLowerCase().includes(term) ||
                (category && category.name.toLowerCase().includes(term))
            );
        });

        openDynamicPage("Search Results", `Results for: ${query}`);
        renderCards(dynamicContent, results);
    }

    // Home page content
    renderCategories();
    renderCards(featuredScripts, data.scripts.slice(0, 3));
    renderCards(latestScripts, [...data.scripts].reverse().slice(0, 3));
    updateCounts();
    
    // Intercept navigation before the existing Part 1 handlers.
    document.addEventListener("click", event => {
        const link = event.target.closest("a[href^='#']");
        if (!link) return;

        const page = link.dataset.page || link.getAttribute("href").slice(1);

        const pages = {
            categories: () => {
                openDynamicPage("Categories", "Explore all resource categories.");
                renderCategories(dynamicContent);
            },
            scripts: showAllScripts,
            favorites: showFavorites,
            recent: showRecent,
            trending: showAllScripts,
            latest: () => {
                openDynamicPage("Latest Scripts", "Recently added resources.");
                renderCards(dynamicContent, [...data.scripts].reverse());
            }
        };

        if (pages[page]) {
            event.preventDefault();
            event.stopImmediatePropagation();
            pages[page]();
        }
    }, true);


    // Search
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");

    function runSearch(event) {
        const query = searchInput?.value.trim();
        if (!query) return;

        event?.preventDefault();
        event?.stopImmediatePropagation();
        showSearchResults(query);
    }

    searchButton?.addEventListener("click", runSearch, true);

    searchInput?.addEventListener("keydown", event => {
        if (event.key === "Enter") runSearch(event);
    }, true);

    console.log("JACKUX HUB script library loaded.");
});
      
