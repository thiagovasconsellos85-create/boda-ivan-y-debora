/**
 * Iván & Débora — Boda 18.12.2026
 * Funcionalidades:
 * 1. Reproducción de audio nativo HTML5 ("28 de Diciembre" - La Mona Jiménez)
 * 2. Cuenta regresiva en vivo
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. REPRODUCTOR DE AUDIO
  // ==========================================
  const audio = document.getElementById('weddingAudio');
  const toggleBtn = document.getElementById('musicToggleBtn');
  const heroBtn = document.getElementById('heroPlayBtn');
  const vinyl = document.getElementById('vinylDisc');
  const playSvg = document.getElementById('playSvg');
  const pauseSvg = document.getElementById('pauseSvg');
  const btnLabel = document.getElementById('musicBtnLabel');
  const heroStatus = document.getElementById('heroMusicStatus');

  let isPlaying = false;

  function setPlayingState(playing) {
    isPlaying = playing;
    if (playing) {
      if (vinyl) vinyl.classList.add('spinning');
      if (playSvg) playSvg.style.display = 'none';
      if (pauseSvg) pauseSvg.style.display = 'inline-block';
      if (btnLabel) btnLabel.textContent = 'Pausar';
      if (heroStatus) heroStatus.textContent = 'Pausar música';
    } else {
      if (vinyl) vinyl.classList.remove('spinning');
      if (playSvg) playSvg.style.display = 'inline-block';
      if (pauseSvg) pauseSvg.style.display = 'none';
      if (btnLabel) btnLabel.textContent = 'Reproducir';
      if (heroStatus) heroStatus.textContent = 'Escuchar música de fondo';
    }
  }

  function toggleMusic() {
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => {
        setPlayingState(true);
      }).catch((err) => {
        console.warn('Reproducción bloqueada por el navegador:', err);
      });
    } else {
      audio.pause();
      setPlayingState(false);
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  }

  if (heroBtn) {
    heroBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  }

  // Si termina el audio, vuelve a reproducir en bucle suave
  if (audio) {
    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      audio.play();
    });

    audio.addEventListener('play', () => setPlayingState(true));
    audio.addEventListener('pause', () => setPlayingState(false));
  }

  // ==========================================
  // 2. CUENTA REGRESIVA (18 de Diciembre de 2026, 13:00 hs)
  // ==========================================
  const targetDate = new Date('2026-12-18T13:00:00-03:00').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ==========================================
  // 3. AGREGAR RECORDATORIO (CALENDARIO)
  // ==========================================
  const reminderModal = document.getElementById('reminderModal');
  const btnOpenReminder = document.getElementById('btnOpenReminder');
  const btnCloseReminder = document.getElementById('btnCloseReminder');
  const btnGoogleCal = document.getElementById('btnGoogleCalendar');
  const btnDownloadIcs = document.getElementById('btnDownloadIcs');

  // Datos del evento (18 de Diciembre de 2026, 13:00 hs Argentina = 16:00 hs UTC)
  const eventConfig = {
    title: 'Boda Iván & Débora',
    startUtc: '20261218T160000Z',
    endUtc: '20261219T020000Z',
    location: 'Salón Adeliz, Ruta 11 km 321.5, Provincia de Buenos Aires',
    details: 'Boda de Iván Mariano Bozicevic & Débora Natalia Barrios. ¡Nos casamos! Salón Adeliz, Ruta 11 km 321,5. Dress Code: Blanco, nude.'
  };

  if (btnOpenReminder && reminderModal) {
    btnOpenReminder.addEventListener('click', () => {
      reminderModal.classList.add('active');
    });
  }

  if (btnCloseReminder && reminderModal) {
    btnCloseReminder.addEventListener('click', () => {
      reminderModal.classList.remove('active');
    });
  }

  // Cerrar al tocar fuera de la tarjeta
  if (reminderModal) {
    reminderModal.addEventListener('click', (e) => {
      if (e.target === reminderModal) {
        reminderModal.classList.remove('active');
      }
    });
  }

  // Enlace de Google Calendar
  if (btnGoogleCal) {
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventConfig.title)}&dates=${eventConfig.startUtc}/${eventConfig.endUtc}&details=${encodeURIComponent(eventConfig.details)}&location=${encodeURIComponent(eventConfig.location)}`;
    btnGoogleCal.href = gCalUrl;
  }

  // Descarga de archivo .ics (Apple Calendar / Outlook / Celulares)
  if (btnDownloadIcs) {
    btnDownloadIcs.addEventListener('click', () => {
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Ivan and Debora Wedding//ES',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `SUMMARY:${eventConfig.title}`,
        `DESCRIPTION:${eventConfig.details}`,
        `LOCATION:${eventConfig.location}`,
        `DTSTART:${eventConfig.startUtc}`,
        `DTEND:${eventConfig.endUtc}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Boda_Ivan_y_Debora.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (reminderModal) {
        reminderModal.classList.remove('active');
      }
    });
  }
});
