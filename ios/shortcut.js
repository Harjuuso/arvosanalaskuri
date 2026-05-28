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

            background: #fefefd;
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);

            border-radius: 999px;

            box-shadow: none;

            border: 1px solid rgba(0,0,0,0.08);

            overflow: hidden;

            transition:
                max-height 0.35s cubic-bezier(.2,.9,.2,1),
                border-radius 0.35s cubic-bezier(.2,.9,.2,1);

            max-height: 88px;
        }

        #pill.open {
            max-height: 640px;
            border-radius: 24px 24px 0 0;
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
        }

        #handle {
            display: none;
        }

        #title {
            font-size: 17px;
            font-weight: 600;
            color: #111827;
            margin-top: 0;
        }

        #body {
            padding: 16px;

            opacity: 0;
            transform: translateY(10px);
            pointer-events: none;

            transition: all 0.25s ease;
        }

        #pill.open #body {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }

        .rivi {
            margin-bottom: 12px;
        }

        label {
            font-size: 14px;
            color: rgba(0,0,0,0.55);
            display: block;
            margin-bottom: 6px;
        }

        input {
            width: 100%;
            padding: 16px;

            border-radius: 12px;
            border: 1px solid rgba(0,0,0,0.12);

            background: #fff;
            font-size: 18px;
            color: #111827;
            outline: none;
        }

        #tulos {
            margin-top: 14px;
            padding: 18px;
            border-radius: 16px;

            background: #fff;
            border: 1px solid rgba(0,0,0,0.08);

            text-align: center;
        }

        #arvosana {
            font-size: 44px;
            font-weight: 800;
        }

        #alateksti {
            margin-top: 6px;
            font-size: 14px;
            color: rgba(0,0,0,0.55);
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

            <div id="header">
                <div id="handle"></div>
                <div id="title">Arvosanalaskuri</div>
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

        </div>
    `;

    document.body.appendChild(app);

    const pill = document.getElementById("pill");
    const header = document.getElementById("header");

    header.onclick = () => {
        pill.classList.toggle("open");
    };

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

    function paivita() {

        const { maksimi } = haePisteet();

        const p = parseFloat(pisteInput.value || 0);
        const r = parseFloat(rajaInput.value || 50);

        if (!maksimi) {
            arvosana.textContent = "—";
            alateksti.textContent = "Ei pisteitä";
            return;
        }

        const g = laskeArvosana(p, maksimi, r);

        arvosana.textContent = g;
        alateksti.textContent = `${p} / ${maksimi}`;

        const num = parseFloat(g);
        const clamped = Math.max(4, Math.min(10, isNaN(num) ? 4 : num));
        const t = (clamped - 4) / 6;

        const lerp = (a,b,t)=>a+(b-a)*t;

        let rCol,gCol,b;

        if (t < 0.5) {
            const lt = t/0.5;
            rCol = 239;
            gCol = lerp(68,197,lt);
            b = 68;
        } else {
            const lt = (t-0.5)/0.5;
            rCol = lerp(239,34,lt);
            gCol = lerp(197,197,lt);
            b = lerp(68,94,lt);
        }

        arvosana.style.color = `rgb(${rCol},${gCol},${b})`;
    }

    pisteInput.oninput = paivita;
    rajaInput.oninput = paivita;

    setTimeout(() => {
        const { saatu } = haePisteet();
        if (!pisteInput.value) pisteInput.value = saatu;
        paivita();
    }, 300);

})();

completion();
