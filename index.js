const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let width, height;
let meteors = [];
let stars = [];
let animationActive = true;
let isMobile = window.innerWidth <= 768;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    isMobile = window.innerWidth <= 768;
    initStars();
    initMeteors();
}

window.addEventListener('resize', resize);

function initStars() {
    stars = [];
    const starCount = isMobile ? 100 : 150;
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5,
            opacity: Math.random(),
            speed: Math.random() * 0.02 + 0.005
        });
    }
}

class Meteor {
    constructor() {
        this.init();
    }
    
    init() {
        // Tạo vị trí ngẫu nhiên trên toàn màn hình
        this.x = Math.random() * width * 1.5;
        this.y = Math.random() * height - height * 0.3;
        this.length = isMobile ? Math.random() * 60 + 50 : Math.random() * 100 + 80;
        this.speed = isMobile ? Math.random() * 2 + 1.5 : Math.random() * 2.5 + 2;
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.4 + 0.1;
        this.width = isMobile ? Math.random() * 1.2 + 0.4 : Math.random() * 1.5 + 0.5;
    }
    
    draw() {
        ctx.save();
        ctx.beginPath();
        let gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.length * 0.8, this.y - this.length * 0.8);
        gradient.addColorStop(0, `rgba(212, 175, 55, ${this.opacity})`);
        gradient.addColorStop(0.1, `rgba(255, 255, 255, ${this.opacity * 0.8})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.length, this.y - this.length);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width/2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
        ctx.restore();
    }
    
    update() {
        this.x -= this.speed * 1.2;
        this.y += this.speed;
        if (this.opacity < this.maxOpacity) this.opacity += 0.005;
        if (this.x < -this.length || this.y > height + this.length) {
            this.init();
        }
    }
}

resize();

function initMeteors() {
    meteors = [];
    const meteorCount = isMobile ? 20 : 25;
    for (let i = 0; i < meteorCount; i++) {
        meteors.push(new Meteor());
    }
}

initMeteors();

function animate() {
    if (!animationActive) return;
    ctx.fillStyle = 'rgba(3, 5, 8, 0.2)';
    ctx.fillRect(0, 0, width, height);
    
    stars.forEach(s => {
        s.opacity += s.speed;
        if (s.opacity > 1 || s.opacity < 0) s.speed = -s.speed;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(s.opacity)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
    });
    
    meteors.forEach(m => {
        m.update();
        m.draw();
    });
    
    requestAnimationFrame(animate);
}

animate();

function startExperience() {
    const overlay = document.getElementById('start-overlay');
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.visibility = 'hidden';
    }, 1500);
    
    setTimeout(() => {
        const card = document.getElementById('invitation-card');
        card.classList.add('visible');
        
        // Show corner GIFs
        document.querySelectorAll('.corner-gif').forEach(gif => {
            gif.classList.add('show');
        });
    }, 3000);
}

function confirmAttendance() {
    const invitationCard = document.getElementById('invitation-card');
    const thankYouScreen = document.getElementById('thank-you-screen');
    
    invitationCard.style.opacity = '0';
    invitationCard.style.transform = 'scale(0.8) translateY(-40px)';
    
    // Hide corner GIFs
    document.querySelectorAll('.corner-gif').forEach(gif => {
        gif.style.opacity = '0';
    });
    
    setTimeout(() => {
        invitationCard.style.display = 'none';
        thankYouScreen.style.display = 'block';
        
        setTimeout(() => {
            thankYouScreen.classList.add('visible');
        }, 50);
    }, 800);
}
