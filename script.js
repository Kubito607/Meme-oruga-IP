// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const startScreen = document.getElementById('startScreen');
    const bgVideo = document.getElementById('bgVideo');
    const dataContainer = document.getElementById('dataContainer');
    const cursor = document.getElementById('cursor');
    
    // Variables para estadísticas
    let clickCount = 0;
    let keyPressCount = 0;
    let mouseX = 0;
    let mouseY = 0;
    
    // Evento para iniciar la aplicación
    startScreen.addEventListener('click', function() {
        // Ocultar pantalla de inicio con transición
        startScreen.style.opacity = '0';
        
        // Iniciar video con sonido
        setTimeout(() => {
            startScreen.style.display = 'none';
            bgVideo.muted = false;
            bgVideo.play();
            startDataAnimation();
        }, 1000);
    });
    
    // Función para obtener datos del sistema
    async function getSystemData() {
        const data = {};
        
        // Información de red y geolocalización
        try {
            const response = await fetch('https://ipapi.co/json/');
            const ipData = await response.json();
            
            data['Dirección IP pública'] = ipData.ip || 'No disponible';
            data['IPv4'] = ipData.ip || 'No disponible';
            data['Ciudad'] = ipData.city || 'No disponible';
            data['Región'] = ipData.region || 'No disponible';
            data['País'] = ipData.country_name || 'No disponible';
            data['Código del país'] = ipData.country_code || 'No disponible';
            data['ISP'] = ipData.org || 'No disponible';
            data['ASN'] = ipData.asn || 'No disponible';
            data['Latitud'] = ipData.latitude || 'No disponible';
            data['Longitud'] = ipData.longitude || 'No disponible';
            data['Zona horaria'] = ipData.timezone || 'No disponible';
        } catch (error) {
            console.error('Error al obtener datos de IP:', error);
            data['Dirección IP pública'] = 'No disponible';
            data['IPv4'] = 'No disponible';
            data['Ciudad'] = 'No disponible';
            data['Región'] = 'No disponible';
            data['País'] = 'No disponible';
            data['Código del país'] = 'No disponible';
            data['ISP'] = 'No disponible';
            data['ASN'] = 'No disponible';
            data['Latitud'] = 'No disponible';
            data['Longitud'] = 'No disponible';
            data['Zona horaria'] = 'No disponible';
        }
        
        // Fecha y hora actual
        const now = new Date();
        data['Hora'] = now.toLocaleTimeString();
        data['Fecha'] = now.toLocaleDateString();
        
        // Información del navegador
        data['Navegador'] = getBrowserName();
        data['Versión del navegador'] = getBrowserVersion();
        data['User Agent'] = navigator.userAgent;
        data['Idioma'] = navigator.language;
        data['Idiomas instalados'] = navigator.languages.join(', ');
        
        // Información del sistema
        data['Sistema operativo aproximado'] = getOperatingSystem();
        data['Resolución de pantalla'] = `${screen.width} x ${screen.height}`;
        data['Resolución disponible'] = `${screen.availWidth} x ${screen.availHeight}`;
        data['Relación de aspecto'] = (screen.width / screen.height).toFixed(2);
        data['Profundidad de color'] = `${screen.colorDepth} bits`;
        data['Tamaño de la ventana'] = `${window.innerWidth} x ${window.innerHeight}`;
        
        // Información de hardware
        data['Núcleos del procesador'] = navigator.hardwareConcurrency || 'No disponible';
        data['Memoria RAM aproximada'] = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'No disponible';
        
        // Información de GPU
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                data['GPU mediante WebGL'] = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                data['Fabricante de la GPU'] = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            } else {
                data['GPU mediante WebGL'] = 'No disponible';
                data['Fabricante de la GPU'] = 'No disponible';
            }
        } else {
            data['GPU mediante WebGL'] = 'No disponible';
            data['Fabricante de la GPU'] = 'No disponible';
        }
        
        // Otras informaciones
        data['Cookies habilitadas'] = navigator.cookieEnabled ? 'Sí' : 'No';
        data['Estado de conexión'] = navigator.onLine ? 'En línea' : 'Desconectado';
        data['Tipo de conexión'] = navigator.connection ? navigator.connection.effectiveType : 'No disponible';
        data['Velocidad estimada'] = navigator.connection ? `${navigator.connection.downlink} Mbps` : 'No disponible';
        data['Ping aproximado'] = navigator.connection ? `${navigator.connection.rtt} ms` : 'No disponible';
        
        // Batería
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                data['Nivel de batería'] = `${Math.round(battery.level * 100)}%`;
            } catch (error) {
                data['Nivel de batería'] = 'No disponible';
            }
        } else {
            data['Nivel de batería'] = 'No disponible';
        }
        
        // Estadísticas de interacción
        data['Mouse X'] = mouseX;
        data['Mouse Y'] = mouseY;
        data['Cantidad de clics'] = clickCount;
        data['Cantidad de teclas presionadas'] = keyPressCount;
        
        // Memoria JavaScript
        if (performance.memory) {
            const usedMemory = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
            data['Memoria JavaScript utilizada'] = `${usedMemory} MB