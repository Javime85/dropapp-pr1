# DropApp

Aplicació mòbil híbrida (**Capacitor** + **p5.js**) per recordar quan aplicar una gota oftalmològica de manera periòdica.

## Descripció

DropApp permet configurar intervals de temps perquè el dispositiu avisi quan toca posar-se la següent gota, combinant una interfície gràfica amb animació i avisos nadius del terminal.

## Funcionalitat

- Temporitzador configurable entre 1 i 24 hores entre aplicacions.
- Pantalla gràfica amb gota animada i percentatge de progrés de l’interval.
- Alertes natives al final de cada interval:
  - Notificació local.
  - Llanterna (mode fix i parpelleig).
  - Vibració i so d’alarma.
- Configuració persistent mitjançant emmagatzematge local:
  - Interval entre dosis.
  - Mode fosc/clar.
  - Activació de llanterna i notificacions.

## Tecnologies utilitzades

- **Vite** + JavaScript
- **p5.js** per al canvas i les animacions
- **Capacitor 8** per empaquetar l’app i accedir a funcionalitats natives [web:180][web:183]
- Plugins/funcionalitats natives:
  - Local Notifications
  - Torch (llanterna)
  - Native Audio
  - Vibration (plugin Cordova)

## Instal·lació i execució (Android)

Des d’un clon del repositori:
npm install #Instal·lar dependències
npm run build #Generar build de producció (dist/)
npx cap sync android #Sincronitzar amb el projecte Android
npx cap open android #Obrir el projecte a Android Studio

L’avaluació es fa només sobre Android: el projecte s’ha provat en un dispositiu **Xiaomi Redmi Note 14 Pro** amb **Android 15**.

## Estat actual i problemes coneguts

- Timer i animació funcionen correctament en entorn web i Android.
- Integració de notificacions, vibració i llanterna operativa en el dispositiu de proves, tot i que el comportament pot dependre de la configuració de permisos i de vibració de cada terminal. [file:1]
- Possibles limitacions:
  - Cal revisar ajustos de vibració/llum del mòbil si alguna alerta no es mostra.
  - El flux de configuració encara és bàsic i pot millorar-se a nivell d’UX.

## Millores futures

- Afegir més opcions de configuració de recordatoris (sèries de gotes, nombre de dies de tractament).
- Permetre registrar l’hora real en què s’ha aplicat cada gota i mostrar un historial.
- Millorar l’estètica general i afegir més estats visuals al canvas (per exemple, diferents gotes segons el progrés).
- Preparar la continuació per a PR2 amb consulta a una API externa relacionada amb salut o recordatoris.

## Llicència

Aquest projecte està publicat sota la llicència MIT.
Vegeu el fitxer `LICENSE` per a més detalls.

## Autor

Javier Villalón Mena – UOC, assignatura **Desenvolupament d’aplicacions interactives** (PR1).
