// src/buscar.js

export function cargarBuscador() {
    // Obtener referencias del DOM dentro del contenedor
    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");

    // Validación: si el contenedor no existe, no hacemos nada
    if (!input || !results) return;

    // Evento principal del buscador
    input.addEventListener("input", () => {
        const query = input.value.trim().toLowerCase();

        // Si está vacío, borramos resultados
        if (query.length === 0) {
            results.innerHTML = "";
            return;
        }

        // POR AHORA: Resultados de ejemplo "dummy"
        // (luego podemos reemplazar por una consulta real a Supabase)
        results.innerHTML = `
            <p style="margin-top:10px;">Buscando: <strong>${query}</strong></p>

            <div class="search-section">
                <h4>Usuarios</h4>
                <ul>
                    <li>@${query}_fan</li>
                    <li>@${query}_dev</li>
                    <li>@${query}123</li>
                </ul>
            </div>

            <div class="search-section">
                <h4>Publicaciones</h4>
                <ul>
                    <li>Alguien habló sobre "${query}"</li>
                    <li>Nuevo hilo relacionado con "${query}"</li>
                    <li>Debate popular: ${query}</li>
                </ul>
            </div>

            <div class="search-section">
                <h4>Tendencias</h4>
                <ul>
                    <li>#${query}News</li>
                    <li>#${query}Topic</li>
                    <li>#Trending${query}</li>
                </ul>
            </div>
        `;
    });
}

