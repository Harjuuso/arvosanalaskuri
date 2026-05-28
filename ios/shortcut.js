(function () {

    document.getElementById("arvosanalaskuri")?.remove();

    const tyyli = document.createElement("style");
    tyyli.textContent = `
        :root {
            --bg: #000000;
            --text: #f3f4f6;
            --muted: rgba(255,255,255,0.6);
            --input: rgba(255,255,255,0.06);
            --border: rgba(255,255,255,0.10);
            --card: rgba(255,255,255,0.04);
        }

        @media (prefers-color-scheme: light) {
            :root {
                --bg: #f4f4f4;
                --text: #111827;
                --muted: rgba(0,0,0,0.55);
                --input: rgba(0,0,0,0.05);
                --border: rgba(0,0,0,0.08);
                --card: #ffffff;
            }
        }

        #arvosanalaskuri {
            position: fixed;
            left: 0;
            right: 0;
            bottom: env(safe-area-inset-bottom);

            width: 100%;
            max-width: 100%;
            margin: 0 auto;

            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto;
            color: var(--text);
            z-index: 2147483647;

            border-radius: 22px 22px 0 0;
            overflow: hidden;

            background: var(--bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);

            border-top: 1px solid var(--border);

            transform: translateY(calc(100% - 60px));
            transition: transform 0.25s ease;
        }

        #arvosanalaskuri.avaa {
            transform: translateY(0);
        }

        #ylapalkki {
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;

            font-size: 15px;
            font-weight: 600;
            letter-spacing: 0.3px;

            background: var(--card);
            border-bottom: 1px solid var(--border);

            user-select: none;
        }

        #sisalto {
            padding: 14px;
        }

        .rivi {
            margin-bottom: 12px;
        }

        label {
            font-size: 11px;
            color: var(--muted);
            display: block;
            margin-bottom: 6px;
        }

        input {
            width: 100%;
            padding: 16px;
            border-radius: 12px;

            border: 1px solid var(--border);
            background: var(--input);

            color: var(--text);
            font-size: 16px;
            outline: none;
        }

        input:focus {
            border-color: rgba(99,102,241,0.6);
            box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
        }

        #tulos {
            margin-top: 14px;
            padding: 18px;
            border-radius: 16px;

            background: var(--card);
            border: 1px solid var(--border);
            text-align: center;
        }

        #arvosana {
            font-size: 34px;
            font-weight: 800;
        }

        #alateksti {
            margin-top: 6px;
            font-size: 11px;
            color: var(--muted);
        }
    `;

    document.head.appendChild(tyyli);

    const laatikko = document.createElement("div");
    laatikko.id = "arvosanalaskuri";

    laatikko.innerHTML = `
        <div id="ylapalkki">
            <span id="nuoli">▲</span>
            Arvosanalaskuri
        </div>

        <div id="sisalto">
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
    `;

    document.body.appendChild(laatikko);

    const ylapalkki = document.getElementById("ylapalkki");
    const nuoli = document.getElementById("nuoli");

    let auki = false;

    ylapalkki.onclick = () => {
        auki = !auki;
        laatikko.classList.toggle("avaa", auki);
        nuoli.textContent = auki ? "▼" : "▲";
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

    function laskeArvosana(pisteet, maksimi, raja) {
        const rajaPisteina = maksimi * (raja / 100);

        if (pisteet < rajaPisteina) {
            const askel = rajaPisteina / 3;
            if (pisteet < askel) return "4";
            if (pisteet < askel * 2) return "4+";
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

        const t = (pisteet - rajaPisteina) / (maksimi - rajaPisteina);
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
        alateksti.textContent = `${p} / ${maksimi} pistettä`;

        const n = parseFloat(g);
        const clamped = Math.max(4, Math.min(10, isNaN(n) ? 4 : n));
        const t = (clamped - 4) / 6;

        const lerp = (a, b, t) => a + (b - a) * t;

        let rCol, gCol, b;

        if (t < 0.5) {
            const lt = t / 0.5;
            rCol = 239;
            gCol = lerp(68, 197, lt);
            b = 68;
        } else {
            const lt = (t - 0.5) / 0.5;
            rCol = lerp(239, 34, lt);
            gCol = lerp(197, 197, lt);
            b = lerp(68, 94, lt);
        }

        arvosana.style.color = `rgb(${rCol}, ${gCol}, ${b})`;
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