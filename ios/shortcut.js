(function () {

    document.getElementById("arvosanalaskuri")?.remove();

    const style = document.createElement("style");
    style.textContent = `
        #arvosanalaskuri {
            position: fixed;
            left: 0;
            right: 0;
            bottom: calc(env(safe-area-inset-bottom) + 10px);

            display: flex;
            justify-content: center;

            z-index: 2147483647;

            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto;
        }

        #pill {
            width: 94%;
            max-width: 540px;

            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(40px) brightness(1.15) saturate(1.3) contrast(1.2);
            -webkit-backdrop-filter: blur(40px) brightness(1.15) saturate(1.3) contrast(1.2);

            border-radius: 999px;

            box-shadow: 
                0 0 1px rgba(255,255,255,0.8) inset,
                0 8px 32px rgba(0,0,0,0.15),
                inset 0 1px 2px rgba(255,255,255,0.6),
                inset 0 -1px 1px rgba(0,0,0,0.1);

            border: 1px solid rgba(255,255,255,0.15);

            overflow: hidden;

            transition:
                max-height 0.35s cubic-bezier(.2,.9,.2,1),
                border-radius 0.35s cubic-bezier(.2,.9,.2,1);

            max-height: 88px;
            will-change: transform, box-shadow;
        }

        #pill.open {
            max-height: 680px;
            border-radius: 24px 24px 0 0;
            box-shadow: 
                0 0 1px rgba(255,255,255,0.8) inset,
                0 20px 60px rgba(0,0,0,0.2),
                inset 0 1px 2px rgba(255,255,255,0.6),
                inset 0 -1px 1px rgba(0,0,0,0.1);
        }

        #pillGlassInner {
            position: absolute;
            inset: 0;
            border-radius: inherit;
            pointer-events: none;
            z-index: 2;
            box-shadow: inset 0 2px 8px rgba(255,255,255,0.4), inset 0 -2px 8px rgba(0,0,0,0.1);
        }

        #pillClone {
            position: absolute;
            inset: 0;
            border-radius: inherit;
            z-index: 1;
            overflow: hidden;
            will-change: filter;
        }

        #pillCloneInner {
            position: absolute;
            inset: 0;
            border-radius: inherit;
            pointer-events: none;
        }

        #header {
            position: relative;
            height: 88px;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            cursor: pointer;
            user-select: none;
            z-index: 10;
        }

        #handle {
            display: none;
        }

        #title {
            font-size: 17px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.9);
            margin-top: 0;
            letter-spacing: 0.5px;
            text-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        #body {
            padding: 20px;

            opacity: 0;
            transform: translateY(10px);
            pointer-events: none;

            transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
            z-index: 5;
        }

        #pill.open #body {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }

        .rivi {
            margin-bottom: 16px;
        }

        label {
            font-size: 13px;
            color: rgba(255,255,255,0.65);
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            letter-spacing: 0.3px;
            text-transform: uppercase;
        }

        input {
            width: 100%;
            padding: 14px 16px;

            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.15);

            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px) brightness(1.2);
            -webkit-backdrop-filter: blur(20px) brightness(1.2);
            
            font-size: 16px;
            color: rgba(255, 255, 255, 0.95);
            outline: none;
            
            box-shadow: 
                inset 0 1px 2px rgba(255,255,255,0.2),
                inset 0 -1px 1px rgba(0,0,0,0.1),
                0 2px 8px rgba(0,0,0,0.08);

            transition: all 0.2s ease;
            will-change: border-color, box-shadow;
        }

        input:focus {
            border-color: rgba(255,255,255,0.3);
            background: rgba(255, 255, 255, 0.12);
            box-shadow: 
                inset 0 1px 2px rgba(255,255,255,0.3),
                inset 0 -1px 1px rgba(0,0,0,0.08),
                0 4px 16px rgba(0,0,0,0.12),
                0 0 20px rgba(255,255,255,0.1);
        }

        input::placeholder {
            color: rgba(255,255,255,0.4);
        }

        #tulos {
            margin-top: 18px;
            padding: 20px;
            border-radius: 24px;

            background: rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(30px) brightness(1.3);
            -webkit-backdrop-filter: blur(30px) brightness(1.3);
            
            border: 1px solid rgba(255,255,255,0.2);

            box-shadow: 
                inset 0 1px 2px rgba(255,255,255,0.4),
                inset 0 -1px 1px rgba(0,0,0,0.1),
                0 4px 16px rgba(0,0,0,0.08);

            text-align: center;
            will-change: transform;
        }

        #arvosana {
            font-size: 48px;
            font-weight: 900;
            letter-spacing: -0.02em;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
            will-change: color, transform;
        }

        #alateksti {
            margin-top: 8px;
            font-size: 13px;
            color: rgba(255,255,255,0.65);
            font-weight: 500;
        }

        * {
            -webkit-tap-highlight-color: transparent;
        }
    `;

    document.head.appendChild(style);

    const app = document.createElement("div");
    app.id = "arvosanalaskuri";

    app.innerHTML = `
        <div id="pill">
            <div id="pillClone">
                <div id="pillCloneInner"></div>
            </div>
            <div id="pillGlassInner"></div>

            <div id="header">
                <div id="handle"></div>
                <div id="title">Arvosanlaskuri</div>
            </div>

            <div id="body">
                <div class="rivi">
                    <label>Pisteet</label>
                    <input id="pisteet" type="number">
                </div>

                <div class="rivi">
                    <label>Läpipääsyraja (%)</label>
                    <input id="raja" type="number" value="50" min="0" max="100">
                </div>

                <div id="tulos">
                    <div id="arvosana">—</div>
                    <div id="alateksti">Ei pisteitä</div>
                </div>
            </div>

            <svg style="width: 0; height: 0; position: absolute;">
                <defs>
                    <filter id="pillGlassFilter" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
                        <feGaussianBlur id="pillFilterBlur" in="SourceGraphic" stdDeviation="0.5" result="blurred" />
                        <feImage id="pillDisplacementImage" href="" x="0" y="0" width="100" height="100" result="displacement_map" preserveAspectRatio="none" />
                        <feDisplacementMap id="pillDisplacementMap" in="blurred" in2="displacement_map" scale="15" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                        <feColorMatrix in="displaced" type="saturate" values="1.1" result="displaced_saturated" />
                        <feImage id="pillSpecularImage" href="" x="0" y="0" width="100" height="100" result="specular_layer" preserveAspectRatio="none" />
                        <feComponentTransfer in="specular_layer" result="specular_faded">
                            <feFuncA type="linear" slope="0.5" />
                        </feComponentTransfer>
                        <feBlend in="specular_faded" in2="displaced_saturated" mode="screen" />
                    </filter>
                </defs>
            </svg>
        </div>
    `;

    document.body.appendChild(app);

    const pill = document.getElementById("pill");
    const header = document.getElementById("header");
    const pillGlassInner = document.getElementById("pillGlassInner");
    const pillClone = document.getElementById("pillClone");

    // Spring physics for smooth animations
    class Spring {
        constructor(initialValue = 0, stiffness = 300, damping = 20) {
            this.value = initialValue;
            this.target = initialValue;
            this.velocity = 0;
            this.stiffness = stiffness;
            this.damping = damping;
        }

        setTarget(target) {
            this.target = target;
        }

        update(deltaTime) {
            const force = (this.target - this.value) * this.stiffness;
            const dampingForce = this.velocity * this.damping;
            this.velocity += (force - dampingForce) * deltaTime;
            this.value += this.velocity * deltaTime;
            return this.value;
        }

        isSettled() {
            return Math.abs(this.target - this.value) < 0.001 && Math.abs(this.velocity) < 0.001;
        }
    }

    // Calculate displacement map for glass refraction effect
    function calculateDisplacementMap(width, height, radius, bezelWidth, scale = 128) {
        const result = [];
        for (let i = 0; i < scale; i++) {
            const x = i / scale;
            const curve = Math.pow(1 - Math.pow(1 - x, 4), 1 / 4);
            const dx = 0.0001;
            const nextCurve = Math.pow(1 - Math.pow(Math.max(0, Math.min(1, x + dx)), 4), 1 / 4);
            const derivative = (nextCurve - curve) / dx;
            const magnitude = Math.sqrt(derivative * derivative + 1);
            const normalX = -derivative / magnitude;
            const normalY = -1 / magnitude;
            result.push(normalX * bezelWidth * curve);
        }
        return result;
    }

    // Create displacement map image
    function createDisplacementImage(width, height, radius, bezelWidth, precomputed) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        const radiusSq = radius * radius;
        const radiusPlusSq = (radius + 1) * (radius + 1);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const dx = x - radius;
                const dy = y - radius;
                const distSq = dx * dx + dy * dy;
                const idx = (y * width + x) * 4;

                if (distSq <= radiusPlusSq) {
                    const dist = Math.sqrt(distSq);
                    const progress = Math.max(0, Math.min(1, (radius - dist) / bezelWidth));
                    const mapIdx = Math.floor(progress * (precomputed.length - 1));
                    const displacement = precomputed[mapIdx] || 0;

                    const angle = dist > 0 ? Math.atan2(dy, dx) : 0;
                    const dispX = Math.cos(angle) * displacement;
                    const dispY = Math.sin(angle) * displacement;

                    data[idx] = Math.max(0, Math.min(255, 128 + dispX * 127));
                    data[idx + 1] = Math.max(0, Math.min(255, 128 + dispY * 127));
                    data[idx + 2] = 128;
                    data[idx + 3] = 255;
                } else {
                    data[idx] = 128;
                    data[idx + 1] = 128;
                    data[idx + 2] = 128;
                    data[idx + 3] = 255;
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL();
    }

    // Create specular highlight
    function createSpecularHighlight(width, height, radius) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        const lightX = Math.cos(Math.PI / 3);
        const lightY = Math.sin(Math.PI / 3);
        const radiusSq = radius * radius;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const dx = x - radius;
                const dy = y - radius;
                const distSq = dx * dx + dy * dy;
                const idx = (y * width + x) * 4;

                if (distSq <= radiusSq) {
                    const dist = Math.sqrt(distSq);
                    const normalX = dist > 0 ? dx / dist : 0;
                    const normalY = dist > 0 ? dy / dist : 0;
                    const dotProduct = Math.abs(normalX * lightX + normalY * lightY);
                    const specular = Math.pow(dotProduct, 3) * 255;

                    data[idx] = specular;
                    data[idx + 1] = specular;
                    data[idx + 2] = specular;
                    data[idx + 3] = specular * 0.6;
                } else {
                    data[idx + 3] = 0;
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL();
    }

    // Initialize glass effects
    const precomputed = calculateDisplacementMap(100, 100, 40, 15);
    const dispMapUrl = createDisplacementImage(100, 100, 40, 15, precomputed);
    const specularUrl = createSpecularHighlight(100, 100, 40);

    document.getElementById("pillDisplacementImage").setAttribute("href", dispMapUrl);
    document.getElementById("pillSpecularImage").setAttribute("href", specularUrl);

    // Spring animations
    const springs = {
        shadowBlur: new Spring(8, 400, 25),
        shadowY: new Spring(8, 400, 25),
        glassScale: new Spring(1, 350, 20),
        glassOpacity: new Spring(0.5, 300, 20)
    };

    let animationFrameId = null;

    function animationLoop() {
        const dt = Math.min(0.032, 1 / 60);

        const isOpen = pill.classList.contains("open");
        springs.shadowBlur.setTarget(isOpen ? 16 : 8);
        springs.shadowY.setTarget(isOpen ? 16 : 8);
        springs.glassScale.setTarget(isOpen ? 1.02 : 1);

        const shadowBlur = springs.shadowBlur.update(dt);
        const shadowY = springs.shadowY.update(dt);
        const glassScale = springs.glassScale.update(dt);
        const glassOpacity = springs.glassOpacity.update(dt);

        pillGlassInner.style.boxShadow = `
            inset 0 2px 8px rgba(255,255,255,${0.4 * glassOpacity}),
            inset 0 -2px 8px rgba(0,0,0,${0.1 * glassOpacity}),
            0 ${shadowY}px ${shadowBlur}px rgba(0,0,0,${0.15 * (isOpen ? 1.5 : 1)})
        `;

        if (!Object.values(springs).every(s => s.isSettled())) {
            animationFrameId = requestAnimationFrame(animationLoop);
        }
    }

    header.addEventListener("click", () => {
        pill.classList.toggle("open");
        animationFrameId = requestAnimationFrame(animationLoop);
    });

    function haePisteet() {
        let saatu = 0, maksimi = 0;

        document.querySelectorAll(".e-result-scorecount").forEach(el => {
            const m = el.innerText.match(/(\d+)\s*\/\s*(\d+)/);
            if (m) {
                saatu += +m[1];
                maksimi += +m[2];
            }
        });

        return { saatu, maksimi };
    }

    function laskeArvosana(p, max, r) {
        const raja = max * (r / 100);

        if (p < raja) {
            const a = raja / 3;
            if (p < a) return "4";
            if (p < a * 2) return "4+";
            return "4½";
        }

        const tasot = [
            "5−","5","5+","5½",
            "6−","6","6+","6½",
            "7−","7","7+","7½",
            "8−","8","8+","8½",
            "9−","9","9+","9½",
            "10−","10"
        ];

        const t = (p - raja) / (max - raja);
        let i = Math.floor(t * tasot.length);

        return tasot[Math.max(0, Math.min(i, tasot.length - 1))];
    }

    const pisteInput = document.getElementById("pisteet");
    const rajaInput = document.getElementById("raja");
    const arvosana = document.getElementById("arvosana");
    const alateksti = document.getElementById("alateksti");
    const tulosPanel = document.getElementById("tulos");

    // Spring for score color transitions
    const scoreSpring = {
        r: new Spring(239, 200, 25),
        g: new Spring(68, 200, 25),
        b: new Spring(68, 200, 25),
        scale: new Spring(1, 300, 20)
    };

    function paivita() {
        const { maksimi } = haePisteet();

        const p = parseFloat(pisteInput.value || 0);
        const r = parseFloat(rajaInput.value || 50);

        if (!maksimi) {
            arvosana.textContent = "—";
            alateksti.textContent = "Ei pisteitä";
            scoreSpring.scale.setTarget(0.9);
            return;
        }

        const g = laskeArvosana(p, maksimi, r);
        arvosana.textContent = g;
        alateksti.textContent = `${p} / ${maksimi}`;

        const num = parseFloat(g);
        const clamped = Math.max(4, Math.min(10, isNaN(num) ? 4 : num));
        const t = (clamped - 4) / 6;

        const lerp = (a, b, t) => a + (b - a) * t;

        let targetR, targetG, targetB;

        if (t < 0.5) {
            const lt = t / 0.5;
            targetR = 239;
            targetG = lerp(68, 197, lt);
            targetB = 68;
        } else {
            const lt = (t - 0.5) / 0.5;
            targetR = lerp(239, 34, lt);
            targetG = lerp(197, 197, lt);
            targetB = lerp(68, 94, lt);
        }

        scoreSpring.r.setTarget(targetR);
        scoreSpring.g.setTarget(targetG);
        scoreSpring.b.setTarget(targetB);
        scoreSpring.scale.setTarget(1);

        // Animate score appearance
        tulosPanel.style.transform = "scale(1.02)";
        setTimeout(() => {
            tulosPanel.style.transform = "scale(1)";
        }, 100);

        animationFrameId = requestAnimationFrame(updateScoreColor);
    }

    function updateScoreColor() {
        const dt = Math.min(0.032, 1 / 60);
        const r = Math.round(scoreSpring.r.update(dt));
        const g = Math.round(scoreSpring.g.update(dt));
        const b = Math.round(scoreSpring.b.update(dt));
        const sc = scoreSpring.scale.update(dt);

        arvosana.style.color = `rgb(${r},${g},${b})`;
        arvosana.style.transform = `scale(${sc})`;

        if (!Object.values(scoreSpring).every(s => s.isSettled())) {
            animationFrameId = requestAnimationFrame(updateScoreColor);
        }
    }

    pisteInput.addEventListener("input", paivita);
    rajaInput.addEventListener("input", paivita);

    pisteInput.addEventListener("focus", () => {
        pisteInput.parentElement.parentElement.style.transform = "scale(1.02)";
    });

    pisteInput.addEventListener("blur", () => {
        pisteInput.parentElement.parentElement.style.transform = "scale(1)";
    });

    rajaInput.addEventListener("focus", () => {
        rajaInput.parentElement.parentElement.style.transform = "scale(1.02)";
    });

    rajaInput.addEventListener("blur", () => {
        rajaInput.parentElement.parentElement.style.transform = "scale(1)";
    });

    // Add transition for input interactions
    const inputStyle = document.createElement("style");
    inputStyle.textContent = `
        .rivi {
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        #tulos {
            transition: transform 0.2s ease;
        }
    `;
    document.head.appendChild(inputStyle);

    setTimeout(() => {
        const { saatu } = haePisteet();
        if (!pisteInput.value) pisteInput.value = saatu;
        paivita();
    }, 300);

})();

completion();
