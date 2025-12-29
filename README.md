# DropApp

Aplicació mòbil híbrida (Capacitor + p5.js) per recordar quan aplicar una gota oftalmològica de manera periòdica.

## Descripció

DropApp permet configurar intervals de temps perquè el dispositiu avisi quan toca posar-se la següent gota, combinant una interfície gràfica amb animació i avisos nadius del terminal.

## Funcionalitat

- Temporitzador configurable entre 1 i 24 hores entre aplicacions
- Pantalla gràfica amb gota animada i percentatge de progrés de l'interval
- Alertes natives al final de cada interval:
  * Notificació local
  * Llanterna (mode fix i parpelleig)
  * Vibració i so d'alarma
- Configuració persistent mitjançant emmagatzematge local:
  * Interval entre dosis
  * Mode fosc/clar
  * Activació de llanterna i notificacions

## Tecnologies utilitzades

- Vite + JavaScript
- p5.js per al canvas i les animacions
- Capacitor 6 per empaquetar l'app i accedir a funcionalitats natives
- Plugins/funcionalitats natives:
  * `@capacitor/local-notifications`
  * `@capacitor/haptics`
  * `@capawesome/capacitor-torch`

## Instal·lació i execució (Android)

```
npm install
npm run build
npx cap sync android
npx cap open android
```
```

L'avaluació es fa només sobre Android: el projecte s'ha provat en un dispositiu **Xiaomi Redmi Note 14 Pro** amb **Android 15**.

## Estat actual i problemes coneguts

- Timer i animació funcionen correctament en entorn web i Android
- Integració de notificacions, vibració i llanterna operativa en el dispositiu de proves
- **Limitacions MIUI**:
  * Vibració feble per optimitzacions del sistema
  * Notificacions poden requerir ajustos manuals de permisos
  * Timer s'atura en segon pla (setInterval JS) - LocalNotifications com a backup

## Millores futures (PR2)

- API Open-Meteo per humitat/temperatura ambientals
- Historial d'aplicacions amb gràfic p5.js
- Suport per sèries de tractament (4 gotes/dia)
- Temporitzador natiu independent del WebView

## Llicència

Aquest projecte està publicat sota la llicència **MIT**. Vegeu el fitxer `LICENSE` per a més detalls.

## Descàrrega directa

```
[Descarregar ZIP](https://github.com/Javime85/dropapp-pr1/archive/refs/heads/main.zip)
```

O clona el repositori:

```
git clone https://github.com/Javime85/dropapp-pr1.git
```
```

## Autor

**Javier Villalón Mena** – UOC, assignatura *Desenvolupament d'aplicacions interactives* (PR1).
