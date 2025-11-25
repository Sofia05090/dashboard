import { supabase } from './supabase.js';

export async function mostrarAdmin() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <h2>Panel de Administración 👑</h2>

    <div>
      <input id="adminSearch" placeholder="Buscar usuario por email...">
      <button id="refreshUsers">🔄 Recargar</button>
    </div>

    <div id="usersContainer">Cargando usuarios...</div>
  `;

  document.getElementById("refreshUsers").addEventListener("click", cargarUsuarios);
  document.getElementById("adminSearch").addEventListener("input", filtrarUsuarios);

  await cargarUsuarios();
}

let listaUsuarios = [];

async function cargarUsuarios() {
  const cont = document.getElementById("usersContainer");
  cont.innerHTML = "Cargando usuarios...";

  const { data, error } = await supabase.from("profiles").select("*");

  if (error) {
    cont.innerHTML = `<p>Error al cargar usuarios.</p>`;
    return;
  }

  listaUsuarios = data;
  mostrarListaUsuarios(listaUsuarios);
}

function mostrarListaUsuarios(usuarios) {
  const cont = document.getElementById("usersContainer");

  if (!usuarios.length) {
    cont.innerHTML = "<p>No hay usuarios encontrados.</p>";
    return;
  }

  cont.innerHTML = usuarios
    .map(u => `
      <div class="user-card">
        <p><b>Email:</b> ${u.email}</p>
        <p><b>Nombre:</b> ${u.username || "(sin nombre)"}</p>
        <p><b>Creado:</b> ${new Date(u.created_at).toLocaleString()}</p>

        <button data-del="${u.id}" class="delete-btn">❌ Eliminar</button>
        <button data-ban="${u.id}" class="ban-btn">🚫 Suspender</button>
      </div>
    `)
    .join("");

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => eliminarUsuario(btn.dataset.del));
  });

  document.querySelectorAll(".ban-btn").forEach(btn => {
    btn.addEventListener("click", () => suspenderUsuario(btn.dataset.ban));
  });
}

function filtrarUsuarios() {
  const q = document.getElementById("adminSearch").value.trim().toLowerCase();

  const filtrados = listaUsuarios.filter(u =>
    u.email.toLowerCase().includes(q)
  );

  mostrarListaUsuarios(filtrados);
}

async function eliminarUsuario(id) {
  const confirmacion = confirm("¿Seguro que deseas eliminar este usuario?");
  if (!confirmacion) return;

  await supabase.from("profiles").delete().eq("id", id);

  cargarUsuarios();
}

async function suspenderUsuario(id) {
  await supabase
    .from("profiles")
    .update({ suspended: true })
    .eq("id", id);

  alert("Usuario suspendido");
  cargarUsuarios();
}
