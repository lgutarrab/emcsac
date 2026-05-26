# Project Map - WebEmcsac

## Resumen

Sitio web estatico para EMCSAC - Electromecanica & Constructores SAC, enfocado en servicios de mantenimiento preventivo integral, electromecanica, limpieza tecnica, contratistas, bombas presurizadoras, sistemas electricos, sanitarios y contra incendios.

La pagina principal se abre directamente desde:

```text
C:\Users\Luis.Gutarra\Documents\WebEmcsac\index.html
```

## Estructura principal

```text
WebEmcsac/
|-- index.html
|-- styles.css
|-- script.js
|-- projectmap.md
|-- assets/
|   |-- emc-logo.jpeg
|   `-- emc-logo-transparent.png
`-- Imagenes web emcsac/
    `-- SERVICIOS EMCSAC/
        |-- BOMBAS DE AGUA/
        |-- EQUIPOS MECANICOS/
        |-- GASFITERIA/
        |-- INSTALACION BOMBAS/
        |-- INSTALACION TABLERO ELECTRICO/
        |-- INSTALACION TANQUE HIDRONEUMATICO/
        |-- LIMPIEZA CISTERNA CONTRA INCENDIO/
        |-- LIMPIEZA CISTERNA DE AGUA POTABLE/
        |-- LIMPIEZA POZO SUMIDERO/
        |-- LIMPIEZA POZO SEPTICO/
        |-- POZOS A TIERRA/
        |-- SISTEMA CONTRA INCENDIO/
        |-- SISTEMA PISCINA/
        `-- TABLEROS ELECTRICOS/
```

## Archivos principales

### index.html

Archivo principal de la web. Contiene toda la estructura visible:

- Cabecera fija con logo, nombre y navegacion.
- Hero principal con el titulo "Electromecanica & Constructores SAC".
- Indicadores de confianza.
- Presentacion de propuesta de valor.
- Seccion de servicios con 12 tarjetas.
- Metodo de trabajo.
- Sectores atendidos.
- Bloque de contacto.
- Footer.

Datos comerciales actuales:

```text
WhatsApp: +51 921 986 590
Correo: servicios@emcsac.com
Web: www.emcsac.com
```

### styles.css

Archivo de estilos de toda la pagina.

Zonas importantes:

- `:root`: colores principales, sombras y variables.
- `.site-header`: cabecera fija.
- `.brand-logo`: logo transparente de EMCSAC.
- `.hero`, `.hero-media`, `.hero-overlay`: fondo principal y portada.
- `.trust-strip`: indicadores debajo del hero.
- `.service-grid`, `.service-card`: grilla y tarjetas de servicios.
- `.process`: bloque azul de metodo de trabajo.
- `.sector-grid`: sectores atendidos.
- `.cta`: bloque final de contacto.
- `@media (max-width: 920px)` y `@media (max-width: 640px)`: responsive para tablet y movil.

Imagen de fondo actual del hero:

```css
https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1800&q=85
```

### script.js

JavaScript pequeno para interactividad basica:

- Agrega clase `is-scrolled` a la cabecera cuando se hace scroll.
- Abre/cierra el menu movil.
- Cierra el menu movil al hacer clic en un enlace.

### assets/

Carpeta para recursos usados directamente por la web.

- `emc-logo.jpeg`: logo original copiado al proyecto.
- `emc-logo-transparent.png`: version con fondo transparente usada en la cabecera.

### Imagenes web emcsac/

Banco local de imagenes y videos de servicios reales de EMCSAC. Actualmente sirve como repositorio de recursos para reemplazar imagenes externas por fotos propias.

Categorias principales disponibles:

- Bombas de agua.
- Equipos mecanicos.
- Gasfiteria.
- Instalacion de bombas.
- Instalacion de tablero electrico.
- Instalacion de tanque hidroneumatico.
- Limpieza de cisterna contra incendio.
- Limpieza de cisterna de agua potable.
- Limpieza de pozo sumidero.
- Limpieza de pozo septico.
- Pozos a tierra.
- Sistema contra incendio.
- Sistema piscina.
- Tableros electricos.

## Secciones de la pagina

### Cabecera

Ubicacion: `index.html`, dentro de `<header class="site-header">`.

Contiene:

- Logo `assets/emc-logo-transparent.png`.
- Nombre corto `EMCSAC`.
- Subtitulo `Electromecanica & Constructores SAC`.
- Navegacion a Servicios, Metodo, Sectores y Contacto.

### Hero principal

Ubicacion: `index.html`, `<section class="hero">`.

Contenido principal:

```text
Electromecanica & Constructores SAC
```

El fondo visual se controla desde `styles.css` en `.hero-media`.

### Servicios

Ubicacion: `index.html`, `<section class="section services" id="servicios">`.

Servicios cargados:

1. Mantenimiento preventivo integral de electrobombas.
2. Mantenimiento preventivo integral de sistemas hidroneumaticos.
3. Mantenimiento preventivo integral de tableros electricos.
4. Mantenimiento preventivo integral de sistema contra incendios.
5. Mantenimiento preventivo integral de puertas cortafuego.
6. Mantenimiento preventivo integral de pozo septico y sumidero.
7. Mantenimiento de extractor de monoxido de carbono.
8. Mantenimiento de presurizador de aire de escaleras.
9. Construccion y mantenimiento de pozos a tierra.
10. Limpieza y desinfeccion de cisternas y tanques.
11. Mantenimiento preventivo integral de piscinas y lagunas.
12. Desatoros y gasfiteria en general.

Cada servicio esta representado por:

```html
<article class="service-card">
  <img ... />
  <div class="service-body">
    <span>Numero</span>
    <h3>Nombre del servicio</h3>
    <p>Descripcion</p>
  </div>
</article>
```

### Contacto

Ubicacion: `index.html`, `<section class="cta" id="contacto">`.

Contiene enlaces directos a:

- WhatsApp.
- Correo.
- Web.

## Tareas frecuentes

### Cambiar el telefono de WhatsApp

Editar en `index.html`:

```html
href="https://wa.me/51921986590"
<strong>+51 921 986 590</strong>
```

### Cambiar el correo

Editar en `index.html`:

```html
href="mailto:servicios@emcsac.com"
<strong>servicios@emcsac.com</strong>
```

### Cambiar el logo

Reemplazar el archivo:

```text
assets/emc-logo-transparent.png
```

O cambiar la ruta en `index.html`:

```html
<img class="brand-logo" src="assets/emc-logo-transparent.png" alt="Logo de EMCSAC" />
```

### Cambiar la imagen de fondo principal

Editar `styles.css`, selector `.hero-media`:

```css
.hero-media {
  background:
    url("NUEVA_URL_O_RUTA_LOCAL")
    center / cover;
}
```

### Usar imagenes propias del proyecto

Se recomienda mover/copiar imagenes seleccionadas desde:

```text
Imagenes web emcsac\SERVICIOS EMCSAC\
```

hacia una carpeta mas simple para uso web, por ejemplo:

```text
assets/services/
```

Luego actualizar cada `<img src="...">` en `index.html`.

## Notas tecnicas

- Es una web estatica: no requiere backend, base de datos ni instalacion de dependencias.
- Puede abrirse con doble clic en `index.html`.
- Usa imagenes externas de Unsplash y una imagen externa de Pedrollo en algunas tarjetas.
- Para publicar, basta subir `index.html`, `styles.css`, `script.js`, `assets/` y cualquier carpeta de imagenes usada por la pagina.
- Si se reemplazan imagenes externas por locales, conviene optimizarlas para web antes de publicarlas.

