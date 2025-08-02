window.addEventListener("DOMContentLoaded", function() {
    document.getElementById("speedometer").style.display = "none";
});

window.addEventListener("message", function(event) {
    const data = event.data;
    const speedo = document.getElementById("speedometer");

    // Mostra/nascondi tachimetro
    if (typeof data.show !== "undefined") {
        speedo.style.display = data.show ? "flex" : "none";
    }

    // Velocità numerica e lancetta
    if (typeof data.speed !== "undefined") {
        document.getElementById("speed-value").textContent = Math.round(data.speed);

        // Rotazione lancetta (0-300 km/h → -45° a +225°)
        const minAngle = -150;
        const maxAngle = 225;
        const maxSpeed = 300;
        let angle = minAngle + (Math.min(data.speed, maxSpeed) / maxSpeed) * (maxAngle - minAngle);

        document.getElementById("speed-needle").style.transform =
            `translate(-50%, -92%) rotate(${angle}deg)`;
    }

    // Barra danno motore
    if (typeof data.engineHealth !== "undefined") {
        const bar = document.getElementById("damage-bar-inner");
        bar.style.width = data.damagePercent + "%";
        if (data.damagePercent > 60) {
            bar.style.background = "linear-gradient(90deg,#56ffe8,#15f0b5,#7fffda)";
        } else if (data.damagePercent > 30) {
            bar.style.background = "linear-gradient(90deg,#fff12e,#fa8e35)";
        } else {
            bar.style.background = "linear-gradient(90deg,#ff1c1c,#b10000)";
        }
        document.getElementById("damage-text").textContent = data.damagePercent + "%";
    }

    // Stato motore acceso/spento
    const engineIcon = document.getElementById("engine-status");
    if (typeof data.engineOn !== "undefined") {
        engineIcon.textContent = data.engineOn ? "🟢" : "🔴";
        engineIcon.className = data.engineOn ? "engine-on" : "engine-off";
    }
});
