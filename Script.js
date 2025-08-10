// Obtiene el canvas y el contexto para dibujar
const canvas = document.getElementById("MatrixCanvas");
const ctx = canvas.getContext("2d");

// Variables de control
let speed = 10;
let message = "Te quiero";
let color = "#ff69bb";

// Ajusta el tamaño del canvas a la ventana
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Configuración de la animación Matrix
let fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array.from({ length: columns }).fill(1);

// Eventos para los controles de velocidad, texto y color
document.getElementById("speedcontrol").addEventListener("input", (e) => {
    speed = parseInt(e.target.value);
});
document.getElementById("textoinput").addEventListener("input", (e) => {
    message = e.target.value;
});
// Corrige el selector eliminando el espacio extra
document.getElementById("colorinput").addEventListener("input", (e) => {
    color = e.target.value;
});

// Evento para crear la explosión al hacer clic en el canvas
canvas.addEventListener("click", (e) => {
    const x = e.clientX;
    const y = e.clientY;
    explosion(x, y); // Corrige el nombre de la función
});

// Función para crear la explosión de texto en el punto clicado
function explosion(x, y) {
    const parts = 10; // Cantidad de partículas/textos
    for (let i = 0; i < parts; i++) {
        const angle = (Math.PI * 2 * i) / parts;
        const dx = Math.cos(angle) * 5;
        const dy = Math.sin(angle) * 5;
        animateexplosion(x, y, dx, dy);
    }
}

// Función para animar cada texto de la explosión
function animateexplosion(x, y, dx, dy) {
    let life = 30; // Duración de la animación

    function frame() {
        if (life <= 0) return;
        ctx.fillStyle = color;
        ctx.font = "bold 15px arial";
        // Dibuja el texto en la posición animada
        ctx.fillText(message, x + dx * (35 - life), y + dy * (35 - life));
        life--;
        requestAnimationFrame(frame);
    }
    frame();
}

function draw() {
    // Fondo semitransparente para el efecto de desvanecimiento
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Configura el color y la fuente para el texto Matrix
    ctx.fillStyle = color; // color del texto
    ctx.font = fontSize + "px arial";

    // Dibuja los caracteres en las columnas
    for (let i = 0; i < drops.length; i++) {
        const text = message;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        // Resetea la posición del drop si ha llegado al fondo o con una probabilidad
        if (drops[i] * fontSize > canvas.height || Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

function animate() {
    setTimeout(() => {
        requestAnimationFrame(animate);
        draw();
    }, 1000 / speed); // Controla la velocidad de la animación
}
animate();