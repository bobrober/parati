// ==================== CÓDIGO MATRIX OPTIMIZADO ====================
const canvas = document.getElementById("MatrixCanvas");
const ctx = canvas.getContext("2d");

let speed = 10;
let message = "Te quiero";
let color = "rgba(255, 105, 187, 1)";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array.from({ length: columns }).fill(1);

document.getElementById("speedcontrol").addEventListener("input", (e) => {
    speed = parseInt(e.target.value);
});
document.getElementById("textoinput").addEventListener("input", (e) => {
    message = e.target.value;
});
document.getElementById("colorinput").addEventListener("input", (e) => {
    color = e.target.value;
});

function draw() {
    // Fondo con transparencia (efecto de desvanecimiento)
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = color;
    ctx.font = fontSize + "px arial";

    // Dibuja el efecto Matrix
    for (let i = 0; i < drops.length; i++) {
        ctx.fillText(message, i * fontSize, drops[i] * fontSize);
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
    }, 1000 / speed);
}

animate();

// ==================== CÓDIGO EXPLOSIÓN OPTIMIZADO ====================
const explosionContainer = document.getElementById('explosionContainer');
let activeWords = [];
let activeParticles = [];

// Límites optimizados para mejor rendimiento
const MAX_ACTIVE_WORDS = 50; // Reducido de 100 a 50
const MAX_ACTIVE_PARTICLES = 80; // Reducido de 150 a 80
const MAX_SIMULTANEOUS_EXPLOSIONS = 3; // Límite de explosiones simultáneas
const CLEANUP_INTERVAL = 1000; // Limpieza más frecuente
const CLICK_THROTTLE = 300; // Tiempo mínimo entre clics (ms)

// Variables para throttling
let lastClickTime = 0;
let explosionCount = 0;

// Pool de objetos reutilizable para evitar crear/destruir elementos constantemente
const elementPool = {
    words: [],
    particles: [],
    
    getWordElement() {
        if (this.words.length > 0) {
            return this.words.pop();
        }
        const element = document.createElement('div');
        element.className = 'explosion-word';
        return element;
    },
    
    returnWordElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
        // Resetear propiedades básicas
        if (element) {
            element.style.transform = '';
            element.style.opacity = '';
            element.textContent = '';
            this.words.push(element);
        }
    },
    
    getParticleElement() {
        if (this.particles.length > 0) {
            return this.particles.pop();
        }
        const element = document.createElement('div');
        element.className = 'explosion-particle';
        return element;
    },
    
    returnParticleElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
        // Resetear propiedades básicas
        if (element) {
            element.style.transform = '';
            element.style.opacity = '';
            element.style.background = '';
            this.particles.push(element);
        }
    }
};

// Función de limpieza optimizada
function cleanupExplosions() {
    // Filtrar y limpiar palabras muertas
    const aliveWords = [];
    for (let i = 0; i < activeWords.length; i++) {
        const word = activeWords[i];
        if (word.life > 0 && word.distance < word.maxDistance * 1.5) {
            aliveWords.push(word);
        } else {
            word.destroy();
        }
    }
    activeWords = aliveWords;

    // Filtrar y limpiar partículas muertas
    const aliveParticles = [];
    for (let i = 0; i < activeParticles.length; i++) {
        const particle = activeParticles[i];
        if (particle.life > 0) {
            aliveParticles.push(particle);
        } else {
            particle.destroy();
        }
    }
    activeParticles = aliveParticles;

    // Actualizar contador de explosiones
    explosionCount = Math.max(0, explosionCount - 1);
}

// Limpieza más frecuente
setInterval(cleanupExplosions, CLEANUP_INTERVAL);

// Clase optimizada para palabras explosivas
class ExplodingWord {
    constructor(x, y, text, angle, distance, wordColor) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.text = text;
        this.angle = angle;
        this.distance = distance;
        this.speed = Math.random() * 6 + 3; // Velocidad ligeramente reducida
        this.maxDistance = Math.random() * 250 + 150; // Distancia reducida
        this.life = 200; // Vida reducida
        this.decay = Math.random() * 2 + 2; // Decay más rápido
        this.element = null;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 4; // Rotación reducida
        this.scale = 0.1;
        this.targetScale = Math.random() * 0.4 + 0.6; // Escala ligeramente menor
        this.scaleSpeed = 0.1; // Escalado más rápido
        this.waveOffset = Math.random() * Math.PI * 2;
        this.wordColor = wordColor;
        
        this.createElement();
    }

    createElement() {
        this.element = elementPool.getWordElement();
        this.element.textContent = this.text;
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.color = this.wordColor;
        this.element.style.transform = `scale(${this.scale}) rotate(${this.rotation}deg)`;
        explosionContainer.appendChild(this.element);
    }

    update() {
        this.distance += this.speed;
        
        // Efecto de onda simplificado
        const waveEffect = Math.sin(this.distance * 0.02 + this.waveOffset) * 10;
        this.x = this.startX + Math.cos(this.angle) * (this.distance + waveEffect);
        this.y = this.startY + Math.sin(this.angle) * (this.distance + waveEffect);
        
        this.speed *= 0.988; // Desaceleración más rápida
        this.rotation += this.rotationSpeed;
        
        if (this.scale < this.targetScale) {
            this.scale += this.scaleSpeed;
        } else {
            this.scale *= 0.996;
        }
        
        const distanceDecay = this.distance > this.maxDistance ? 4 : 1;
        this.life -= this.decay * distanceDecay;
        
        if (this.element) {
            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';
            this.element.style.opacity = Math.max(0, this.life / 200);
            this.element.style.transform = `scale(${this.scale}) rotate(${this.rotation}deg)`;
        }
        
        return this.life > 0 && this.distance < this.maxDistance * 1.5;
    }

    destroy() {
        if (this.element) {
            elementPool.returnWordElement(this.element);
            this.element = null;
        }
    }
}

// Clase optimizada para partículas
class ExplosionParticle {
    constructor(x, y, angle, speed, particleColor) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed || Math.random() * 5 + 2;
        this.distance = 0;
        this.life = Math.random() * 30 + 20; // Vida reducida
        this.maxLife = this.life;
        this.element = null;
        this.size = Math.random() * 2 + 1;
        this.particleColor = particleColor;
        this.createElement();
    }

    createElement() {
        this.element = elementPool.getParticleElement();
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.width = this.size + 'px';
        this.element.style.height = this.size + 'px';
        this.element.style.background = this.particleColor;
        explosionContainer.appendChild(this.element);
    }

    update() {
        this.distance += this.speed;
        this.x = this.startX + Math.cos(this.angle) * this.distance;
        this.y = this.startY + Math.sin(this.angle) * this.distance;
        this.speed *= 0.985; // Desaceleración más rápida
        this.life--;
        
        if (this.element) {
            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';
            this.element.style.opacity = Math.max(0, this.life / this.maxLife);
        }
        
        return this.life > 0;
    }

    destroy() {
        if (this.element) {
            elementPool.returnParticleElement(this.element);
            this.element = null;
        }
    }
}

// Función optimizada para crear explosión
function createGrenadeExplosion(x, y) {
    const currentTime = Date.now();
    
    // Throttling: prevenir clicks muy rápidos
    if (currentTime - lastClickTime < CLICK_THROTTLE) {
        return;
    }
    
    // Límite de explosiones simultáneas
    if (explosionCount >= MAX_SIMULTANEOUS_EXPLOSIONS) {
        return;
    }
    
    // Límite de elementos activos
    if (activeWords.length > MAX_ACTIVE_WORDS * 0.7) {
        return;
    }

    lastClickTime = currentTime;
    explosionCount++;

    const currentText = document.getElementById("textoinput").value || "Te quiero";
    const currentColor = document.getElementById("colorinput").value;
    
    // Crear pulso central optimizado
    const centerPulse = document.createElement('div');
    centerPulse.className = 'explosion-center';
    centerPulse.style.left = (x - 3) + 'px';
    centerPulse.style.top = (y - 3) + 'px';
    explosionContainer.appendChild(centerPulse);
    
    // Palabra central con animación más rápida
    const centerWord = document.createElement('div');
    centerWord.className = 'explosion-word';
    centerWord.textContent = currentText;
    centerWord.style.left = x + 'px';
    centerWord.style.top = y + 'px';
    centerWord.style.color = currentColor;
    centerWord.style.fontSize = '28px'; // Ligeramente menor
    centerWord.style.fontWeight = 'bold';
    centerWord.style.transform = 'translate(-50%, -50%) scale(0.8)';
    centerWord.style.zIndex = '1000';
    centerWord.style.textShadow = `0 0 15px ${currentColor}`;
    centerWord.style.opacity = '1';
    explosionContainer.appendChild(centerWord);
    
    // Animación más rápida
    setTimeout(() => {
        centerWord.style.transform = 'translate(-50%, -50%) scale(1.1)';
        centerWord.style.transition = 'transform 0.15s ease-out, opacity 1s ease-out';
        
        setTimeout(() => {
            centerWord.style.opacity = '0';
            setTimeout(() => {
                if (centerWord.parentNode) {
                    centerWord.parentNode.removeChild(centerWord);
                }
            }, 1000);
        }, 200);
    }, 30);
    
    // Remover pulso más rápido
    setTimeout(() => {
        if (centerPulse.parentNode) {
            centerPulse.parentNode.removeChild(centerPulse);
        }
    }, 300);

    // Menos palabras explosivas para mejor rendimiento
    const numWords = 8; // Reducido de 12 a 8
    const angleStep = (Math.PI * 2) / numWords;
    
    for (let i = 0; i < numWords; i++) {
        const angle = angleStep * i + (Math.random() - 0.5) * 0.2;
        const word = new ExplodingWord(x, y, currentText, angle, 0, currentColor);
        activeWords.push(word);
    }

    // Segunda onda más pequeña
    setTimeout(() => {
        const numSecondWave = 6; // Reducido de 8 a 6
        const secondAngleStep = (Math.PI * 2) / numSecondWave;
        
        for (let i = 0; i < numSecondWave; i++) {
            const angle = secondAngleStep * i + Math.PI / numSecondWave;
            const word = new ExplodingWord(x, y, currentText, angle, 20, currentColor);
            word.speed *= 0.8;
            activeWords.push(word);
        }
    }, 150);

    // Menos partículas
    const numParticles = 20; // Reducido de 30 a 20
    for (let i = 0; i < numParticles; i++) {
        const angle = (Math.PI * 2 * i) / numParticles + (Math.random() - 0.5) * 0.3;
        const speed = Math.random() * 3 + 2;
        const particle = new ExplosionParticle(x, y, angle, speed, currentColor);
        activeParticles.push(particle);
    }
}

// Animación optimizada con requestAnimationFrame más eficiente
let lastAnimationTime = 0;
const ANIMATION_INTERVAL = 16; // ~60 FPS

function animateExplosions(currentTime) {
    // Throttling de animación
    if (currentTime - lastAnimationTime < ANIMATION_INTERVAL) {
        requestAnimationFrame(animateExplosions);
        return;
    }
    
    lastAnimationTime = currentTime;

    // Actualizar palabras explosivas con filtrado en lugar de splice
    for (let i = activeWords.length - 1; i >= 0; i--) {
        const word = activeWords[i];
        if (!word.update()) {
            word.destroy();
            activeWords.splice(i, 1);
        }
    }

    // Actualizar partículas explosivas
    for (let i = activeParticles.length - 1; i >= 0; i--) {
        const particle = activeParticles[i];
        if (!particle.update()) {
            particle.destroy();
            activeParticles.splice(i, 1);
        }
    }

    requestAnimationFrame(animateExplosions);
}

// Iniciar animación optimizada
requestAnimationFrame(animateExplosions);

// Event listener optimizado con throttling
canvas.addEventListener("click", (e) => {
    const x = e.clientX;
    const y = e.clientY;
    createGrenadeExplosion(x, y);
});