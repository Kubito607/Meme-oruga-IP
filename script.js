// =====================================================
// SISTEMA DE ANÁLISIS - SCRIPT.JS
// PARTE 1 DE 4
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // ELEMENTOS DEL DOM
    // ===============================

    const startScreen = document.getElementById("startScreen");
    const bgVideo = document.getElementById("bgVideo");
    const dataContainer = document.getElementById("dataContainer");
    const cursor = document.getElementById("cursor");

    // ===============================
    // VARIABLES
    // ===============================

    let clickCount = 0;
    let keyPressCount = 0;

    let mouseX = 0;
    let mouseY = 0;

    let scanFinished = false;

    // ===============================
    // EVENTOS
    // ===============================

    document.addEventListener("mousemove", (e) => {

        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursor) {
            cursor.style.left = mouseX + "px";
            cursor.style.top = mouseY + "px";
        }

    });

    document.addEventListener("click", () => {

        clickCount++;

    });

    document.addEventListener("keydown", () => {

        keyPressCount++;

    });

    // ===============================
    // PANTALLA DE INICIO
    // ===============================

    startScreen.addEventListener("click", async () => {

        startScreen.style.pointerEvents = "none";
        startScreen.style.opacity = "0";

        setTimeout(async () => {

            startScreen.style.display = "none";

            try {

                bgVideo.muted = false;
                await bgVideo.play();

            } catch {

                bgVideo.muted = true;
                bgVideo.play();

            }

            await startDataAnimation();

        }, 800);

    });

    // ===============================
    // EFECTO ESCRITURA
    // ===============================

    async function typeLine(text, speed = 12) {

        const line = document.createElement("div");
        line.className = "terminal-line";

        dataContainer.appendChild(line);

        for (const char of text) {

            line.textContent += char;

            await sleep(speed);

        }

        dataContainer.scrollTop = dataContainer.scrollHeight;

    }

    // ===============================
    // ESPERA
    // ===============================

    function sleep(ms) {

        return new Promise(resolve => setTimeout(resolve, ms));

    }

    // ===============================
    // BARRA DE PROGRESO
    // ===============================

    async function fakeLoading() {

        const progress = document.createElement("div");
        progress.className = "progress";

        dataContainer.appendChild(progress);

        for (let i = 0; i <= 100; i++) {

            progress.textContent =
                "Analizando sistema... " + i + "%";

            await sleep(18);

        }

        progress.remove();

    }

    // ===============================
    // SISTEMA OPERATIVO
    // ===============================

    function getOperatingSystem() {

        const ua = navigator.userAgent;

        if (ua.includes("Windows"))
            return "Windows";

        if (ua.includes("Android"))
            return "Android";

        if (ua.includes("iPhone"))
            return "iPhone";

        if (ua.includes("iPad"))
            return "iPadOS";

        if (ua.includes("Mac"))
            return "macOS";

        if (ua.includes("Linux"))
            return "Linux";

        return "Desconocido";

    }

    // ===============================
    // NAVEGADOR
    // ===============================

    function getBrowserName() {

        const ua = navigator.userAgent;

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
    // VERSIÓN DEL NAVEGADOR
    // ===============================

    function getBrowserVersion() {

        const ua = navigator.userAgent;

        const match =
            ua.match(/(Chrome|Firefox|Edg|Safari)\/([\d.]+)/);

        if (match)
            return match[2];

        return "Desconocida";

    }

    // =====================================================
    // PARTE 2 CONTINÚA AQUÍ
    // =====================================================

// =====================================================
// PARTE 2 DE 4
// OBTENCIÓN DE DATOS DEL SISTEMA
// =====================================================


async function getSystemData() {

    const data = {};


    // ===============================
    // INFORMACIÓN DE RED
    // ===============================

    try {

        const response =
            await fetch("https://ipapi.co/json/");

        const ipData =
            await response.json();


        data["Dirección IP"] =
            ipData.ip || "No disponible";

        data["Ciudad"] =
            ipData.city || "No disponible";

        data["Región"] =
            ipData.region || "No disponible";

        data["País"] =
            ipData.country_name || "No disponible";

        data["Proveedor ISP"] =
            ipData.org || "No disponible";


        data["Zona horaria"] =
            ipData.timezone || "No disponible";


    } catch (error) {


        data["Dirección IP"] =
            "No disponible";

        data["Ciudad"] =
            "No disponible";

        data["País"] =
            "No disponible";


    }



    // ===============================
    // FECHA Y HORA
    // ===============================


    const now = new Date();


    data["Hora actual"] =
        now.toLocaleTimeString();


    data["Fecha"] =
        now.toLocaleDateString();



    // ===============================
    // NAVEGADOR
    // ===============================


    data["Navegador"] =
        getBrowserName();


    data["Versión navegador"] =
        getBrowserVersion();


    data["User Agent"] =
        navigator.userAgent;


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



    data["Profundidad color"] =
        screen.colorDepth +
        " bits";



    // ===============================
    // HARDWARE
    // ===============================


    data["Núcleos CPU"] =
        navigator.hardwareConcurrency ||
        "No disponible";


    data["Memoria RAM"] =
        navigator.deviceMemory ?
        navigator.deviceMemory + " GB" :
        "No disponible";



    // ===============================
    // GPU MEDIANTE WEBGL
    // ===============================


    try {


        const canvas =
            document.createElement("canvas");


        const gl =
            canvas.getContext("webgl");


        if (gl) {


            const info =
                gl.getExtension(
                    "WEBGL_debug_renderer_info"
                );


            if (info) {


                data["Tarjeta gráfica"] =
                    gl.getParameter(
                        info.UNMASKED_RENDERER_WEBGL
                    );


            } else {


                data["Tarjeta gráfica"] =
                    "No disponible";


            }


        }


    } catch {


        data["Tarjeta gráfica"] =
            "No disponible";


    }



    // ===============================
    // CONEXIÓN
    // ===============================


    if (navigator.connection) {


        data["Tipo conexión"] =
            navigator.connection.effectiveType ||
            "No disponible";


        data["Velocidad"] =
            navigator.connection.downlink ?
            navigator.connection.downlink + " Mbps" :
            "No disponible";


        data["Ping"] =
            navigator.connection.rtt ?
            navigator.connection.rtt + " ms" :
            "No disponible";


    } else {


        data["Conexión"] =
            "Información no disponible";


    }



    // ===============================
    // COOKIES
    // ===============================


    data["Cookies"] =
        navigator.cookieEnabled ?
        "Activadas" :
        "Desactivadas";



    // ===============================
    // BATERÍA
    // ===============================


    if ("getBattery" in navigator) {


        try {


            const battery =
                await navigator.getBattery();


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
    // DATOS DE INTERACCIÓN
    // ===============================


    data["Mouse X"] =
        mouseX;


    data["Mouse Y"] =
        mouseY;


    data["Clics realizados"] =
        clickCount;


    data["Teclas presionadas"] =
        keyPressCount;



    return data;


}



// =====================================================
// PARTE 3 CONTINÚA AQUÍ
// =====================================================

// =====================================================
// PARTE 3 DE 4
// ANIMACIÓN Y PRESENTACIÓN DE DATOS
// =====================================================


async function startDataAnimation() {


    dataContainer.innerHTML = "";


    await typeLine(
        "> Iniciando análisis del sistema...",
        12
    );


    await sleep(300);


    await fakeLoading();


    await sleep(300);



    await typeLine(
        "> Recopilando información...",
        12
    );


    await sleep(500);



    const systemData =
        await getSystemData();



    await typeLine(
        "> Información encontrada:",
        12
    );


    await sleep(200);



    // ===============================
    // MOSTRAR DATOS
    // ===============================


    for (const key in systemData) {


        await typeLine(
            "✔ " +
            key +
            ": " +
            systemData[key],
            10
        );


        await sleep(30);


    }



    await sleep(500);



    await typeLine(
        "> Análisis completado correctamente.",
        12
    );



    scanFinished = true;



    startLiveMonitor();



}



// =====================================================
// MONITOR EN TIEMPO REAL
// =====================================================


function startLiveMonitor() {


    const monitor =
        document.createElement("div");


    monitor.className =
        "live-monitor";


    dataContainer.appendChild(
        monitor
    );



    setInterval(() => {


        if (!scanFinished)
            return;



        const now =
            new Date();



        monitor.innerHTML =

            "──────────────<br>" +

            "MONITOR EN VIVO<br>" +

            "Hora: " +
            now.toLocaleTimeString() +
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
// EFECTO DE PARPADEO DEL CURSOR
// =====================================================


if (cursor) {


    setInterval(() => {


        cursor.style.opacity =
            cursor.style.opacity === "0"
            ? "1"
            : "0";


    }, 500);


}



// =====================================================
// PARTE 4 CONTINÚA AQUÍ
// =====================================================

// =====================================================
// PARTE 4 DE 4
// FINAL Y PROTECCIONES
// =====================================================


// ===============================
// PROTECCIÓN DE ELEMENTOS
// ===============================


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


if (!dataContainer) {

    console.warn(
        "No se encontró dataContainer"
    );

}



// ===============================
// ACTUALIZAR HORA DEL SISTEMA
// ===============================


setInterval(() => {


    const timeElement =
        document.getElementById(
            "systemTime"
        );


    if (timeElement) {


        timeElement.textContent =
            new Date()
            .toLocaleTimeString();


    }


}, 1000);



// ===============================
// MENSAJE INICIAL EN CONSOLA
// ===============================


console.log(
    "%cSistema iniciado correctamente.",
    "color:#00ff00;font-size:14px;"
);



console.log(
    "Esperando interacción del usuario..."
);



// ===============================
// CIERRE DEL DOMCONTENTLOADED
// ===============================

});
