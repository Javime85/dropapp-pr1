// sketch.js - DropApp: Temporitzador visual de gotes d'aigua amb alertes natives
// ==============================================================================
// Desenvolupament d'aplicacions interactives
// Autor: Javier Villalón Mena
// Data: 02 Gener de 2026
// ==============================================================================
// DESCRIPCIÓ:
// - Aplicació híbrida Capacitor + p5.js per hidratació (recordatori de beure aigua)
// - Temporitzador visual amb 3 estats: repòs → comptant → alerta
// - Integració amb Capacitor: notificacions locals, llanterna, vibració, àudio natiu
// - Configuració persistent (localStorage): interval configurable, mode fosc/clar, llanterna
// ==============================================================================

let dropappSketch = (p) => {
  const CARD_WIDTH = 360;
  const CARD_HEIGHT = 560;

  // Layout general
  const HEADER_Y = 70;
  const DROP_CENTER_Y = 290;
  const DROP_HEIGHT = 260;
  const DROP_WIDTH = 190;

  // Botons horitzontals
  const BUTTON_Y = 500;
  const BUTTON_W = 160;
  const BUTTON_H = 56;
  const BUTTON_MARGIN = 20;

  // Temps
  let intervalHours = 1 / 60; // 1 minut per proves
  let intervalMs = intervalHours * 60 * 60 * 1000;
  let lastDropTime = 0;
  let progressSmooth = 0;
  let running = false;
  let started = false;

  // Imatge de la gota
  let imgGota;

  // Flag per activar/desactivar la llanterna segons configuració
  let flashEnabled = true;

  // Estat visual quan l'interval ha arribat a 0 (alerta)
  let alertActive = false;      // indica si estem en mode alerta visual
  let alertStartMillis = 0;     // moment en què s'ha activat l'alerta

  // ---------- PRELOAD ----------
  p.preload = () => {
    imgGota = p.loadImage('/gota.png');
  };

  // ---------- SETUP ----------
  p.setup = () => {
    const container = document.getElementById('p5-container');
    const canvas = p.createCanvas(CARD_WIDTH, CARD_HEIGHT);
    if (container) canvas.parent(container);

    p.textAlign(p.CENTER, p.CENTER);
    p.rectMode(p.CENTER);
    p.imageMode(p.CENTER);

    // Carrega d’hores + preferència de llanterna
    carregarConfiguracioDesDeStorage();

    running = false;
    started = false;
    progressSmooth = 0;
    lastDropTime = 0;

    // Funció global perquè la pantalla de configuració pugui forçar recàrrega
    window.dropappRecarregarInterval = () => {
      carregarConfiguracioDesDeStorage();
    };
  };

  // ---------- DRAW ----------
  p.draw = () => {
    p.clear();
    let remaining;

    // Lògica del temps restant
    if (running && started) {
      const elapsed = p.millis() - lastDropTime;
      remaining = intervalMs - elapsed;

      if (remaining <= 0) {
        remaining = 0;

        // Quan s’esgota l’interval, aturem el cronòmetre
        running = false;
        started = true;

        // Activem l'efecte visual d'alerta
        alertActive = true;
        alertStartMillis = p.millis();

        // Vibració puntual quan entrem en alerta
        if (typeof window.dropappVibrateImpact === 'function') {
          window.dropappVibrateImpact();
        }

        // So d'alarma natiu quan arriba a 0
        if (typeof window.dropappPlayAlarmSound === 'function') {
          window.dropappPlayAlarmSound();
        }
      }
    } else {
      if (!started) {
        remaining = intervalMs;
      } else {
        remaining = 0;
      }
    }

    const progressReal = 1 - remaining / intervalMs;
    progressSmooth = p.lerp(progressSmooth, progressReal, 0.1);

    dibuixarFonsCanvas(progressSmooth);
    dibuixarCapcalera();
    dibuixarGotaItemps(progressSmooth, remaining);
    dibuixarBoto1();
    dibuixarBoto2();
  };

  // ---------- CONFIG ----------

  function carregarConfiguracioDesDeStorage() {
    // Hores de l’interval
    const horesGuardades = localStorage.getItem('dropapp_interval_hours');
    if (horesGuardades !== null) {
      const horesNum = Number(horesGuardades);
      if (!Number.isNaN(horesNum) && horesNum > 0 && horesNum <= 24) {
        intervalHours = horesNum;
        intervalMs = intervalHours * 60 * 60 * 1000;
      }
    }

    // Lectura preferència llanterna
    const flash = localStorage.getItem('dropapp_flash_enabled');
    if (flash === 'true') {
      flashEnabled = true;
    } else if (flash === 'false') {
      flashEnabled = false;
    } else {
      flashEnabled = true;
    }
  }

  // ---------- FONS DEL CANVAS ----------

  function dibuixarFonsCanvas(progress) {
    // Colors base del degradat
    let topStart = p.color(0, 200, 230);
    let topEnd = p.color(0, 150, 200);
    let bottomStart = p.color(0, 160, 210);
    let bottomEnd = p.color(0, 80, 140);

    // Si estem en alerta, efecte de "pulsació" amb colors càlids
    if (alertActive) {
      const t = (p.millis() - alertStartMillis) / 400.0;
      const pulse = (p.sin(t) + 1) / 2;
      const alertTop = p.color(255, 120, 80);
      const alertBottom = p.color(200, 40, 40);
      topStart = p.lerpColor(topStart, alertTop, pulse);
      bottomEnd = p.lerpColor(bottomEnd, alertBottom, pulse);
    }

    const topCol = p.lerpColor(topStart, topEnd, progress);
    const bottomCol = p.lerpColor(bottomStart, bottomEnd, progress);

    const g = p.drawingContext.createLinearGradient(0, 0, 0, CARD_HEIGHT);
    g.addColorStop(0, topCol.toString());
    g.addColorStop(1, bottomCol.toString());

    p.noStroke();
    p.drawingContext.fillStyle = g;
    p.rectMode(p.CORNER);
    p.rect(0, 0, CARD_WIDTH, CARD_HEIGHT);
    p.rectMode(p.CENTER);
  }

  function dibuixarCapcalera() {
    p.noStroke();
    p.fill(255);
    p.textSize(26);
    p.textStyle(p.BOLD);
    p.text('DropApp', CARD_WIDTH / 2, HEADER_Y - 10);

    p.textSize(16);
    p.textStyle(p.NORMAL);
    p.fill(40, 48, 60);
    p.text('Temps fins a la pròxima gota', CARD_WIDTH / 2, HEADER_Y + 24);
  }

  // ---------- GOTA + TEMPS ----------

  function dibuixarGotaItemps(progress, remainingMs) {
    // Centre base de la gota
    let cx = CARD_WIDTH / 2;
    let cy = DROP_CENTER_Y;

    const imgW = DROP_WIDTH;
    const imgH = DROP_HEIGHT;

    const topY = cy - imgH / 2;
    const bottomY = cy + imgH / 2;

    // Tremolor quan hi ha alerta
    if (alertActive) {
      const shakeAmt = 4;
      cx += p.random(-shakeAmt, shakeAmt);
      cy += p.random(-shakeAmt, shakeAmt);

      // Vibració breu repetida mentre dura l'alerta
      if (typeof window.dropappVibrateShort === 'function' && p.frameCount % 15 === 0) {
        window.dropappVibrateShort();
      }
    }

    // Ombra sota la gota
    p.noStroke();
    p.fill(0, 0, 0, 80);
    p.ellipse(cx, bottomY + 18, imgW * 0.7, imgH * 0.22);

    if (imgGota) {
      p.noTint();
      p.image(imgGota, cx, cy, imgW, imgH);
    }

    // Petita goteta que cau quan està comptant
    if (remainingMs > 0 && running) {
      const fallT = (p.frameCount % 60) / 60;
      const startY = topY + imgH * 0.1;
      const endY = bottomY - imgH * 0.05;
      const dropY = p.lerp(startY, endY, fallT);

      p.noStroke();
      p.fill(230, 250, 255, 230);
      p.ellipse(cx, dropY, 12, 16);
    }

    // Text del temps restant
    const totalSeconds = Math.floor(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const textTime = nf2(hours) + ':' + nf2(minutes) + ':' + nf2(seconds);

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(22);
    p.textStyle(p.BOLD);

    const textX = cx;
    const textY = cy - imgH * 0.05;

    p.noStroke();
    p.fill(0, 90);
    p.text(textTime, textX + 1, textY + 2);
    p.fill(245);
    p.text(textTime, textX, textY);

    const percent = Math.round(progress * 100);
    p.textSize(14);
    p.textStyle(p.NORMAL);
    p.fill(220, 235);
    p.text(percent + "% de l'interval", textX, textY + 26);

        // --- Control de llanterna segons temps restant ---
    if (
      flashEnabled &&
      typeof window.dropappTorchOn === 'function' &&
      typeof window.dropappTorchOff === 'function'
    ) {
      if (running && remainingMs > 0 && remainingMs <= 10000) {
        // Estem comptant i falten <= 10 segons
        if (remainingMs > 5000) {
          // De 10s a 5s → llanterna fixa
          window.dropappTorchOn();
        } else {
          // De 5s a 0 → parpelleig ràpid
          const tFlash = Math.floor(remainingMs / 250);
          if (tFlash % 2 === 0) {
            window.dropappTorchOn();
          } else {
            window.dropappTorchOff();
          }
        }
      } else if (alertActive) {
        // Ja ha arribat a 0 i seguim en alerta → parpelleig continu
        const tFlash = Math.floor(p.millis() / 250);
        if (tFlash % 2 === 0) {
          window.dropappTorchOn();
        } else {
          window.dropappTorchOff();
        }
      } else {
        // Cap alerta, ni últims 10s → llanterna apagada
        window.dropappTorchOff();
      }
    }
}

  // ---------- BOTONS HORITZONTALS ----------

  function getButtonCenters() {
    const totalWidth = 2 * BUTTON_W + BUTTON_MARGIN;
    const startX = (CARD_WIDTH - totalWidth) / 2;
    const leftX = startX + BUTTON_W / 2;
    const rightX = leftX + BUTTON_W + BUTTON_MARGIN;
    return { leftX, rightX };
  }

  function dibuixarBoto1() {
    const { leftX } = getButtonCenters();
    p.noStroke();
    p.fill(255);
    p.rect(leftX, BUTTON_Y, BUTTON_W, BUTTON_H, 28);

    p.fill(35, 55, 85);
    p.textSize(14);
    p.textStyle(p.BOLD);
    p.text('Inicia recordatori', leftX, BUTTON_Y);
  }

  function dibuixarBoto2() {
    const { rightX } = getButtonCenters();
    p.noStroke();
    p.fill(255);
    p.rect(rightX, BUTTON_Y, BUTTON_W, BUTTON_H, 28);

    p.fill(20, 90, 50);
    p.textSize(14);
    p.textStyle(p.BOLD);
    p.text('He pres la gota', rightX, BUTTON_Y);
  }

  function nf2(value) {
    return value < 10 ? '0' + value : String(value);
  }

  // ---------- INTERACCIÓ ----------

  p.mousePressed = () => {
    const mx = p.mouseX;
    const my = p.mouseY;
    const { leftX, rightX } = getButtonCenters();

    // Botó 1: Inicia recordatori
    const inButton1 =
      mx >= leftX - BUTTON_W / 2 &&
      mx <= leftX + BUTTON_W / 2 &&
      my >= BUTTON_Y - BUTTON_H / 2 &&
      my <= BUTTON_Y + BUTTON_H / 2;

    if (inButton1) {
      lastDropTime = p.millis();
      progressSmooth = 0;
      running = true;
      started = true;

      // En reiniciar, sortim de mode alerta visual
      alertActive = false;

      // Apaguem llanterna per assegurar-nos que comencem net
      if (typeof window.dropappTorchOff === 'function') {
        window.dropappTorchOff();
      }

      if (typeof window.dropappCancelLarNotificacio === 'function') {
        window.dropappCancelLarNotificacio();
      }

      if (typeof window.dropappProgramarNotificacio === 'function') {
        const delayMs = Math.max(intervalMs - 10000, 0); // 10s abans del final
        window.dropappProgramarNotificacio(delayMs);
      }

      return;
    }

    // Botó 2: He pres la gota
    const inButton2 =
      mx >= rightX - BUTTON_W / 2 &&
      mx <= rightX + BUTTON_W / 2 &&
      my >= BUTTON_Y - BUTTON_H / 2 &&
      my <= BUTTON_Y + BUTTON_H / 2;

    if (inButton2) {
      lastDropTime = p.millis();
      progressSmooth = 0;
      running = true;
      started = true;

      // Quan l'usuari indica que s'ha pres la gota, APAGUEM la llanterna
      if (typeof window.dropappTorchOff === 'function') {
        window.dropappTorchOff();
      }

      // També sortim del mode alerta visual
      alertActive = false;

      if (typeof window.dropappCancelLarNotificacio === 'function') {
        window.dropappCancelLarNotificacio();
      }

      if (typeof window.dropappProgramarNotificacio === 'function') {
        const delayMs = Math.max(intervalMs - 15000, 0); // mateix avanç de 10s
        window.dropappProgramarNotificacio(delayMs);
      }

      return;
    }
  };
};

const sketch = new p5(dropappSketch);
