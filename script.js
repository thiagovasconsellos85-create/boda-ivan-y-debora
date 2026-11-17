/**
 * Iván & Débora — Boda 18.12.2026
 * Funcionalidades:
 * 1. Reproducción de audio nativo HTML5 ("28 de Diciembre" - La Mona Jiménez) con ecualizador animado
 * 2. Animación de fondo en Canvas: Pétalos flotantes y destellos dorados
 * 3. Animación de aparición al hacer scroll (Scroll Reveal)
 * 4. Cuenta regresiva en vivo
 * 5. Agregar recordatorio al calendario (Google & .ics)
 * 6. Confirmación de asistencia directa vía WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. ANIMACIÓN DE FONDO EN CANVAS (Pétalos y Destellos)
  // ==========================================
  function initCanvasFX() {
    const canvas = document.getElementById('fxCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Crear partículas (pétalos y brillos dorados)
    const particleCount = window.innerWidth < 768 ? 22 : 38;
    const particles = [];

    // Colores elegantes acordes a la paleta blanco y nude
    const petalColors = [
      'rgba(247, 240, 232, 0.75)', // Marfil suave
      'rgba(235, 220, 205, 0.70)', // Nude cálido
      'rgba(224, 204, 184, 0.65)', // Arena suave
      'rgba(255, 255, 255, 0.80)'  // Blanco seda
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        isPetal: i % 3 !== 0, // 2/3 son pétalos, 1/3 son destellos dorados
        x: Math.random() * width,
        y: Math.random() * height,
        size: (i % 3 !== 0) ? (Math.random() * 8 + 8) : (Math.random() * 2.5 + 1.5),
        speedY: Math.random() * 0.8 + 0.4,
        speedX: Math.random() * 0.6 - 0.3,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.02,
        oscillationSpeed: Math.random() * 0.02 + 0.01,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        sparkleAlpha: Math.random(),
        sparkleSpeed: Math.random() * 0.03 + 0.01
      });
    }

    let animationId = null;

    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size, 0, 0, p.size * 1.4);
      ctx.bezierCurveTo(-p.size, 0, -p.size / 2, -p.size / 2, 0, 0);
      ctx.fill();
      ctx.restore();
    }

    function drawSparkle(p) {
      p.sparkleAlpha += p.sparkleSpeed;
      const alpha = (Math.sin(p.sparkleAlpha) + 1) / 2 * 0.6 + 0.2;
      ctx.save();
      ctx.fillStyle = `rgba(214, 175, 120, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.3;
        p.angle += p.angularSpeed;

        if (p.isPetal) {
          drawPetal(p);
        } else {
          drawSparkle(p);
        }

        // Si sale de pantalla, reaparece arriba
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();

    // Pausar animación si la pestaña no está visible para ahorrar batería
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    });
  }
  initCanvasFX();

  // ==========================================
  // 2. ANIMACIÓN DE APARICIÓN AL HACER SCROLL (Scroll Reveal)
  // ==========================================
  function initScrollReveal() {
    const cards = document.querySelectorAll('.reveal-card');
    if (!cards.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      cards.forEach((card) => observer.observe(card));
    } else {
      // Fallback para navegadores antiguos
      cards.forEach((card) => card.classList.add('revealed'));
    }
  }
  initScrollReveal();

  // ==========================================
  // 3. REPRODUCTOR DE AUDIO & ECUALIZADOR
  // ==========================================
  const audio = document.getElementById('weddingAudio');
  const toggleBtn = document.getElementById('musicToggleBtn');
  const heroBtn = document.getElementById('heroPlayBtn');
  const vinyl = document.getElementById('vinylDisc');
  const equalizer = document.getElementById('equalizer');
  const playSvg = document.getElementById('playSvg');
  const pauseSvg = document.getElementById('pauseSvg');
  const btnLabel = document.getElementById('musicBtnLabel');
  const heroStatus = document.getElementById('heroMusicStatus');

  let isPlaying = false;

  function setPlayingState(playing) {
    isPlaying = playing;
    if (playing) {
      if (vinyl) vinyl.classList.add('spinning');
      if (equalizer) equalizer.classList.add('playing');
      if (playSvg) playSvg.style.display = 'none';
      if (pauseSvg) pauseSvg.style.display = 'inline-block';
      if (btnLabel) btnLabel.textContent = 'Pausar';
      if (heroStatus) heroStatus.textContent = 'Pausar música de fondo';
    } else {
      if (vinyl) vinyl.classList.remove('spinning');
      if (equalizer) equalizer.classList.remove('playing');
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

  if (audio) {
    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      audio.play();
    });
    audio.addEventListener('play', () => setPlayingState(true));
    audio.addEventListener('pause', () => setPlayingState(false));
  }

  // ==========================================
  // 4. CUENTA REGRESIVA (18 de Diciembre de 2026, 13:00 hs)
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
  // 5. AGREGAR RECORDATORIO (CALENDARIO)
  // ==========================================
  const reminderModal = document.getElementById('reminderModal');
  const btnOpenReminder = document.getElementById('btnOpenReminder');
  const btnCloseReminder = document.getElementById('btnCloseReminder');
  const btnGoogleCal = document.getElementById('btnGoogleCalendar');
  const btnDownloadIcs = document.getElementById('btnDownloadIcs');

  const eventConfig = {
    title: 'Boda Iván & Débora',
    startUtc: '20261218T160000Z',
    endUtc: '20261219T020000Z',
    location: 'Salón Adeliz, Ruta 11 km 321.5, Provincia de Buenos Aires',
    details: 'Boda de Iván Mariano Bozicevic & Débora Natalia Barrios. ¡Nos casamos! Salón Adeliz, Ruta 11 km 321,5. Dress Code: Elegante Sport.'
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

  if (reminderModal) {
    reminderModal.addEventListener('click', (e) => {
      if (e.target === reminderModal) {
        reminderModal.classList.remove('active');
      }
    });
  }

  if (btnGoogleCal) {
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventConfig.title)}&dates=${eventConfig.startUtc}/${eventConfig.endUtc}&details=${encodeURIComponent(eventConfig.details)}&location=${encodeURIComponent(eventConfig.location)}`;
    btnGoogleCal.href = gCalUrl;
  }

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

  // ==========================================
  // 6. CONFIRMACIÓN DE ASISTENCIA (WHATSAPP)
  // ==========================================
  const whatsappNumber = '5492257540541'; // 2257540541 con prefijo Argentina 54 9
  const btnRsvpYes = document.getElementById('btnRsvpYes');
  const btnRsvpNo = document.getElementById('btnRsvpNo');
  const rsvpNameInput = document.getElementById('rsvpNameInput');

  function sendWhatsAppRsvp(attendance) {
    const guestName = rsvpNameInput ? rsvpNameInput.value.trim() : '';
    let msg = '';

    if (attendance === 'SI') {
      if (guestName) {
        msg = `¡Hola Iván y Débora! Soy ${guestName}. Confirmo que SÍ asistiré a su boda el 18 de Diciembre de 2026.`;
      } else {
        msg = `¡Hola Iván y Débora! Confirmo que SÍ asistiré a su boda el 18 de Diciembre de 2026.`;
      }
    } else {
      if (guestName) {
        msg = `¡Hola Iván y Débora! Soy ${guestName}. Lamentablemente NO podré asistir a su boda el 18 de Diciembre de 2026, pero les deseo lo mejor en su gran día.`;
      } else {
        msg = `¡Hola Iván y Débora! Lamentablemente NO podré asistir a su boda el 18 de Diciembre de 2026, pero les deseo lo mejor en su gran día.`;
      }
    }

    const url = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  if (btnRsvpYes) {
    btnRsvpYes.addEventListener('click', () => sendWhatsAppRsvp('SI'));
  }

  if (btnRsvpNo) {
    btnRsvpNo.addEventListener('click', () => sendWhatsAppRsvp('NO'));
  }
});
