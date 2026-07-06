// =====================================================
// SISTEMA DE INFORMACIÓN - SCRIPT.JS
// PARTE 1/4
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // ELEMENTOS
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
    // MOUSE PERSONALIZADO
    // ===============================

    document.addEventListener("mousemove", (e) => {

        mouseX = e.clientX;
        mouseY = e.clientY;


        if (cursor) {

            cursor.style.left =
                mouseX + "px";

            cursor.style.top =
                mouseY + "px";

        }

    });



    // ===============================
    // CONTADORES
    // ===============================

    document.addEventListener("click", () => {

        clickCount++;

    });


    document.addEventListener("keydown", () => {

        keyPressCount++;

    });



    // ===============================
    // INICIO
    // ===============================

    if (startScreen) {


        startScreen.addEventListener("click", async () => {


            startScreen.style.opacity = "0";



            setTimeout(async () => {


                startScreen.style.display = "none";



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



            }, 600);



        });


    }



    // ===============================
    // ESCRITURA SUAVE
    // ===============================


    async function typeLine(text, speed = 8) {


        const line =
            document.createElement("div");


        line.className =
            "terminal-line";


        line.textContent = "";


        dataContainer.appendChild(line);



        for (const char of text) {


            line.textContent += char;


            await sleep(speed);


        }



        dataContainer.scrollTop =
            dataContainer.scrollHeight;


    }




    function sleep(ms) {


        return new Promise(
            resolve => setTimeout(resolve, ms)
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


        if (ua.includes("iPhone"))
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
    // VERSION
    // ===============================


    function getBrowserVersion() {


        const ua =
            navigator.userAgent;



        const match =
            ua.match(/(Chrome|Firefox|Edg|Safari)\/([\d.]+)/);



        if (match)
            return match[2];



        return "Desconocida";


    }



    // ===============================
    // PARTE 2 CONTINÚA
    // ===============================

// =====================================================
// PARTE 2/4
// RECOLECCIÓN DE DATOS
// =====================================================


async function getSystemData() {


    const data = {};



    // ===============================
    // RED E IP
    // ===============================


    try {


        const response =
            await fetch("https://ipapi.co/json/");


        const ip =
            await response.json();



        data["IP"] =
            ip.ip || "No disponible";


        data["Ciudad"] =
            ip.city || "No disponible";


        data["Región"] =
            ip.region || "No disponible";


        data["País"] =
            ip.country_name || "No disponible";


        data["ISP"] =
            ip.org || "No disponible";


        data["Zona horaria"] =
            ip.timezone || "No disponible";



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



    data["Versión"] =
        getBrowserVersion();



    data["Idioma"] =
        navigator.language;



    data["User Agent"] =
        navigator.userAgent;




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



    data["Color"] =
        screen.colorDepth +
        " bits";





    // ===============================
    // HARDWARE
    // ===============================


    data["Procesadores"] =
        navigator.hardwareConcurrency ||
        "No disponible";



    data["RAM"] =
        navigator.deviceMemory
        ? navigator.deviceMemory + " GB"
        : "No disponible";





    // ===============================
    // GPU
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


                data["GPU"] =
                    gl.getParameter(
                        info.UNMASKED_RENDERER_WEBGL
                    );


            }

            else {


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


        data["Conexión"] =
            navigator.connection.effectiveType ||
            "No disponible";


    }

    else {


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
                await navigator.getBattery();



            data["Batería"] =
                Math.round(
                    battery.level * 100
                ) + "%";



        } catch {


            data["Batería"] =
                "No disponible";


        }


    }

    else {


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


    data["Teclas"] =
        keyPressCount;




    return data;



}



// ===============================
// PARTE 3 CONTINÚA
// ===============================

// =====================================================
// PARTE 3/4
// MOSTRAR DATOS DIRECTAMENTE
// =====================================================


async function startDataAnimation() {


    dataContainer.innerHTML = "";


    dataContainer.style.textAlign =
        "center";



    const data =
        await getSystemData();



    for (const key in data) {


        await typeLine(
            key + ": " + data[key],
            8
        );


    }



    scanFinished = true;



    startLiveMonitor();


}



// =====================================================
// DATOS EN TIEMPO REAL
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


        if (
            cursor.style.opacity === "0"
        ) {


            cursor.style.opacity = "1";


        }

        else {


            cursor.style.opacity = "0";


        }



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
// COMPROBACIONES
// ===============================


if (!dataContainer) {

    console.error(
        "No existe el elemento dataContainer"
    );

}



if (!startScreen) {

    console.warn(
        "No existe el elemento startScreen"
    );

}



if (!bgVideo) {

    console.warn(
        "No existe el elemento bgVideo"
    );

}



// ===============================
// ACTUALIZAR HORA SI EXISTE
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
// MENSAJE EN CONSOLA
// ===============================


console.log(
    "Sistema cargado correctamente."
);

console.log(
    "Esperando inicio del usuario..."
);



// ===============================
// CIERRE FINAL
// ===============================


});
