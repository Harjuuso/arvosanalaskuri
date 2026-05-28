(function () {

    document.getElementById("arvosanalaskuri")?.remove();

    const tyyli = document.createElement("style");
    tyyli.textContent = `
        #arvosanalaskuri {
            position: fixed;
            left: 0;
            right: 0;
            bottom: calc(env(safe-area-inset-bottom) + 10px);
            display: flex;
            justify-content: center;
            z-index: 2147483647;
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto;
            -webkit-tap-highlight-color: transparent;
        }

        #pill {
            width: 95%;
            max-width: 560px;
            background: #fdfdfd;

            border-radius: 999px;
            overflow: hidden;

            border: 1px solid rgba(0,0,0,0.10);

            max-height: 88px;

            transition:
                max-height 0.35s cubic-bezier(.2,.9,.2,1),
                border-radius 0.35s cubic-bezier(.2,.9,.2,1);
        }

        #pill.open {
            max-height: 660px;
            border-radius: 22px 22px 0 0;
        }

        #header {
            height: 88px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            user-select: none;
            position: relative;
        }

        #handle {
            width: 44px;
            height: 5px;
            border-radius: 999px;
            background: rgba(0,0,0,0.25);
            position: absolute;
            top: 8px;
        }

        #title {
            font-size: 17px;
            font-weight: 600;
            color: #111827;
        }

        #sisalto {
            padding: 16px;
            opacity: 0;
            transform: translateY(10px);
            pointer-events: none;
            transition: all 0.25s ease;
        }

        #pill.open #sisalto {
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
            background: #ffffff;

            font-size: 18px;
            color: #111827;
            outline: none;
        }

        input:focus {
            border-color: rgba(0,122,255,0.45);
        }

        #tulos {
            margin-top: 14px;
            padding: 18px;
            border-radius: 16px;

            background: #ffffff;
            border: 1px solid rgba(0,0,0,0.10);

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
    `;

    document.head.appendChild(tyyli);

    const sovellus = document.createElement("div");
    sovellus.id = "arvosanalaskuri";

    sovellus.innerHTML = `
        <div id="pill">

            <div id="header">
                <div id="handle"></div>
                <div id="title">Arvosanalaskuri</div>
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

        </div>
    `;

    document.body.appendChild(sovellus);

    const pilli = document.getElementById("pill");
    const pistekenttä = document.getElementById("pisteet");
    const rajakenttä = document.getElementById("raja");
    const arvosana = document.getElementById("arvosana");
    const alateksti = document.getElementById("alateksti");

    document.getElementById("header").onclick = () => {
        pilli.classList.toggle("open");
    };

    function haePisteet() {
        let saadut = 0, maksimi = 0;

        document.querySelectorAll(".e-result-scorecount").forEach(el => {
            const osuma = el.innerText.match(/(\d+)\s*\/\s*(\d+)/);
            if (osuma) {
                saadut += +osuma[1];
                maksimi += +osuma[2];
            }
        });

        return { saadut, maksimi };
    }

    function laskeArvosana(pisteet, maksimi, raja) {
        const rajaPisteinä = maksimi * (raja / 100);

        if (pisteet < rajaPisteinä) {
            const askel = rajaPisteinä / 3;
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

        const t = (pisteet - rajaPisteinä) / (maksimi - rajaPisteinä);
        let i = Math.floor(t * tasot.length);

        return tasot[Math.max(0, Math.min(i, tasot.length - 1))];
    }

    function päivitä() {

        const { maksimi } = haePisteet();

        const p = parseFloat(pistekenttä.value || 0);
        const r = parseFloat(rajakenttä.value || 50);

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

        arvosana.style.color = `rgb(${rCol},${gCol},${b})`;
    }

    pistekenttä.oninput = päivitä;
    rajakenttä.oninput = päivitä;

    setTimeout(() => {
        const { saadut } = haePisteet();
        if (!pistekenttä.value) pistekenttä.value = saadut;
        päivitä();
    }, 300);

})();

completion();
