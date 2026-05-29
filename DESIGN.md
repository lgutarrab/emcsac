# Design System: EMCSAC

## 1. Visual Theme & Atmosphere

Interfaz industrial sobria para servicios tecnicos criticos. Densidad 5/10, variacion 6/10 y movimiento 3/10: suficiente informacion para escanear rapido, composiciones asimetricas moderadas y micro-interacciones discretas. La atmosfera debe sentirse como una sala de mantenimiento bien iluminada: orden, evidencia, herramientas reales y criterio profesional.

## 2. Color Palette & Roles

- **Operational Canvas** (#F3F6F9) - fondo principal frio y limpio.
- **Field White** (#FFFFFF) - superficies de tarjetas, paneles y menus.
- **Graphite Ink** (#111827) - texto principal y titulares.
- **Steel Text** (#596575) - texto secundario y descripciones.
- **Structural Line** (#DDE5ED) - divisores, bordes suaves y contornos.
- **Technical Blue** (#0B5FA5) - color de marca para enlaces, estados activos y datos de confianza.
- **Safety Amber** (#F1B521) - unico acento para CTA, foco, senales de prioridad y llamadas a cotizar.
- **System Green** (#1F7A55) - uso semantico limitado para disponibilidad o confirmacion, nunca como segundo color de marca.
- **Deep Plant Navy** (#07111F) - fondos de alto contraste para bloques de metodo, footer y capas sobre fotografia.

## 3. Typography Rules

- **Display:** `Aptos Display`, `Segoe UI Variable Display`, system sans-serif. Titulares firmes, maximo 2-3 lineas, `text-wrap: balance`, peso 700-800.
- **Body:** `Aptos`, `Segoe UI`, system sans-serif. Line-height 1.6, parrafos maximo 65-75ch, sin justificado forzado en pantallas.
- **Numbers:** usar `font-variant-numeric: tabular-nums` para indicadores y datos de contacto.
- **Labels:** sentence case o mayusculas cortas de 1-3 palabras; evitar repetir pequenos labels decorativos en exceso.

## 4. Component Stylings

* **Header:** compacto, fijo, con blur ligero y logo proporcionado. En movil debe mostrar menu accesible y no ocultar navegacion.
* **Buttons:** radio 8px, feedback de hover y active con `transform`, foco visible en Safety Amber. El texto no debe partirse en desktop.
* **Service cards:** imagen real arriba, contenido claro abajo, elevacion baja y sombra tintada azul. El enlace ocupa toda la tarjeta y tiene estado de foco.
* **Gallery detail:** sidebar de filtros con estado activo fuerte, visor grande con miniaturas tactiles y vacio informativo cuando no hay media.
* **CTA/contact:** paneles de contacto con alta legibilidad, enlaces reales y jerarquia clara entre WhatsApp, correo y web.

## 5. Layout Principles

Usar contenedores maximos entre 1120px y 1240px. La home alterna layout de hero fotografico, banda de indicadores, grilla de servicios, bloque oscuro de metodo, sectores compactos y CTA fotografico. Evitar que todas las secciones parezcan tarjetas iguales. En menos de 768px, todo colapsa a una columna, sin scroll horizontal y con targets tactiles amplios.

## 6. Motion & Interaction

Movimiento discreto y utilitario. Animar solo `opacity` y `transform`, con duraciones 180-320ms y curvas con peso. Usar entrada escalonada para tarjetas y paneles, hover sutil en acciones, y desactivar transformaciones bajo `prefers-reduced-motion`.

## 7. Anti-Patterns (Banned)

No usar morado/neon, brillo exterior, sombras negras duras, copy generico tipo "elevate" o "next-gen", hero centrado sin imagen, tarjetas de tres columnas sin variacion, placeholders, numeros falsamente perfectos, enlaces muertos, imagenes sin alt, texto justificado que genere rios visuales, menu movil inaccesible, ni animaciones que afecten layout.
