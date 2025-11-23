import { supabase } from './supabase.js';

// ID del usuario logueado (Se usa para publicar y para la sección "Siguiendo")
let currentUserId = null; 

export function mostrarMVP() {
    const app = document.getElementById('app');
    app.innerHTML = ` 
    <section> 
        <h2>¿Qué está pasando?</h2> 
        
        <form id="estado-form"> 
            <textarea name="mensaje" placeholder="¿Qué estás haciendo? (Máx. 280 caracteres)" rows="3" required></textarea> 
            <button type="submit">Publicar</button> 
        </form> 

        <p id="mensaje" style="text-align:center; margin-top: 10px;"></p> 
        
        <div style="margin: 20px 0; border-bottom: 1px solid #ccc;">
            <button id="tab-para-ti" class="feed-tab active" style="margin-right: 15px;">Para ti</button>
            <button id="tab-siguiendo" class="feed-tab">Siguiendo</button>
        </div>

        <h3>Feed</h3> 
        <div id="lista-estados">Cargando...</div> 
    </section> 
    `;

    const form = document.getElementById('estado-form');
    const mensaje = document.getElementById('mensaje');
    const lista = document.getElementById('lista-estados');
    // Referencias a los nuevos IDs en español
    const tabParaTi = document.getElementById('tab-para-ti');
    const tabSiguiendo = document.getElementById('tab-siguiendo');

    // Inicializar el ID del usuario y cargar el feed
    async function initializeUserAndFeed() {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;

        if (!user) {
            mensaje.textContent = '⚠ Debes iniciar sesión para publicar y ver el feed.';
            lista.innerHTML = '';
            form.style.display = 'none'; // Ocultar el formulario
            return;
        }

        currentUserId = user.id; // Guardamos el ID del usuario logueado
        form.style.display = 'block'; // Mostrar el formulario si está logueado
        
        // Cargar la vista por defecto ("Para ti")
        cargarFeed('para_ti'); 
    }

    // Cargar Feed (Unificado para Para ti y Siguiendo)
    // Se usa 'para_ti' o 'siguiendo' como parámetro de vista
    async function cargarFeed(view = 'para_ti') {
        lista.innerHTML = 'Cargando estados...';

        if (!currentUserId) {
             // Si el ID del usuario no está disponible, cargamos solo la vista universal
             view = 'para_ti';
        }

        let query = supabase
            .from('estados')
            // Hacemos JOIN con la tabla usuarios para mostrar el handle
            .select(`
                id,
                mensaje,
                creado_en,
                usuarios(handle, nombre) 
            `)
            .order('creado_en', { ascending: false });
        
        // Lógica de filtrado para la sección "Siguiendo"
        if (view === 'siguiendo' && currentUserId) {
            
            // 1. Obtener los IDs de los usuarios que sigo
            const { data: seguidos, error: followError } = await supabase
                .from('seguimientos')
                .select('seguido_id')
                .eq('seguidor_id', currentUserId);

            if (followError) {
                lista.innerHTML = 'Error al cargar seguidos.';
                console.error(followError);
                return;
            }
            
            const followedIds = seguidos.map(f => f.seguido_id);
            
            if (followedIds.length === 0) {
                lista.innerHTML = '<p>No sigues a nadie. ¡Ve al feed "Para ti" para encontrar usuarios!</p>';
                return;
            }

            query = query.in('usuario_id', followedIds);
        }

        const { data, error } = await query.limit(20); 

        if (error) {
            lista.innerHTML = `Error al cargar feed: ${error.message}`;
            return;
        }

        renderFeedList(data);
    }

    // Función para renderizar el HTML del feed (sin cambios)
    function renderFeedList(data) {
        if (!data || data.length === 0) {
            lista.innerHTML = '<p>No hay estados que mostrar.</p>';
            return;
        }

        lista.innerHTML = '';
        data.forEach(estado => {
            const userHandle = estado.usuarios ? estado.usuarios.handle : '@Desconocido';
            
            const div = document.createElement('div');
            div.className = 'estado-post';
            div.style.marginBottom = '15px';
            div.style.border = '1px solid #eee';
            div.style.padding = '10px';

            div.innerHTML = ` 
                <div style="font-weight: bold;">${userHandle}</div>
                <p style="margin: 5px 0;">${estado.mensaje}</p> 
                <small style="color: #666;">${new Date(estado.creado_en).toLocaleString()}</small>
            `;
            lista.appendChild(div);
        });
    }

    // Subir nuevo estado (Tweet)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        mensaje.textContent = '';
        
        if (!currentUserId) {
            mensaje.textContent = '⚠ Debes iniciar sesión para publicar.';
            return;
        }
        
        const mensajeTexto = form.mensaje.value.trim();

        const { error } = await supabase.from('estados').insert([
            {
                mensaje: mensajeTexto,
                usuario_id: currentUserId, // Usamos el ID del usuario logueado
            },
        ]);
        
        if (error) {
            mensaje.textContent = '❌Error al publicar: ' + error.message;
        } else {
            mensaje.textContent = '✅Estado publicado correctamente';
            form.reset();
            // Recargar la vista actual después de publicar
            const activeTabId = document.querySelector('.feed-tab.active').id;
            // Mapeamos el ID de la pestaña a la vista interna
            const viewToLoad = activeTabId === 'tab-para-ti' ? 'para_ti' : 'siguiendo';
            cargarFeed(viewToLoad);
        }
    });

    // Eventos de Pestañas (Actualizados)
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

    initializeUserAndFeed();
}