// Simulación de una base de datos con datos ficticios
const baseDeDatos = {
    citas: [],
    historialesMedicos: {},
    dispositivosIoT: [],
    usuarios: { '109329': { nombre: 'Juliana Arango', medicaciones: ['Acetaminofen', 'Ibuprofeno'], mensajes: [] } },
    profesionalesSalud: { '42351': { nombre: 'Dra. Natalia Giraldo', mensajes: [] } },
    recordatorios: [],
    sesiones: {} // Almacenar tokens de sesión para la autenticación
  };
  
  const utilidadesAutenticacion = {
    generarToken: () => { return Math.random().toString(36).substring(2); },
    verificarToken: (token) => { return baseDeDatos.sesiones.includes(token); }
  };
  
  const serviciosSalud = {
    gestionCitas: {
      reservar: (cita) => { baseDeDatos.citas.push(cita); },
      cancelar: (idCita) => { baseDeDatos.citas = baseDeDatos.citas.filter(cita => cita.id !== idCita); },
      reprogramar: (idCita, nuevaCita) => {
        const index = baseDeDatos.citas.findIndex(cita => cita.id === idCita);
        if (index !== -1) {
          baseDeDatos.citas[index] = { ...baseDeDatos.citas[index], ...nuevaCita };
        }
      },
      obtenerCitas: (pacienteId) => { return baseDeDatos.citas.filter(cita => cita.pacienteId === pacienteId); }
    },
    historialMedico: {
      obtener: (pacienteId) => { return baseDeDatos.historialesMedicos[pacienteId] || []; },
      actualizar: (pacienteId, registro) => {
        if (!baseDeDatos.historialesMedicos[pacienteId]) {
          baseDeDatos.historialesMedicos[pacienteId] = [];
        }
        baseDeDatos.historialesMedicos[pacienteId].push(registro);
      }
    },
    monitoreoSalud: {
      conectarDispositivo: (dispositivo) => { baseDeDatos.dispositivosIoT.push(dispositivo); },
      obtenerDatos: (dispositivoId) => {
        const dispositivo = baseDeDatos.dispositivosIoT.find(d => d.id === dispositivoId);
        return dispositivo ? dispositivo.ultimosDatos : null;
      }
    },
    comunicacion: {
      iniciarChat: (pacienteId, profesionalId) => { 
        const chatId = `chat_${new Date().getTime()}`;
        baseDeDatos.chats[chatId] = { mensajes: [] };
        console.log(`Chat iniciado entre el paciente ${pacienteId} y el profesional ${profesionalId}. ID del chat: ${chatId}`);
        return chatId; },
      iniciarVideoconferencia: (pacienteId, profesionalId) => {   
    const salaVideoconferencia = `sala_${new Date().getTime()}`;
      console.log(`Videoconferencia iniciada entre el paciente ${pacienteId} y el profesional ${profesionalId}. Sala: ${salaVideoconferencia}`);
      return salaVideoconferencia; }
    },
    recordatoriosMedicacion: {
      establecerRecordatorio: (pacienteId, medicacion, horario) => { 
        baseDeDatos.recordatorios.push({ pacienteId, medicacion, horario });
        console.log(`Recordatorio establecido para el paciente con identificacion: ${pacienteId} para la medicación '${medicacion}' a las ${horario}.`); 
    },
      obtenerRecordatorios: (pacienteId) => { return baseDeDatos.usuarios[pacienteId].medicaciones; },
      verificarCumplimiento: (pacienteId) => {
        const usuario = baseDeDatos.usuarios[pacienteId];
        return usuario ? usuario.medicaciones.map(med => `Es hora de tu ${med}`) : [];
      }
    },
    analisisReportes: {
      generarReporte: (pacienteId) => { 
        const historialPaciente = baseDeDatos.historialesMedicos[pacienteId] || [];
        const reporte = historialPaciente.map(registro => `Fecha: ${registro.fecha}, Nota: ${registro.nota}`).join('\n');
        console.log(`Reporte de salud para el paciente ${pacienteId}:\n${reporte}`);
        return reporte;
      },
      analizarDatos: (datosSalud) => {
        const promedios = {};
        Object.keys(datosSalud).forEach((medicion) => {
          const total = datosSalud[medicion].reduce((sum, valor) => sum + valor, 0);
          promedios[medicion] = total / datosSalud[medicion].length;
        });
        console.log('Promedios de datos de salud:', promedios);
        return promedios;
       },
       obtenerEstadisticas: (pacienteId) => {
        const historial = baseDeDatos.historialesMedicos[pacienteId] || [];
        const estadisticas = {
          numeroDeVisitas: historial.length,
          condicionesComunes: {},
          recomendaciones: {}
        };
      
        historial.forEach((registro) => {
            
            if (Array.isArray(registro.condiciones)) {
              registro.condiciones.forEach((condicion) => {
                estadisticas.condicionesComunes[condicion] = (estadisticas.condicionesComunes[condicion] || 0) + 1;
              });
            }
        
            if (Array.isArray(registro.recomendaciones)) {
              registro.recomendaciones.forEach((recomendacion) => {
                estadisticas.recomendaciones[recomendacion] = (estadisticas.recomendaciones[recomendacion] || 0) + 1;
              });
            }
          });
        
          console.log(`Estadísticas para el paciente ${pacienteId}:`, estadisticas);
          return estadisticas;
      }
      
    },
    autenticacion: {
      iniciarSesion: (usuarioId, contraseña) => {
        const usuario = baseDeDatos.usuarios[usuarioId];
        if (usuario && usuario.contraseña === contraseña) {
          const token = utilidadesAutenticacion.generarToken();
          baseDeDatos.sesiones[usuarioId] = token;
          console.log(`Usuario ${usuarioId} ha iniciado sesión con éxito. Token: ${token}`);
          return token;
        } else {
          console.log('Credenciales inválidas.');
          return null;
        }
      },
      cerrarSesion: (usuarioId) => {
        delete baseDeDatos.sesiones[usuarioId];
      }
    },
    mensajeria: {
      enviarMensaje: (deUsuarioId, aUsuarioId, mensaje) => {
        if (baseDeDatos.usuarios[aUsuarioId]) {
          baseDeDatos.usuarios[aUsuarioId].mensajes.push({ de: deUsuarioId, contenido: mensaje });
        } else if (baseDeDatos.profesionalesSalud[aUsuarioId]) {
          baseDeDatos.profesionalesSalud[aUsuarioId].mensajes.push({ de: deUsuarioId, contenido: mensaje });
        }
      },
      obtenerMensajes: (usuarioId) => {
        let mensajes = [];
      
        if (baseDeDatos.usuarios[usuarioId] && Array.isArray(baseDeDatos.usuarios[usuarioId].mensajes)) {
          mensajes = mensajes.concat(baseDeDatos.usuarios[usuarioId].mensajes);
        }
        if (baseDeDatos.profesionalesSalud[usuarioId] && Array.isArray(baseDeDatos.profesionalesSalud[usuarioId].mensajes)) {
          mensajes = mensajes.concat(baseDeDatos.profesionalesSalud[usuarioId].mensajes);
        }
        return mensajes;
      }
    }
  };
  
  // Ejemplo de uso de los servicios
  serviciosSalud.gestionCitas.reservar({ id: 1, pacienteId: '109329', fecha: '2024-06-01', hora: '09:00' });
  serviciosSalud.historialMedico.actualizar('109329', { fecha: '2024-05-30', nota: 'Consulta general' });
  serviciosSalud.monitoreoSalud.conectarDispositivo({ id: 'abc', tipo: 'monitorPresion', ultimosDatos: { presion: 120 } });
serviciosSalud.recordatoriosMedicacion.establecerRecordatorio('109329', 'Advil', '08:00 AM');

  const estadisticasSalud = serviciosSalud.analisisReportes.obtenerEstadisticas('109329');
  
  const tokenUsuario = serviciosSalud.autenticacion.iniciarSesion('109329', 'contraseñaSegura');
  
  serviciosSalud.mensajeria.enviarMensaje('109329', '42351', 'Hola Dra. Giraldo, tengo una pregunta sobre mi medicación.');

console.log('Mensajes de la Dra. Giraldo después de recibir:', baseDeDatos.profesionalesSalud['42351'].mensajes);
const mensajesJuliana = serviciosSalud.mensajeria.obtenerMensajes('109329');
console.log('Mensajes de Juliana Arango:', mensajesJuliana);
  
  console.log('Estadísticas de salud:', estadisticasSalud);
  