document.addEventListener('DOMContentLoaded', function() {
    const xmlhttp = new XMLHttpRequest();
    const url = 'previsionValdepeñas.xml'; // Nombre del archivo XML que descargaste

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const xmlDoc = this.responseXML;
            mostrarInformacion(xmlDoc);
        }
    };

    xmlhttp.open('GET', url, true);
    xmlhttp.send();

    function mostrarInformacion(xmlDoc) {
        const infoDiv = document.getElementById('info');

        // Mostrar la localidad y provincia
        const localidad = xmlDoc.getElementsByTagName('nombre')[0].textContent;
        const provincia = xmlDoc.getElementsByTagName('provincia')[0].textContent;
        infoDiv.innerHTML += `<h1>Previsión Meteorológica para ${localidad}</h1>`;
        infoDiv.innerHTML += `<p>Localidad: ${localidad}, Provincia: ${provincia}</p>`;

        // Acceder a la predicción
        const predicciones = xmlDoc.getElementsByTagName('dia');
        for (let i = 0; i < predicciones.length; i++) {
            const fecha = predicciones[i].getAttribute('fecha');
            infoDiv.innerHTML += `<h2>Fecha: ${fecha}</h2>`;

            // Buscar el periodo de 12 a 24h (segundo periodo)
            let encontrado = false;
            const periodos = predicciones[i].getElementsByTagName('estado_cielo');
            for (let j = 0; j < periodos.length; j++) {
                const periodo = periodos[j];
                const periodoTexto = periodo.getAttribute('periodo');
                if (periodoTexto === '12-24') {
                    encontrado = true;
                    const probPrecipitacion = predicciones[i].getElementsByTagName('prob_precipitacion')[j].textContent || '-';
                    const estadoCielo = periodo.getAttribute('descripcion') || '-';
                    const direccionViento = predicciones[i].getElementsByTagName('direccion')[j].textContent || '-';
                    const velocidadViento = predicciones[i].getElementsByTagName('velocidad')[j].textContent || '-';
                    const tempMax = predicciones[i].getElementsByTagName('temperatura')[0].getAttribute('maxima');
                    const tempMin = predicciones[i].getElementsByTagName('temperatura')[0].getAttribute('minima');

                    infoDiv.innerHTML += `
                        <p>Probabilidad de precipitación: ${probPrecipitacion}</p>
                        <p>Estado del cielo: ${estadoCielo}</p>
                        <p>Dirección del viento: ${direccionViento}, Velocidad del viento: ${velocidadViento}</p>
                        <p>Temperatura máxima: ${tempMax}, Temperatura mínima: ${tempMin}</p>
                    `;
                    // Una vez encontrado, rompemos el bucle para evitar mostrar múltiples periodos
                    break;
                }
            }

            if (!encontrado) {
                infoDiv.innerHTML += `<p>No hay información disponible para el periodo de 12 a 24h.</p>`;
            }
        }
    }
});