const tl = gsap.timeline();

const animationTimeline = () => {
    gsap.set(".screen", { autoAlpha: 0, scale: 0.9 });

    // Sequence
    tl.to(".one", { duration: 0.8, autoAlpha: 1, scale: 1 })
      .to(".one", { duration: 0.6, autoAlpha: 0, y: -20, delay: 1.5 })
      
      .to(".three", { duration: 0.6, autoAlpha: 1, scale: 1 })
      .to(".three", { duration: 0.6, autoAlpha: 0, y: -20, delay: 1.2 })

      .to(".four", { duration: 0.6, autoAlpha: 1, scale: 1 })
      .to(".four", { duration: 0.6, autoAlpha: 0, scale: 0.8, delay: 1.5 })

      .to(".five .idea-1", { duration: 0.5, autoAlpha: 1, y: 0 })
      .to(".five .idea-2", { duration: 0.5, autoAlpha: 1, y: 0, delay: 0.5 })
      .to(".five .idea-3", { duration: 0.5, autoAlpha: 1, scale: 1.1, delay: 0.5 })
      .to(".five .magic-text", { duration: 0.8, autoAlpha: 1, scale: 1.2, ease: "back.out" })
      .to(".five", { duration: 0.5, autoAlpha: 0, delay: 1.5 })

      // --- PHOTO SECTION (Speeded Up) ---
      .to(".six", { duration: 0.5, autoAlpha: 1, scale: 1 }) // Instant transition
      .from(".image-wrap", { duration: 0.8, scale: 0, rotate: -20, ease: "back.out(1.7)" }, "-=0.3")
      .from(".wish-hbd", { duration: 0.6, y: 20, opacity: 0 }, "-=0.2")
      .to(".six", { duration: 0.6, autoAlpha: 0, delay: 2.5 })

      // Proposal
      .to(".proposal-section", { duration: 0.8, autoAlpha: 1, scale: 1, onComplete: setupProposal });
};

// --- Proposal Logic ---
const messages = ["Are you sure? 🥺", "Think again! ❤️", "I'll be so sad...", "Pretty please?", "You're breaking my heart!"];
let mIdx = 0;

function setupProposal() {
    const yes = document.getElementById("yesBtn");
    const no = document.getElementById("noBtn");

    no.addEventListener("click", () => {
        no.innerText = messages[mIdx];
        mIdx = (mIdx + 1) % messages.length;
        
        // Make "Yes" grow bigger
        const scale = gsap.getProperty(yes, "scale") || 1;
        gsap.to(yes, { scale: scale + 0.3, duration: 0.2 });
        
        // Move "No" randomly
        gsap.to(no, { x: Math.random() * 60 - 30, y: Math.random() * 60 - 30, duration: 0.2 });
    });

    yes.addEventListener("click", () => {
        document.getElementById("proposalSection").innerHTML = `
            <h2 class="elegant-font" style="font-size: 4.5rem;">Yay! Happy Valentine's!</h2>
        `;
        startFireworks();
    });
}

// --- Firework/Magic Background ---
const canvas = document.getElementById("magicCanvas");
const ctx = canvas.getContext("2d");
let parts = [];

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener("resize", resize);
resize();

function startFireworks() {
    function create(x, y) {
        for(let i=0; i<30; i++) {
            parts.push({
                x, y,
                dx: (Math.random()-0.5)*10,
                dy: (Math.random()-0.5)*10,
                radius: Math.random()*3,
                color: `hsl(${Math.random()*360}, 100%, 65%)`,
                a: 1
            });
        }
    }
    function loop() {
        ctx.clearRect(0,0,canvas.width, canvas.height);
        parts.forEach((p, i) => {
            p.x += p.dx; p.y += p.dy; p.a -= 0.015;
            ctx.globalAlpha = p.a; ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2); ctx.fill();
            if(p.a <= 0) parts.splice(i, 1);
        });
        if(Math.random() < 0.15) create(Math.random()*canvas.width, Math.random()*canvas.height);
        requestAnimationFrame(loop);
    }
    loop();
}

// Run (with support for your JSON customization)
fetch("customize.json")
    .then(r => r.json())
    .then(data => {
        if(data.name) document.getElementById("name").innerText = data.name;
        if(data.greetingText) document.getElementById("greetingText").innerText = data.greetingText;
        if(data.wishText) document.getElementById("wishText").innerText = data.wishText;
        if(data.imagePath) document.getElementById("imagePath").src = data.imagePath;
        animationTimeline();
    }).catch(animationTimeline);