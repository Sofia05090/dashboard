// =============================================
// MVP PRINCIPAL — TIMELINE TIPO TWITTER
// Maneja: publicación, feed "Para ti", feed "Siguiendo"
// =============================================

import { supabase } from './supabase.js';

// ID global del usuario autenticado
let currentUserId = null;

/**
 * FUNCIÓN PRINCIPAL
 * Carga toda la interfaz del timeline
 */
export function mostrarMVP() {
    
    const app = document.getElementById('app');

    // ------------------------------------------
    // ESTRUCTURA HTML PRINCIPAL DEL TIMELINE
    // ------------------------------------------
    app.innerHTML = `
        <section>
            <h2>¿Qué está pasando?</h2>

            <!-- Formulario para publicar un nuevo estado -->
            <form id="estado-form">
                <textarea name="mensaje" placeholder="¿Qué estás pensando? (máx. 280 caracteres)" rows="3" required></textarea>
                <button type="submit">Publicar</button>
            </form>

            <p id="mensaje" style="text-align:center; margin-top:10px;"></p>

            <!-- Pestañas de navegación del feed -->
            <div style="margin:20px 0; border-bottom:1px solid #ccc;">
                <button id="tab-para-ti" class="feed-tab active" style="margin-right:15px;">Para ti</button>
                <button id="tab-siguiendo" class="feed-tab">Siguiendo</button>
            </div>

            <!-- Contenedor donde se renderizan los tweets -->
            <div id="lista-estados">Cargando...</div>
        </section>
    `;

    // ------------------------------------------
    // REFERENCIAS A ELEMENTOS DEL DOM
    // ------------------------------------------
    const form = document.getElementById('estado-form');
    const mensaje = document.getElementById('mensaje');
    const lista = document.getElementById('lista-estados');
    const tabParaTi = document.getElementById('tab-para-ti');
    const tabSiguiendo = document.getElementById('tab-siguiendo');

    // 1. OBTENER USUARIO Y CARGAR EL FEED INICIAL
   
    async function initializeUserAndFeed() {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;

        // Si NO hay sesión, ocultar publicación y feed
        if (!user) {
            mensaje.textContent = '⚠ Debes iniciar sesión para ver y publicar estados.';
            lista.innerHTML = '';
            form.style.display = 'none';
            return;
        }

        // Guardar ID globalmente
        currentUserId = user.id;

        // Mostrar formulario
        form.style.display = 'block';

        // Cargar feed inicial
        cargarFeed('para_ti');
    }

    // 2. FUNCIÓN PARA CARGAR EL FEED
    // view = "para_ti" o "siguiendo"
   
    async function cargarFeed(view = 'para_ti') {

        lista.innerHTML = 'Cargando estados...';

        // Si no hay usuario, solo mostrar todos los estados
        if (!currentUserId) view = 'para_ti';

        // Consulta base: feed universal
        let query = supabase
            .from('estados')
            .select(`
                id,
                mensaje,
                creado_en,
                usuarios(handle, nombre)
            `)
            .order('creado_en', { ascending: false });

       // FILTRO PARA "SIGUIENDO"
       
        if (view === 'siguiendo') {

            const { data: seguidos, error: followErr } = await supabase
                .from('seguimientos')
                .select('seguido_id')
                .eq('seguidor_id', currentUserId);

            if (followErr) {
                lista.innerHTML = 'Error cargando seguidos.';
                return;
            }

            const followIds = seguidos.map(s => s.seguido_id);

            // Si no sigue a nadie, mensaje informativo
            if (followIds.length === 0) {
                lista.innerHTML = `
                    <p>No sigues a nadie todavía.</p>
                    <small>Ve a "Para ti" para descubrir usuarios interesantes.</small>
                `;
                return;
            }

            // Filtrar estados SOLO de seguidos
            query = query.in('usuario_id', followIds);
        }

        // Ejecutar consulta final
        const { data, error } = await query.limit(20);

        if (error) {
            lista.innerHTML = 'Error cargando timeline: ' + error.message;
            return;
        }

        renderFeedList(data);
    }

    // 3. RENDERIZAR ESTADOS EN EL FEED
    
    function renderFeedList(data) {

        if (!data || data.length === 0) {
            lista.innerHTML = '<p>No hay publicaciones disponibles.</p>';
            return;
        }

        lista.innerHTML = '';

        data.forEach(estado => {

            const handle = estado.usuarios?.handle || '@Desconocido';

            // Crear tarjeta de estado
            const card = document.createElement('div');
            card.className = 'estado-post';
            card.style.cssText = `
                margin-bottom:15px;
                border:1px solid #eee;
                padding:10px;
                border-radius:8px;
            `;

            // Construir HTML del tweet
            card.innerHTML = `
                <div style="font-weight:bold;">${handle}</div>
                <p style="margin:5px 0;">${estado.mensaje}</p>
                <small style="color:#666;">${new Date(estado.creado_en).toLocaleString()}</small>
            `;

            lista.appendChild(card);
        });
    }

    // 4. PUBLICAR UN NUEVO ESTADO
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        mensaje.textContent = '';

        if (!currentUserId) {
            mensaje.textContent = '⚠ Debes iniciar sesión.';
            return;
        }

        const texto = form.mensaje.value.trim();

        // Validaciones básicas del tweet
        if (texto.length === 0) {
            mensaje.textContent = 'El mensaje está vacío.';
            return;
        }

        if (texto.length > 280) {
            mensaje.textContent = 'El mensaje supera los 280 caracteres.';
            return;
        }

        // Insertar en la BD
        const { error } = await supabase.from('estados').insert([
            {
                mensaje: texto,
                usuario_id: currentUserId
            }
        ]);

        if (error) {
            mensaje.textContent = '❌ Error al publicar: ' + error.message;
            return;
        }

        mensaje.textContent = '✅ Estado publicado correctamente';
        form.reset();

        // Recargar la pestaña actual
        const active = document.querySelector('.feed-tab.active').id;
        const view = active === 'tab-para-ti' ? 'para_ti' : 'siguiendo';

        cargarFeed(view);
    });

    // 5. CAMBIAR ENTRE PESTAÑAS
   
    tabParaTi.addEventListener('click', () => {
        tabSiguiendo.classList.remove('active');
        tabParaTi.classList.add('active');
        cargarFeed('para_ti');
    });

    tabSiguiendo.addEventListener('click', () => {
        tabParaTi.classList.remove('active');
        tabSiguiendo.classList.add('active');
        cargarFeed('siguiendo');
    });

  // 6. INICIALIZAR MVP
   
    initializeUserAndFeed();
}
