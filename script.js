// =====================================================
// SISTEMA DE INFORMACIÓN
// PARTE 1/4
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // ELEMENTOS
    // ===============================

    const startScreen =
        document.getElementById("startScreen");

    const bgVideo =
        document.getElementById("bgVideo");

    const dataContainer =
        document.getElementById("dataContainer");

    const cursor =
        document.getElementById("cursor");



    // ===============================
    // VARIABLES
    // ===============================

    let clickCount = 0;
    let keyPressCount = 0;

    let mouseX = 0;
    let mouseY = 0;

    let scanFinished = false;



    // ===============================
    // MOUSE
    // ===============================

    document.addEventListener(
        "mousemove",
        (event) => {

            mouseX = event.clientX;
            mouseY = event.clientY;

            if (cursor) {
                cursor.style.left =
                    mouseX + "px";

                cursor.style.top =
                    mouseY + "px";
            }
        }
    );



    // ===============================
    // CONTADORES
    // ===============================

    document.addEventListener(
        "click",
        () => {
            clickCount++;
        }
    );

    document.addEventListener(
        "keydown",
        () => {
            keyPressCount++;
        }
    );



    // ===============================
    // PANTALLA DE INICIO
    // ===============================

    if (startScreen) {

        startScreen.addEventListener(
            "click",
            async () => {

                startScreen.style.opacity =
                    "0";

                setTimeout(
                    async () => {

                        startScreen.style.display =
                            "none";

                        if (bgVideo) {

                            try {

                                bgVideo.muted = false;
                                await bgVideo.play();

                            } catch {

                                bgVideo.muted = true;
                                bgVideo.play();

                            }

                        }

                        await startDataAnimation();

                    },
                    600
                );

            }
        );

    }



    // ===============================
    // ESCRITURA SUAVE
    // ===============================

    async function typeLine(
        text,
        speed = 8
    ) {

        const line =
            document.createElement("div");

        line.className =
            "terminal-line";

        line.textContent = "";

        dataContainer.appendChild(
            line
        );

        for (const char of text) {

            line.textContent += char;

            await sleep(speed);

        }

        dataContainer.scrollTop =
            dataContainer.scrollHeight;
    }



    function sleep(ms) {

        return new Promise(
            resolve =>
                setTimeout(resolve, ms)
        );

    }



    // ===============================
    // SISTEMA OPERATIVO
    // ===============================

    function getOperatingSystem() {

        const ua =
            navigator.userAgent;

        if (ua.includes("Windows"))
            return "Windows";

        if (ua.includes("Android"))
            return "Android";

        if (ua.includes("Mac"))
            return "macOS";

        if (ua.includes("Linux"))
            return "Linux";

        if (
            ua.includes("iPhone") ||
            ua.includes("iPad")
        )
            return "iOS";

        return "Desconocido";
    }



    // ===============================
    // NAVEGADOR
    // ===============================

    function getBrowserName() {

        const ua =
            navigator.userAgent;

        if (ua.includes("Edg"))
            return "Microsoft Edge";

        if (ua.includes("Chrome"))
            return "Google Chrome";

        if (ua.includes("Firefox"))
            return "Mozilla Firefox";

        if (ua.includes("Safari"))
            return "Safari";

        return "Desconocido";
    }



    // ===============================
    // VERSIÓN
    // ===============================

    function getBrowserVersion() {

        const ua =
            navigator.userAgent;

        const match =
            ua.match(
                /(Chrome|Firefox|Edg|Safari)\/([\d.]+)/
            );

        if (match)
            return match[2];

        return "Desconocida";
    }


// ===============================
// PARTE 2 CONTINÚA
// ===============================

// =====================================================
// PARTE 2/4
// OBTENCIÓN DE DATOS
// =====================================================

async function getSystemData() {

    const data = {};

    // ===============================
    // INFORMACIÓN DE RED
    // ===============================

    try {

        const response =
            await fetch(
                "https://ipapi.co/json/"
            );

        const ipData =
            await response.json();

        data["IP"] =
            ipData.ip ||
            "No disponible";

        data["Ciudad"] =
            ipData.city ||
            "No disponible";

        data["Región"] =
            ipData.region ||
            "No disponible";

        data["País"] =
            ipData.country_name ||
            "No disponible";

        data["Proveedor de Internet"] =
            ipData.org ||
            "No disponible";

        data["Zona horaria"] =
            ipData.timezone ||
            "No disponible";

    } catch {

        data["IP"] =
            "No disponible";

        data["Ubicación"] =
            "No disponible";
    }

    // ===============================
    // FECHA Y HORA
    // ===============================

    const now =
        new Date();

    data["Hora"] =
        now.toLocaleTimeString();

    data["Fecha"] =
        now.toLocaleDateString();

    // ===============================
    // NAVEGADOR
    // ===============================

    data["Navegador"] =
        getBrowserName();

    data["Versión del navegador"] =
        getBrowserVersion();

    data["Idioma"] =
        navigator.language;

    // ===============================
    // SISTEMA
    // ===============================

    data["Sistema operativo"] =
        getOperatingSystem();

    data["Resolución"] =
        screen.width +
        " x " +
        screen.height;

    data["Ventana"] =
        window.innerWidth +
        " x " +
        window.innerHeight;

    // ===============================
    // HARDWARE
    // ===============================

    data["Núcleos del procesador"] =
        navigator.hardwareConcurrency ||
        "No disponible";

    data["RAM aproximada"] =
        navigator.deviceMemory
        ? navigator.deviceMemory + " GB"
        : "No disponible";

    // ===============================
    // GPU
    // ===============================

    try {

        const canvas =
            document.createElement(
                "canvas"
            );

        const gl =
            canvas.getContext(
                "webgl"
            );

        if (gl) {

            const debug =
                gl.getExtension(
                    "WEBGL_debug_renderer_info"
                );

            if (debug) {

                data["GPU"] =
                    gl.getParameter(
                        debug.UNMASKED_RENDERER_WEBGL
                    );

            } else {

                data["GPU"] =
                    "No disponible";
            }
        }

    } catch {

        data["GPU"] =
            "No disponible";
    }

    // ===============================
    // CONEXIÓN
    // ===============================

    if (navigator.connection) {

        data["Tipo de conexión"] =
            navigator.connection
                .effectiveType ||
            "No disponible";

    } else {

        data["Conexión"] =
            "No disponible";
    }

    // ===============================
    // COOKIES
    // ===============================

    data["Cookies"] =
        navigator.cookieEnabled
        ? "Activadas"
        : "Desactivadas";

    // ===============================
    // BATERÍA
    // ===============================

    if ("getBattery" in navigator) {

        try {

            const battery =
                await navigator
                    .getBattery();

            data["Batería"] =
                Math.round(
                    battery.level * 100
                ) + "%";

        } catch {

            data["Batería"] =
                "No disponible";
        }

    } else {

        data["Batería"] =
            "No disponible";
    }

    // ===============================
    // INTERACCIÓN
    // ===============================

    data["Mouse X"] =
        mouseX;

    data["Mouse Y"] =
        mouseY;

    data["Clics"] =
        clickCount;

    data["Teclas presionadas"] =
        keyPressCount;

    return data;
}


// ===============================
// PARTE 3 CONTINÚA
// ===============================

// =====================================================
// PARTE 3/4
// MOSTRAR INFORMACIÓN
// =====================================================

async function startDataAnimation() {

    dataContainer.innerHTML = "";

    const data =
        await getSystemData();


    // Mostrar los datos
    for (const key in data) {

        await typeLine(
            key +
            ": " +
            data[key],
            8
        );

    }

    scanFinished = true;

    startLiveMonitor();

}



// =====================================================
// MONITOR EN TIEMPO REAL
// =====================================================

function startLiveMonitor() {

    const monitor =
        document.createElement(
            "div"
        );

    monitor.className =
        "live-monitor";

    dataContainer.appendChild(
        monitor
    );


    setInterval(() => {

        if (!scanFinished)
            return;

        monitor.innerHTML =

            "<br>──────────────<br>" +

            "TIEMPO REAL<br>" +

            "Hora: " +
            new Date()
                .toLocaleTimeString() +

            "<br>" +

            "Mouse: " +
            mouseX +
            " , " +
            mouseY +

            "<br>" +

            "Clics: " +
            clickCount +

            "<br>" +

            "Teclas: " +
            keyPressCount;

    }, 250);

}



// =====================================================
// CURSOR PARPADEANTE
// =====================================================

if (cursor) {

    setInterval(() => {

        cursor.style.opacity =
            cursor.style.opacity === "0"
            ? "1"
            : "0";

    }, 500);

}



// ===============================
// PARTE 4 CONTINÚA
// ===============================

// =====================================================
// PARTE 4/4
// FINAL DEL SCRIPT
// =====================================================


// ===============================
// COMPROBACIÓN DE ELEMENTOS
// ===============================

if (!dataContainer) {

    console.error(
        "No se encontró dataContainer"
    );

}

if (!startScreen) {

    console.warn(
        "No se encontró startScreen"
    );

}

if (!bgVideo) {

    console.warn(
        "No se encontró bgVideo"
    );

}



// ===============================
// RELOJ OPCIONAL
// ===============================

setInterval(() => {

    const clock =
        document.getElementById(
            "systemTime"
        );

    if (clock) {

        clock.textContent =
            new Date()
                .toLocaleTimeString();

    }

}, 1000);



// ===============================
// MENSAJES EN CONSOLA
// ===============================

console.log(
    "Sistema cargado correctamente."
);

console.log(
    "Esperando interacción..."
);



// ===============================
// CIERRE DEL DOMCONTENTLOADED
// ===============================

});
