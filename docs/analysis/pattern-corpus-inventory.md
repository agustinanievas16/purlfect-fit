# Inventario técnico inicial de patrones

**Propósito.** Identificar casos de validación para el MVP de sweater raglán top-down. Este documento registra únicamente características técnicas y medidas publicadas necesarias para analizar el tallaje; no reproduce instrucciones de los patrones.

## Corpus recibido

| Patrón | Construcción | Rango declarado | Uso para el MVP |
| --- | --- | --- | --- |
| `SweaterNo9-MFTK.pdf` | Raglán top-down clásico, circular, cuello alto | 6 talles | **Caso de verdad inicial.** Construcción simple y holgura declarada. |
| `CumulusBlouseONeck-PetiteKnit.pdf` | Raglán top-down, comienzo plano para formar escote y luego circular | 9 talles | **Caso de verdad 02.** Confirma fases solo-cuerpo en talles mayores. |
| `AmélieTee-PetiteKnit.pdf` | Raglán top-down, escote formado en plano y luego circular | 10 talles | Caso secundario de parte superior; es una remera, no un sweater. |
| `KlaraBlouse-MariasVerden.pdf` | Raglán top-down | Varios talles | Caso a clasificar con más detalle al validar medidas. |
| `KeySweater-PetiteKnit.pdf` | Raglán top-down con short rows y colorwork | 10 talles | Caso avanzado; fuera del primer solucionador por colorwork. |
| `SweaterNo33-MFTK.pdf` | Raglán top-down con short rows y líneas de aumento no convencionales | 8 talles | Caso exploratorio: evidencia una variación al recoger mangas. |
| `StepByStepSweater-HandmadeByFlorence.pdf` | Raglán top-down clásico, circular y seamless | 7 talles | **Caso de verdad inicial recomendado.** Medidas terminadas, holgura, gauge y puntos bajo axila declarados con claridad. |

## Observaciones útiles

1. Las muestras de tensión abarcan desde tejido grueso hasta fino. El motor debe recibir **puntos y vueltas** como valores independientes; un único gauge no representa el canesú ni los largos con precisión.
2. Todos los patrones relevados publican medida terminada, rango corporal o ambos. Esa es la interfaz más segura para la diseñadora: seleccionar por medida terminada y holgura, no por la etiqueta S/M/L.
3. La holgura no es global ni constante: el corpus contiene prendas cercanas al cuerpo, holgadas y oversized. Un patrón declara incluso menos holgura en talles grandes que en los chicos. Por ello la holgura debe poder ser una regla por talle y por medida.
4. El raglán común agrega puntos a cuerpo y mangas simultáneamente. Los patrones más complejos usan short rows, cambios de frecuencia o detalles que modifican esa geometría. El MVP debe detectar cuándo sus restricciones no alcanzan, en vez de emitir una propuesta aparentemente válida.

## Cruce con `EJEMPLO SIZING GRADING TABLA FINAL SOFI.xlsx`

La planilla aporta una **tabla corporal** y una conversión inicial de centímetros a puntos/vueltas para 12 talles. Es una buena fuente configurable, pero no puede ser la única fuente de la prenda:

- La tabla de Sofi usa una holgura de referencia y proporciones por medida; los patrones reales definen holguras y rangos propios.
- Los siete patrones usan rangos de talles, saltos y etiquetas diferentes. El motor debe mapear por medidas, nunca emparejar una columna "M" de dos fuentes por nombre.
- La planilla debe entrar al cálculo como una tabla corporal versionada. La plantilla de construcción y las decisiones de diseño deben quedar separadas de ella.

## Caso de verdad 01: Step By Step Sweater

Se elige como primer caso porque es un sweater top-down de raglán convencional, seamless y de punto liso, con siete talles, holgura positiva explícita, gauge de puntos y vueltas, y puntos bajo axila especificados por talle. La primera verificación no será recrear su texto: será comprobar que, dados sus objetivos de prenda, gauge y restricciones estructurales, el solucionador produce conteos coherentes para cada talle y declara los redondeos o desvíos.

### Resultado de la primera verificación

Los siete talles sin modelado de cuello reproducen exactamente los conteos publicados de canesú y cuerpo. El talle A queda como prueba automatizada representativa, sin reproducir las instrucciones del patrón.

Al convertir los puntos de cuerpo con la muestra declarada, el talle A coincide con su contorno publicado y los otros seis resultan 2,5 cm mayores. Esto es compatible con que el patrón presenta esas medidas como aproximadas, pero demuestra que el producto debe diferenciar una medida nominal publicada de la medida calculada a partir de puntos y tensión.

La opción con vueltas cortas llega a los mismos conteos finales, pero distribuye parte de los aumentos en filas parciales. El modelo actual puede verificar sus conteos, pero no debe afirmar todavía que reproduce su geometría o profundidad local de cuello.

## Caso de verdad 02: Cumulus Blouse O-neck

El patrón forma primero el escote trabajando en plano, agrega puntos de escote al unir en redondo y continúa con eventos conjuntos. En los talles XL a 5XL detiene el crecimiento de mangas y agrega una fase solo-cuerpo. El talle XL confirma exactamente los conteos de canesú, cuerpo y manga del nuevo calculador compuesto.

Este caso no habilita todavía un solucionador compuesto: demuestra el cálculo de una secuencia conocida. Proponer automáticamente las fases requerirá modelar su orden, frecuencia y filas consumidas.

## Caso exploratorio 03: Sweater No. 33

Este patrón vuelve a usar eventos conjuntos seguidos por eventos solo-cuerpo en talles mayores, pero conserva líneas raglán anchas como parte visible de la prenda. Al comenzar cada manga crea además dos puntos de ajuste aparte de los puntos levantados bajo axila.

El grupo bajo axila sigue siendo el mismo tramo físico compartido, pero los puntos extra alteran el inicio de la manga. Con una única evidencia donde permanecen después de la preparación, esta variación no se incorpora todavía a la interfaz general del modelo.
