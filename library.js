/* =========================================
   JACKUX HUB - NESTED SCRIPT LIBRARY
   Game folders > Categories > Scripts
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const data = window.JACKUX_DATA;
    if (!data) {
        console.error("JACKUX_DATA was not found. Check data.js.");
        return;
    }

    data.gameFolders = data.gameFolders || [];
    data.categories = data.categories || [];
    data.scripts = data.scripts || [];

    const categoryGrid = document.getElementById("categoryGrid");
    const featuredScripts = document.getElementById("featuredScripts");
    const latestScripts = document.getElementById("latestScripts");
    const dynamicContent = document.getElementById("dynamicContent");
    const dynamicTitle = document.getElementById("dynamicTitle");
    const dynamicDescription = document.getElementById("dynamicDescription");

    const getSaved = key => {
        try { return JSON.parse(localStorage.getItem(key)) || []; }
        catch { return []; }
    };
    const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

    let favorites = getSaved("jackux-favorites");
    let recent = getSaved("jackux-recent");

    const makeElement = (tag, className, text) => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (text !== undefined) el.textContent = text;
        return el;
    };

    const getFolder = id => data.gameFolders.find(item => item.id === id);
    const getCategory = id => data.categories.find(item => item.id === id);
    const getScripts = categoryId => data.scripts.filter(item => item.category === categoryId);

    function openPage(title, description) {
        document.getElementById("homePage")?.classList.add("hidden");
        document.getElementById("dynamicPage")?.classList.remove("hidden");
        if (dynamicTitle) dynamicTitle.textContent = title;
        if (dynamicDescription) dynamicDescription.textContent = description || "";
        dynamicContent?.replaceChildren();
        const current = document.getElementById("currentPage");
        if (current) current.textContent = title;
        dynamicContent?.classList.remove("content-enter");
        void dynamicContent?.offsetWidth;
        dynamicContent?.classList.add("content-enter");
    }

    function addBackButton(label, callback) {
        const button = makeElement("button", "library-back-button", "← " + label);
        button.type = "button";
        button.addEventListener("click", callback);
        dynamicContent.appendChild(button);
    }

    function updateCounts() {
        const scripts = document.getElementById("scriptCount");
        const categories = document.getElementById("categoryCount");
        const saved = document.getElementById("favoriteCount");
        if (scripts) scripts.textContent = data.scripts.length;
        if (categories) categories.textContent = data.categories.length;
        if (saved) saved.textContent = favorites.length;
    }

    function toggleFavorite(id) {
        favorites = favorites.includes(id)
            ? favorites.filter(item => item !== id)
            : [...favorites, id];
        save("jackux-favorites", favorites);
    }

    function createFolderCard(folder) {
        const card = makeElement("article", "category-card folder-card");
        const count = data.categories.filter(c => c.gameId === folder.id).length;
        card.append(
            makeElement("div", "category-icon", folder.icon || "📁"),
            makeElement("h3", "", folder.name),
            makeElement("p", "", folder.description || "Browse this game folder."),
            makeElement("small", "folder-count", count + " categories")
        );
        const button = makeElement("button", "folder-open-button", "Open Folder →");
        button.type = "button";
        button.addEventListener("click", () => showFolder(folder.id));
        card.appendChild(button);
        return card;
    }

    function createCategoryCard(category) {
        const card = makeElement("article", "category-card nested-category-card");
        card.append(
            makeElement("div", "category-icon", category.icon || "📁"),
            makeElement("h3", "", category.name),
            makeElement("p", "", category.description || "Browse scripts in this category."),
            makeElement("small", "folder-count", getScripts(category.id).length + " scripts")
        );
        const button = makeElement("button", "folder-open-button", "Open Category →");
        button.type = "button";
        button.addEventListener("click", () => showCategory(category.id));
        card.appendChild(button);
        return card;
    }

    function createScriptCard(script) {
        const card = makeElement("article", "script-card animated-card");
        const category = getCategory(script.category);
        const folder = category && getFolder(category.gameId);
        card.append(
            makeElement("small", "script-category", (folder ? folder.name + " / " : "") + (category ? category.name : "Unsorted")),
            makeElement("h3", "", script.name),
            makeElement("p", "", script.description || "No description provided."),
            makeElement("span", "script-type", script.type || "Script")
        );

        const actions = makeElement("div", "script-card-actions");
        const view = makeElement("button", "library-action-primary", "View Details");
        view.type = "button";
        view.addEventListener("click", () => showScript(script.id));

        const favorite = makeElement("button", "favorite-button", favorites.includes(script.id) ? "♥ Saved" : "♡ Save");
        favorite.type = "button";
        favorite.addEventListener("click", () => {
            toggleFavorite(script.id);
            favorite.textContent = favorites.includes(script.id) ? "♥ Saved" : "♡ Save";
            updateCounts();
        });
        actions.append(view, favorite);
        card.appendChild(actions);
        return card;
    }

    function renderList(container, items, createCard, emptyText) {
        if (!container) return;
        container.replaceChildren();
        if (!items.length) {
            container.appendChild(makeElement("p", "empty-message", emptyText));
            return;
        }
        items.forEach((item, index) => {
            const card = createCard(item);
            card.style.setProperty("--card-index", index);
            container.appendChild(card);
        });
    }

    function showFolders() {
        openPage("Game Folders", "Choose a Roblox game to explore its categories.");
        renderList(dynamicContent, data.gameFolders, createFolderCard, "No game folders yet.");
        history.replaceState(null, "", "#categories");
    }

    function showFolder(id) {
        const folder = getFolder(id);
        if (!folder) return;
        openPage(folder.name, folder.description);
        addBackButton("All Game Folders", showFolders);
        const categories = data.categories.filter(item => item.gameId === id);
        renderList(dynamicContent, categories, createCategoryCard, "No categories in this folder yet.");
        history.replaceState(null, "", "#game-" + id);
    }

    function showCategory(id) {
        const category = getCategory(id);
        if (!category) return;
        const folder = getFolder(category.gameId);
        openPage(category.name, category.description);
        addBackButton(folder ? "Back to " + folder.name : "Game Folders", () => folder ? showFolder(folder.id) : showFolders());
        renderList(dynamicContent, getScripts(id), createScriptCard, "No scripts in this category yet.");
        history.replaceState(null, "", "#category-" + id);
    }

    function showScript(id) {
        const script = data.scripts.find(item => item.id === id);
        if (!script) return;
        recent = [id, ...recent.filter(item => item !== id)].slice(0, 20);
        save("jackux-recent", recent);

        const category = getCategory(script.category);
        const folder = category && getFolder(category.gameId);
        openPage(script.name, script.description);
        addBackButton("Back to " + (category ? category.name : "Scripts"), () => category ? showCategory(category.id) : showAllScripts());

        const details = makeElement("article", "script-card script-detail-card");
        details.append(
            makeElement("h2", "", script.name),
            makeElement("p", "", script.description || ""),
            makeElement("p", "script-location", "Path: " + (folder ? folder.name + " / " : "") + (category ? category.name : "Unsorted")),
            makeElement("p", "script-location", "Type: " + (script.type || "Script")),
            makeElement("p", "script-location", "Location: " + (script.location || "Not specified"))
        );

        const code = makeElement("pre", "code-viewer");
        code.appendChild(makeElement("code", "", script.code || "Script content has not been added yet."));
        const copy = makeElement("button", "library-action-primary", "Copy Code");
        copy.type = "button";
        copy.disabled = !script.code;
        if (!script.code) copy.title = "Code has not been added yet.";
        copy.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(script.code);
                copy.textContent = "Copied!";
            } catch {
                copy.textContent = "Copy unavailable";
            }
        });
        details.append(code, copy);
        dynamicContent.appendChild(details);
    }

    function showAllScripts() {
        openPage("All Scripts", "Browse every script in JACKUX HUB.");
        renderList(dynamicContent, data.scripts, createScriptCard, "No scripts found.");
        history.replaceState(null, "", "#scripts");
    }

    function showFavorites() {
        openPage("My Favorites", "Scripts saved on this device.");
        renderList(dynamicContent, data.scripts.filter(s => favorites.includes(s.id)), createScriptCard, "You have not saved any scripts yet.");
    }

    function showRecent() {
        const items = recent.map(id => data.scripts.find(s => s.id === id)).filter(Boolean);
        openPage("Recently Viewed", "Your recently opened scripts.");
        renderList(dynamicContent, items, createScriptCard, "You have not viewed any scripts yet.");
    }

    function showSearchResults(query) {
        const term = query.toLowerCase();
        const results = data.scripts.filter(script => {
            const category = getCategory(script.category);
            const folder = category && getFolder(category.gameId);
            return [script.name, script.description, category?.name, folder?.name]
                .some(value => (value || "").toLowerCase().includes(term));
        });
        openPage("Search Results", 'Results for: "' + query + '"');
        renderList(dynamicContent, results, createScriptCard, "No matching scripts found.");
    }

    // Home now displays top-level game folders.
    renderList(categoryGrid, data.gameFolders, createFolderCard, "No game folders yet.");
    renderList(featuredScripts, data.scripts.slice(0, 3), createScriptCard, "No featured scripts yet.");
    renderList(latestScripts, [...data.scripts].reverse().slice(0, 3), createScriptCard, "No scripts yet.");
    updateCounts();

    // Route navigation links through the nested library.
    document.addEventListener("click", event => {
        const link = event.target.closest("a[href^='#']");
        if (!link) return;
        const page = link.dataset.page || link.getAttribute("href").slice(1);
        const pages = {
            categories: showFolders,
            scripts: showAllScripts,
            favorites: showFavorites,
            recent: showRecent,
            trending: showAllScripts,
            latest: () => {
                openPage("Latest Scripts", "Recently added resources.");
                renderList(dynamicContent, [...data.scripts].reverse(), createScriptCard, "No scripts yet.");
            }
        };
        if (pages[page]) {
            event.preventDefault();
            event.stopImmediatePropagation();
            pages[page]();
        }
    }, true);

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

    console.log("JACKUX HUB nested library loaded.");
});
