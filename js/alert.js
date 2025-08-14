export default function aletr(message, type = "info", duration = 3000) {
  const notif = document.getElementById("mainNotification");

  // Limpiar clases previas y contenido
  notif.className = "hidden";
  notif.textContent = message;
  notif.classList.add(type);

  // Mostrar con animación
  notif.classList.remove("hidden");
  setTimeout(() => notif.classList.add("show"), 10);

  // Ocultar después del tiempo indicado
  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => notif.classList.add("hidden"), 300);
  }, duration);
}
