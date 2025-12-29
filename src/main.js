// src/main.js - Control general de DropApp (UI, configuració, notificacions, llanterna i vibració)
// --------------------------------------------------------------------------------------
// - Gestiona la UI HTML (targeta, modal de configuració, etc.).
// - Exposa funcions globals a window perquè el sketch p5.js pugui cridar funcionalitat nativa:
//   notificacions, llanterna i vibració.

import './sketch.js';

import { LocalNotifications } from '@capacitor/local-notifications';
import { Torch } from '@capawesome/capacitor-torch';

// Claus per localStorage
const KEY_INTERVAL_HOURS = 'dropapp_interval_hours';
const KEY_DARK_MODE = 'dropapp_dark_mode';
const KEY_FLASH = 'dropapp_flash_enabled';

// ---------- INICIALITZACIÓ DOM (SPLASH + CONFIG) ----------
document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash-screen');
  const app = document.getElementById('app-container');

  // Splash: mostra logo 1 segon i després mostra l'app principal
  setTimeout(() => {
    if (splash) splash.style.display = 'none';
    if (app) app.style.display = 'block';
  }, 1000);

  const configToggle = document.getElementById('config-toggle');
  const configPanel = document.getElementById('config-panel');
  const configBackdrop = document.getElementById('config-backdrop');
  const btnSave = document.getElementById('config-save');
  const btnCancel = document.getElementById('config-cancel');
  const inputHours = document.getElementById('config-interval-hours');
  const selectDark = document.getElementById('config-dark-mode');
  const chkFlash = document.getElementById('chk-flash');

  // Carrega valors inicials de configuració
  const storedHours = localStorage.getItem(KEY_INTERVAL_HOURS);
  if (storedHours && inputHours) inputHours.value = storedHours;

  const storedMode = localStorage.getItem(KEY_DARK_MODE);
  if (storedMode && selectDark) selectDark.value = storedMode;

  const storedFlash = localStorage.getItem(KEY_FLASH);
  if (chkFlash) chkFlash.checked = storedFlash !== 'false';

  // Aplicar mode clar/fosc inicial
  if (storedMode === 'on') {
    document.body.classList.remove('light-mode');
  } else {
    document.body.classList.add('light-mode');
  }

  // Obrir/tancar panell de configuració
  const openConfig = () => {
    configPanel?.classList.remove('hidden');
    configBackdrop?.classList.remove('hidden');
  };
  const closeConfig = () => {
    configPanel?.classList.add('hidden');
    configBackdrop?.classList.add('hidden');
  };

  configToggle?.addEventListener('click', openConfig);
  configBackdrop?.addEventListener('click', closeConfig);
  btnCancel?.addEventListener('click', closeConfig);

  // Desa canvis
  btnSave?.addEventListener('click', () => {
    if (inputHours) {
      const v = inputHours.value;
      localStorage.setItem(KEY_INTERVAL_HOURS, v);
    }

    if (selectDark) {
      const v = selectDark.value;
      localStorage.setItem(KEY_DARK_MODE, v);
      if (v === 'on') {
        document.body.classList.remove('light-mode');
      } else {
        document.body.classList.add('light-mode');
      }
    }

    if (chkFlash) {
      localStorage.setItem(KEY_FLASH, chkFlash.checked ? 'true' : 'false');
    }

    if (window.dropappRecarregarInterval) {
      window.dropappRecarregarInterval();
    }

    closeConfig();
  });

  // Inicialitzar permissos de notificacions (opcional)
  LocalNotifications.requestPermissions().catch(() => {});
});

// ---------- FUNCIONS NATIVES GLOBALS PER AL SKETCH ----------

// Programa una notificació local per d'aquí delayMs mil·lisegons
window.dropappProgramarNotificacio = async (delayMs) => {
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: 'DropApp',
          body: 'És hora de prendre la pròxima gota!',
          schedule: { at: new Date(Date.now() + delayMs) },
          smallIcon: 'ic_dropapp_notif',
        },
      ],
    });
  } catch (e) {
    console.log('Error programant notificació:', e);
  }
};

// Cancel·lar la notificació
window.dropappCancelLarNotificacio = async () => {
  try {
    await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
  } catch (e) {
    console.log('Error cancel·lant notificació:', e);
  }
};

// Llanterna
window.dropappTorchOn = async () => {
  try {
    await Torch.enable();
  } catch (e) {
    console.log('Error encenent la llanterna:', e);
  }
};

window.dropappTorchOff = async () => {
  try {
    await Torch.disable();
  } catch (e) {
    console.log('Error apagant la llanterna:', e);
  }
};

// Vibració (impacte inicial)
window.dropappVibrateImpact = () => {
  try {
    if (navigator.vibrate) navigator.vibrate(300);
  } catch (e) {
    console.log('Error vibració impacte:', e);
  }
};

// Vibració curta repetida
window.dropappVibrateShort = () => {
  try {
    if (navigator.vibrate) navigator.vibrate(120);
  } catch (e) {
    console.log('Error vibració curta:', e);
  }
};
