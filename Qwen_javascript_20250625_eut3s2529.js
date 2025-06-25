function mostrarRutina() {
  const tipo = document.querySelector('input[name="rutina"]:checked')?.value;
  if (!tipo) return alert("Selecciona un tipo de rutina");

  const datos = rutinas[tipo];
  let html = '';

  datos.forEach((dia, i) => {
    html += `<div class="dia"><h3>${dia.dia} - ${dia.grupo}</h3><ul>`;
    dia.ejercicios.forEach(ejercicio => {
      html += `<li>
        ${ejercicio}: 
        <input type="number" step="0.5" min="0" class="peso" data-ejercicio="${ejercicio.replace(/\s+/g, '_')}">
      </li>`;
    });
    html += `</ul></div>`;
  });

  document.getElementById("contenido").innerHTML = html;
}

function guardarDatos() {
  const inputs = document.querySelectorAll('.peso');
  const sesion = {};
  sesion.fecha = new Date().toISOString().split('T')[0];

  // Guardar pesos
  inputs.forEach(input => {
    sesion[input.dataset.ejercicio] = input.value;
  });

  // Guardar datos de carrera (opcional)
  sesion.tiempo = document.getElementById("tiempo").value;
  sesion.distancia = document.getElementById("distancia").value;
  sesion.ritmo = document.getElementById("ritmo").value;

  let historial = JSON.parse(localStorage.getItem('historial')) || [];
  historial.push(sesion);
  localStorage.setItem('historial', JSON.stringify(historial));

  alert("✅ Datos guardados localmente");
}

function mostrarProgreso() {
  const historial = JSON.parse(localStorage.getItem('historial')) || [];

  if (historial.length < 2) {
    document.getElementById('progreso-texto').innerText = "Necesitas al menos 2 sesiones para ver progreso.";
    return;
  }

  const ultima = historial[historial.length - 1];
  const penultima = historial[historial.length - 2];
  let texto = "";

  // Verificar peso en ejercicios
  Object.keys(ultima).forEach(key => {
    if (key === 'fecha' || key === 'tiempo' || key === 'distancia' || key === 'ritmo') return;

    const u = parseFloat(ultima[key]);
    const p = parseFloat(penultima[key]);

    if (!isNaN(u) && !isNaN(p)) {
      const dif = u - p;
      let flecha = '';
      if (dif > 0) flecha = '🔺 Subió';
      else if (dif < 0) flecha = '🔻 Bajó';
      else flecha = '➖ Igual';

      texto += `${key.replace(/_/g, ' ')}: ${dif.toFixed(1)} kg ${flecha}\n`;
    }
  });

  // Verificar tiempo de carrera
  const tUltimo = parseFloat(ultima.tiempo);
  const tPenultimo = parseFloat(penultima.tiempo);
  if (!