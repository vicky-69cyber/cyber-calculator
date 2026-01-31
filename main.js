const currentEl = document.getElementById("current");
const previousEl = document.getElementById("previous");

let current = "";
let previous = "";
let operator = null;

/* ===== DISPLAY ===== */
function update() {
    currentEl.textContent = current || "0";
    previousEl.textContent = operator ? `${previous} ${operator}` : "";
}

/* ===== NUMBERS ===== */
document.querySelectorAll("[data-num]").forEach(btn => {
    btn.onclick = () => {
        if (btn.innerText === "." && current.includes(".")) return;
        current += btn.innerText;
        update();
    };
});

/* ===== OPERATORS ===== */
document.querySelectorAll(".op").forEach(btn => {
    btn.onclick = () => {
        if (!current) return;
        if (previous) calculate();
        operator = btn.dataset.op;
        previous = current;
        current = "";
        update();
    };
});

/* ===== ACTIONS ===== */
document.querySelector("[data-action='equals']").onclick = () => {
    calculate();
    update();
};

document.querySelector("[data-action='clear']").onclick = () => {
    current = "";
    previous = "";
    operator = null;
    update();
};

document.querySelector("[data-action='delete']").onclick = () => {
    current = current.slice(0, -1);
    update();
};

function calculate() {
    let a = parseFloat(previous);
    let b = parseFloat(current);
    if (isNaN(a) || isNaN(b)) return;

    let r;
    if (operator === "+") r = a + b;
    if (operator === "-") r = a - b;
    if (operator === "*") r = a * b;
    if (operator === "/") r = a / b;

    current = r.toString();
    previous = "";
    operator = null;
}

/* ===== SCIENTIFIC ===== */
function scientific(type) {
    let n = parseFloat(current);
    if (isNaN(n)) return;

    if (type === "sqrt") current = Math.sqrt(n);
    if (type === "square") current = n * n;
    if (type === "sin") current = Math.sin(n * Math.PI / 180);
    if (type === "cos") current = Math.cos(n * Math.PI / 180);
    if (type === "tan") current = Math.tan(n * Math.PI / 180);
    if (type === "log") current = Math.log10(n);
    if (type === "pi") current = Math.PI;

    update();
}

/* ===== UNIT ===== */
function convertUnit() {
    let v = parseFloat(current);
    let t = document.getElementById("unitType").value;

    if (t === "m-km") current = v / 1000;
    if (t === "km-m") current = v * 1000;
    if (t === "c-f") current = (v * 9 / 5) + 32;
    if (t === "f-c") current = (v - 32) * 5 / 9;

    update();
}

/* ===== CURRENCY ===== */
async function convertCurrency() {
    let amount = parseFloat(current);
    let from = document.getElementById("from").value;
    let to = document.getElementById("to").value;

    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await res.json();

    current = (amount * data.rates[to]).toFixed(2);
    update();
}

/* ===== MODE SWITCH ===== */
document.querySelectorAll(".mode").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".mode").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        document.querySelectorAll(".buttons, .panel").forEach(p => p.classList.add("hidden"));
        document.getElementById(btn.dataset.mode).classList.remove("hidden");
    };
});
