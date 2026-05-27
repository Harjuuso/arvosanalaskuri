(function () {

    document.getElementById("koe-laskin")?.remove();

    const style = document.createElement("style");
    style.textContent = `
        #koe-laskin {
            position: fixed;
            top: 20px;
            left: 20px;
            width: 340px;

            background:
            radial-gradient(
                500px circle at 20% 20%,
                rgba(99,102,241,0.10),
                transparent 60%
            ),
            radial-gradient(
                400px circle at 80% 90%,
                rgba(34,197,94,0.06),
                transparent 55%
            ),
            linear-gradient(135deg,
                rgba(255,255,255,0.05),
                rgba(255,255,255,0.02)
            ),
            rgba(10, 12, 18, 0.80);

            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);

            color: #f3f4f6;
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto;

            border-radius: 18px;
            border: 1px solid rgba(255,255,255,0.10);
            box-shadow:
                0 25px 60px rgba(0,0,0,0.65),
                inset 0 1px 0 rgba(255,255,255,0.08),
                inset 0 -1px 0 rgba(0,0,0,0.35);

            z-index: 2147483647;
            overflow: hidden;
        }

        #sisalto {
            padding: 14px;
            border-top: 1px solid rgba(255,255,255,0.06);
            max-height: 500px;
            opacity: 1;
            transform: translateY(0);
            transition: all 0.25s ease;
        }

        #koe-laskin.minimoitu #sisalto {
            max-height: 0;
            opacity: 0;
            padding-top: 0;
            padding-bottom: 0;
            transform: translateY(-8px);
            pointer-events: none;
        }

        #otsikko {
            padding: 12px 14px;

            background: rgba(255,255,255,0.03);
            border-bottom: 1px solid rgba(255,255,255,0.06);
            backdrop-filter: blur(8px);

            display:flex;
            justify-content:space-between;
            align-items:center;

            font-weight: 600;
            font-size: 13px;
            letter-spacing: 0.3px;

            cursor: grab;
            user-select:none;
        }

        .napit {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .pallo {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            cursor: pointer;
            transition: transform 0.12s ease;
        }

        .keltainen {
            background: #fdbc40;
        }

        .punainen {
            background: #fc5753;
        }

        .pallo:hover {
            transform: scale(1.08);
        }

        .pallo:active {
            transform: scale(0.96);
        }

        .rivi {
            margin-bottom: 12px;
        }

        label {
            font-size: 11px;
            color: rgba(255,255,255,0.65);
            display:block;
            margin-bottom:6px;
        }

        input {
            width: 100%;
            padding: 12px;
            border-radius: 12px;

            border: 1px solid rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.05);

            color: white;
            font-size: 13px;
            outline: none;
        }

        input:focus {
            border-color: rgba(99,102,241,0.6);
            box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
        }

        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        input[type="number"] {
            -moz-appearance: textfield;
        }

        #arvosanaLaatikko {
            margin-top: 14px;
            padding: 18px;
            border-radius: 16px;

            background: linear-gradient(
                145deg,
                rgba(255,255,255,0.06),
                rgba(255,255,255,0.02)
            );

            border: 1px solid rgba(255,255,255,0.08);
            text-align: center;

            transition: all 0.25s ease;
        }

        #arvosana {
            font-size: 34px;
            font-weight: 800;
        }

        #ala {
            margin-top: 6px;
            font-size: 11px;
            color: rgba(255,255,255,0.6);
        }

        @keyframes widgetClose {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            60% {
                opacity: 0.6;
                transform: scale(0.98);
            }
            100% {
                opacity: 0;
                transform: scale(0.85) translateY(-10px);
            }
        }

        #koe-laskin.sulkeutuu {
            animation: widgetClose 0.18s ease forwards;
            pointer-events: none;
        }
    `;

    document.head.appendChild(style);

    const widget = document.createElement("div");
    widget.id = "koe-laskin";

    widget.innerHTML = `
        <div id="otsikko">
            Arvosanalaskuri
            <div class="napit">
                <div id="pienennä" class="pallo keltainen"></div>
                <div id="sulje" class="pallo punainen"></div>
            </div>
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

            <div id="arvosanaLaatikko">
                <div id="arvosana">—</div>
                <div id="ala">Ei pisteitä</div>
            </div>
        </div>
    `;

    document.body.appendChild(widget);

    const header = document.getElementById("otsikko");
    let dragging = false, ox = 0, oy = 0;

    header.onmousedown = (e) => {
        dragging = true;
        ox = e.clientX - widget.getBoundingClientRect().left;
        oy = e.clientY - widget.getBoundingClientRect().top;
        header.style.cursor = "grabbing";
    };

    document.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        widget.style.left = (e.clientX - ox) + "px";
        widget.style.top = (e.clientY - oy) + "px";
        widget.style.right = "auto";
        widget.style.bottom = "auto";
    });

    document.addEventListener("mouseup", () => {
        dragging = false;
        header.style.cursor = "grab";
    });

    const minBtn = document.getElementById("pienennä");
    const closeBtn = document.getElementById("sulje");

    minBtn.onclick = () => {
        widget.classList.toggle("minimoitu");
    };

    closeBtn.onclick = () => {
        widget.classList.add("sulkeutuu");

        setTimeout(() => {
            widget.remove();
        }, 180);
    };

    function haePisteet() {
        let earned = 0, max = 0;

        document.querySelectorAll(".e-result-scorecount").forEach(el => {
            const m = el.innerText.match(/(\d+)\s*\/\s*(\d+)/);
            if (m) {
                earned += +m[1];
                max += +m[2];
            }
        });

        return { earned, max };
    }

    function laskeArvosana(points, max, passPercent) {
        const passLine = max * (passPercent / 100);

        if (points < passLine) {
            const step = passLine / 3;
            if (points < step) return "4";
            if (points < step * 2) return "4+";
            return "4½";
        }

        const steps = [
            "5−","5","5+","5½",
            "6−","6","6+","6½",
            "7−","7","7+","7½",
            "8−","8","8+","8½",
            "9−","9","9+","9½",
            "10−","10"
        ];

        const t = (points - passLine) / (max - passLine);
        let index = Math.floor(t * steps.length);

        return steps[Math.max(0, Math.min(index, steps.length - 1))];
    }

    const earnedInput = document.getElementById("pisteet");
    const passInput = document.getElementById("raja");
    const grade = document.getElementById("arvosana");
    const sub = document.getElementById("ala");

    let maxPoints = 0;

    function päivitä() {

        const { max } = haePisteet();
        maxPoints = max;

        const p = parseFloat(earnedInput.value || 0);
        const passPercent = parseFloat(passInput.value || 50);

        if (!maxPoints) {
            grade.textContent = "—";
            sub.textContent = "Ei pisteitä";
            return;
        }

        const g = laskeArvosana(p, maxPoints, passPercent);
        grade.textContent = g;
        sub.textContent = `${p} / ${maxPoints} pistettä`;

        const num = parseFloat(g);
        const clamped = Math.max(4, Math.min(10, num));
        const t = (clamped - 4) / 6;

        const lerp = (a, b, t) => a + (b - a) * t;

        let r, gCol, b;

        if (t < 0.5) {
            const lt = t / 0.5;
            r = 239;
            gCol = lerp(68, 197, lt);
            b = 68;
        } else {
            const lt = (t - 0.5) / 0.5;
            r = lerp(239, 34, lt);
            gCol = lerp(197, 197, lt);
            b = lerp(68, 94, lt);
        }

        const color = `rgb(${r}, ${gCol}, ${b})`;
        grade.style.color = color;
    }

    earnedInput.oninput = päivitä;
    passInput.oninput = päivitä;

    setTimeout(() => {
        const { earned } = haePisteet();
        if (!earnedInput.value) earnedInput.value = earned;
        päivitä();
    }, 300);

})();