// ==================== CÓDIGO MATRIX ORIGINAL ====================
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

// ==================== CÓDIGO EXPLOSIÓN TIPO GRANADA ====================
const explosionContainer = document.getElementById('explosionContainer');
let activeWords = [];
let activeParticles = [];

// Clase para palabras explosivas
class ExplodingWord {
    constructor(x, y, text, angle, distance, wordColor) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.text = text;
        this.angle = angle;
        this.distance = distance;
        this.speed = Math.random() * 8 + 4;
        this.maxDistance = Math.random() * 300 + 200;
        this.life = 255;
        this.decay = Math.random() * 2 + 1.5;
        this.element = null;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 6;
        this.scale = 0.1;
        this.targetScale = Math.random() * 0.5 + 0.7;
        this.scaleSpeed = 0.08;
        this.waveOffset = Math.random() * Math.PI * 2;
        this.wordColor = wordColor;
        
        this.createElement();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'explosion-word';
        this.element.textContent = this.text;
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.color = this.wordColor;
        this.element.style.transform = `scale(${this.scale}) rotate(${this.rotation}deg)`;
        explosionContainer.appendChild(this.element);
    }

    update() {
        this.distance += this.speed;
        
        const waveEffect = Math.sin(this.distance * 0.02 + this.waveOffset) * 15;
        this.x = this.startX + Math.cos(this.angle) * (this.distance + waveEffect);
        this.y = this.startY + Math.sin(this.angle) * (this.distance + waveEffect);
        
        this.speed *= 0.985;
        this.rotation += this.rotationSpeed;
        
        if (this.scale < this.targetScale) {
            this.scale += this.scaleSpeed;
        } else {
            this.scale *= 0.998;
        }
        
        const distanceDecay = this.distance > this.maxDistance ? 3 : 1;
        this.life -= this.decay * distanceDecay;
        
        if (this.element) {
            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';
            this.element.style.opacity = Math.max(0, this.life / 255);
            this.element.style.transform = `scale(${this.scale}) rotate(${this.rotation}deg)`;
        }
        
        return this.life > 0 && this.distance < this.maxDistance * 1.5;
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// Clase para partículas
class ExplosionParticle {
    constructor(x, y, angle, speed, particleColor) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed || Math.random() * 6 + 2;
        this.distance = 0;
        this.life = Math.random() * 40 + 30;
        this.maxLife = this.life;
        this.element = null;
        this.size = Math.random() * 3 + 1;
        this.particleColor = particleColor;
        this.createElement();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'explosion-particle';
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
        this.speed *= 0.98;
        this.life--;
        
        if (this.element) {
            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';
            this.element.style.opacity = Math.max(0, this.life / this.maxLife);
        }
        
        return this.life > 0;
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// Función para crear explosión tipo granada
function createGrenadeExplosion(x, y) {
    // Usar el texto y color de los controles
    const currentText = document.getElementById("textoinput").value || "Te quiero";
    const currentColor = document.getElementById("colorinput").value;
    
    // Crear pulso central
    const centerPulse = document.createElement('div');
    centerPulse.className = 'explosion-center';
    centerPulse.style.left = (x - 3) + 'px';
    centerPulse.style.top = (y - 3) + 'px';
    explosionContainer.appendChild(centerPulse);
    
    // Crear palabra central estática
    const centerWord = document.createElement('div');
    centerWord.className = 'explosion-word';
    centerWord.textContent = currentText;
    centerWord.style.left = x + 'px';
    centerWord.style.top = y + 'px';
    centerWord.style.color = currentColor;
    centerWord.style.fontSize = '32px';
    centerWord.style.fontWeight = 'bold';
    centerWord.style.transform = 'translate(-50%, -50%) scale(0.8)';
    centerWord.style.zIndex = '1000';
    centerWord.style.textShadow = `0 0 20px ${currentColor}`;
    centerWord.style.opacity = '1';
    explosionContainer.appendChild(centerWord);
    
    // Animar palabra central con solo zoom
    setTimeout(() => {
        centerWord.style.transform = 'translate(-50%, -50%) scale(1.2)';
        centerWord.style.transition = 'transform 0.2s ease-out, opacity 1.5s ease-out';
        
        setTimeout(() => {
            centerWord.style.opacity = '0';
            setTimeout(() => {
                if (centerWord.parentNode) {
                    centerWord.parentNode.removeChild(centerWord);
                }
            }, 1500);
        }, 300);
    }, 50);
    
    // Remover pulso
    setTimeout(() => {
        if (centerPulse.parentNode) {
            centerPulse.parentNode.removeChild(centerPulse);
        }
    }, 400);

    // Crear palabras explosivas en círculo perfecto
    const numWords = 18;
    const angleStep = (Math.PI * 2) / numWords;
    
    for (let i = 0; i < numWords; i++) {
        const angle = angleStep * i + (Math.random() - 0.5) * 0.3;
        const word = new ExplodingWord(x, y, currentText, angle, 0, currentColor);
        activeWords.push(word);
    }

    // Segunda onda
    setTimeout(() => {
        const numSecondWave = 12;
        const secondAngleStep = (Math.PI * 2) / numSecondWave;
        
        for (let i = 0; i < numSecondWave; i++) {
            const angle = secondAngleStep * i + Math.PI / numSecondWave;
            const word = new ExplodingWord(x, y, currentText, angle, 30, currentColor);
            word.speed *= 0.7;
            activeWords.push(word);
        }
    }, 200);

    // Crear partículas circulares
    const numParticles = 50;
    for (let i = 0; i < numParticles; i++) {
        const angle = (Math.PI * 2 * i) / numParticles + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 4 + 3;
        const particle = new ExplosionParticle(x, y, angle, speed, currentColor);
        activeParticles.push(particle);
    }
}

// Animación de explosiones
function animateExplosions() {
    // Actualizar palabras explosivas
    activeWords = activeWords.filter(word => {
        if (word.update()) {
            return true;
        } else {
            word.destroy();
            return false;
        }
    });

    // Actualizar partículas explosivas
    activeParticles = activeParticles.filter(particle => {
        if (particle.update()) {
            return true;
        } else {
            particle.destroy();
            return false;
        }
    });

    requestAnimationFrame(animateExplosions);
}

// Iniciar animación de explosiones
animateExplosions();

// Event listener para explosiones - SOLO la explosión tipo granada
canvas.addEventListener("click", (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    // Solo la nueva explosión tipo granada
    createGrenadeExplosion(x, y);
});
