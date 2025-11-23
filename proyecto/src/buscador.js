// ===============================
// BUSCADOR - SEARCH (Twitter)
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");

    if (!input || !results) return;

    input.addEventListener("input", () => {
        const query = input.value.trim().toLowerCase();

        if (query.length === 0) {
            results.innerHTML = "";
            return;
        }

        // Dummy placeholder
        results.innerHTML = `
            <p>Resultados para: <strong>${query}</strong></p>
            <ul>
                <li>Usuario relacionado "${query}"</li>
                <li>Tweets mencionando "${query}"</li>
                <li>Tendencias similares</li>
            </ul>
        `;
    });

});
