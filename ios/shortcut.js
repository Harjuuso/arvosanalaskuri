(function () {

    document.getElementById("arvosanalaskuri")?.remove();

    const style = document.createElement("style");
    style.textContent = `
        #arvosanalaskuri {
            position: fixed;
            left: 0;
            right: 0;
            bottom: env(safe-area-inset-bottom);

            width: 100%;
            max-width: 100%;
            margin: 0 auto;

            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto;
            z-index: 2147483647;

            background: #f4f4f4;
            border-radius: 18px 18px 0 0;

            transform: translateY(calc(100% - 90px));
            transition: transform 0.35s cubic-bezier(.2,.9,.2,1);

            box-shadow: 0 -10px 35px rgba(0,0,0,0.15);

            padding-bottom: env(safe-area-inset-bottom);
        }

        #arvosanalaskuri.avaa {
            transform: translateY(0);
        }

        #ylapalkki {
            height: 70px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 6px;

            user-select: none;
        }

        #kahva {
            width: 42px;
            height: 5px;
            border-radius: 999px;
            background: rgba(0,0,0,0.2);
        }

        #otsikko {
            font-size: 20px;
            font-weight: 800;
            color: #111827;
        }

        #sisalto {
            padding: 18px;
        }

        .rivi {
            margin-bottom: 12px;
        }

        label {
            font-size: 18px;
            color: rgba(0,0,0,0.55);
            display: block;
            margin-bottom: 6px;
        }

        input {
            width: 100%;
            padding: 18px;
            border-radius: 12px;

            border: 1px solid rgba(0,0,0,0.12);
            background: #ffffff;

            font-size: 18px;
            outline: none;
            color: #111827;

            box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
        }

        input:focus {
            border-color: rgba(0,122,255,0.6);
            box-shadow: 0 0 0 3px rgba(0,122,255,0.15);
        }

        #tulos {
            margin-top: 14px;
            padding: 18px;
            border-radius: 16px;

            background: #ffffff;
            border: 1px solid rgba(0,0,0,0.08);

            text-align: center;

            box-shadow: 0 2px 10px rgba(0,0,0,0.04);
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
    `;

    document.head.appendChild(style);

    const app = document.createElement("div");
    app.id = "arvosanalaskuri";

    app.innerHTML = `
        <div id="ylapalkki">
            <div id="kahva"></div>
            <div id="otsikko">Arvosanalaskuri</div>
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

    document.body.appendChild(app);

    let open = false;

    document.getElementById("ylapalkki").onclick = () => {
        open = !open;
        app.classList.toggle("avaa", open);
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

        const num = parseFloat(g);
        const clamped = Math.max(4, Math.min(10, isNaN(num) ? 4 : num));
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
