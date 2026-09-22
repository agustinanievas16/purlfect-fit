# Especificación inicial: solucionador de raglán top-down clásico

## Promesa del módulo

El módulo recibe una especificación de prenda y devuelve, para cada talle, una **propuesta de construcción** con conteos enteros, un plan de aumentos y una traza de desvíos. No redacta ni distribuye el texto de un patrón ajeno.

Su interfaz debe ser pequeña: `proponerRaglan(especificación) → propuesta | incompatibilidades`. La implementación oculta la búsqueda de conteos, redondeos y ritmos válidos.

## Alcance de la primera versión

- Sweater seamless, circular, top-down y punto liso.
- Cuatro uniones raglán simétricas.
- Eventos de aumento raglán conjuntos: cada uno agrega ocho puntos, cuatro al cuerpo y dos a cada manga.
- Separación de mangas con el mismo número de puntos bajo axila en ambos lados.
- Cuello y short rows opcionales como configuración; no se resuelven automáticamente todavía.

Fuera de alcance: colorwork, calados o trenzas que impongan múltiplos, pinzas, mangas asimétricas, cardigan y raglán bottom-up.

## Especificación de entrada

### Por diseño

- Muestra bloqueada: puntos/10 cm y vueltas/10 cm.
- Medida de cuello o puntos de montaje, y reparto inicial entre cuerpo/mangas.
- Ritmo permitido de aumentos (por ejemplo, cada dos vueltas) y short rows opcionales.
- Política de puntos bajo axila: valor elegido, rango permitido o "proponer".
- Tolerancia máxima de desviación entre medida terminada objetivo y medida resultante.

### Por talle

- Contorno terminado de cuerpo.
- Contorno terminado de manga/bíceps.
- Profundidad objetivo de canesú.
- Largo de cuerpo y de manga.
- Holgura deseada y medida corporal de referencia, para explicar la elección.

## Invariantes de la propuesta

Sea `N` la cantidad de eventos conjuntos y `U` los puntos bajo **cada** axila. Para una construcción simétrica:

```text
puntos de canesú final =
  puntos de montaje + 8 × N

crecimiento de cuerpo = 4 × N
crecimiento de cada manga = 2 × N

puntos de cuerpo tras separar =
  puntos de cuerpo en canesú + 2 × U

puntos de manga al comenzar =
  puntos de manga retenidos + U

cm resultantes = puntos ÷ (puntos por 10 cm) × 10
profundidad de canesú = vueltas ÷ (vueltas por 10 cm) × 10
```

El resultado debe conservar simetría izquierda/derecha, tener todos los conteos enteros y explicar el error residual en centímetros. Una propuesta no es válida si el ritmo de aumentos excede las vueltas disponibles para la profundidad de canesú.

`U` no representa valores distintos para cuerpo y manga: es el mismo grupo de puntos montado bajo cada axila, visto desde las dos piezas. La política de puntos bajo axila define cómo elegir ese único valor compartido:

- **valor elegido**: la diseñadora fija el número por axila;
- **rango permitido**: el módulo busca un entero dentro de un mínimo/máximo y de los múltiplos requeridos;
- **proponer dentro de restricciones**: el módulo elige el valor y explica por qué, pero sigue respetando mínimo, máximo, simetría y tolerancia de medida.

## Extensión de cálculo: fases independientes

Un raglán compuesto puede sumar eventos solo-cuerpo o solo-manga después de una fase conjunta. El calculador acepta conteos explícitos: `N_c` para eventos conjuntos, `N_b` para eventos solo-cuerpo y `N_s` para eventos solo-manga. Cada evento solo-cuerpo o solo-manga agrega cuatro puntos totales al canesú.

Esta extensión verifica una construcción conocida, pero el solucionador automático todavía busca únicamente eventos conjuntos. Tampoco resuelve aún la formación del escote trabajada en plano ni los puntos nuevos montados al unirlo en redondo.

## Resultado por talle

- Conteos de montaje y reparto inicial.
- Eventos de aumento y vueltas usadas por el canesú.
- Puntos de manga retenidos y puntos bajo axila.
- Conteos y centímetros resultantes de cuerpo, manga y profundidad de canesú.
- Desvío frente a cada objetivo y las decisiones de redondeo.
- Alertas de incompatibilidad, si existen.

## Caso de verdad 01

`StepByStepSweater-HandmadeByFlorence.pdf` se usa como referencia privada. Confirma que este alcance es suficiente para un raglán clásico de siete talles y expone dos reglas de producto que el solucionador debe respetar:

1. las medidas terminadas declaradas pueden ser aproximadas frente a conteos enteros y gauge;
2. el gauge de vueltas afecta la profundidad del canesú aunque el patrón tolere cierto margen.

La futura prueba automatizada verificará relaciones matemáticas e invariantes contra datos extraídos de la referencia privada; no debe almacenar ni publicar instrucciones textuales del patrón.

## Caso de verdad 02

`CumulusBlouseONeck-PetiteKnit.pdf` confirma dos necesidades posteriores: una fase previa de formación de escote trabajada en plano y eventos solo-cuerpo en los talles mayores. El talle XL valida el cálculo compuesto con una fase conjunta seguida por dos eventos solo-cuerpo.

## Caso de verdad 03

`SweaterNo33-MFTK.pdf` confirma fases solo-cuerpo y líneas raglán anchas. También crea puntos adicionales al levantar cada manga; ese detalle queda registrado como una variación todavía no generalizada en el modelo.
