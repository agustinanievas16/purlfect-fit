# Purlfect Fit

Un proyecto de aprendizaje full-stack para ayudar a diseñadoras de patrones de tejido a proponer un rango de talles de manera trazable.

## El problema

Graduar un patrón tejido a partir de un talle base suele implicar recalcular manualmente puntos, vueltas, aumentos y medidas para cada talle. Escalar todas las partes por igual no funciona: cuerpo, mangas, canesú, holgura y propiedades del tejido cambian de manera distinta.

Purlfect Fit comienza con un caso acotado y verificable: **sweaters raglán clásicos, seamless y top-down**.

## Qué hace hoy

El núcleo actual puede:

- convertir una construcción raglán clásica en conteos y medidas resultantes;
- proponer una combinación de eventos de aumento (`N`) y puntos bajo axila (`U`) que cumpla objetivos de cuerpo, manga y profundidad de canesú;
- rechazar una propuesta cuando no existe una combinación compatible dentro de la tolerancia definida;
- ejecutar pruebas con el runner nativo de Node, sin dependencias externas.

Todavía no es una aplicación web ni genera instrucciones publicables de tejido. El foco actual es validar el modelo de dominio antes de construir interfaz, persistencia o autenticación.

## Modelo inicial

En el raglán clásico, cada evento de aumento conjunto agrega ocho puntos:

```text
4 puntos al cuerpo + 2 puntos a cada manga
```

Al separar las mangas, los puntos bajo axila `U` contribuyen a ambas piezas:

```text
cuerpo: 2 × U
cada manga: U
```

El cálculo devuelve tanto los conteos enteros como sus centímetros resultantes, para hacer visible cualquier desvío respecto del objetivo de diseño.

## Ejecutar el proyecto

Requiere Node.js 22 o superior.

```bash
npm test
npm run demo
```

`npm run demo` ejecuta una propuesta de ejemplo y muestra el resultado como JSON. Podés cambiar los valores de [src/demo.ts](src/demo.ts) para observar cómo interactúan las medidas objetivo, la muestra y las restricciones de construcción.

## Estructura

```text
src/raglan.ts       cálculo y búsqueda del raglán clásico
src/raglan.test.ts  pruebas del núcleo
src/demo.ts         ejemplo ejecutable
docs/               investigación y especificaciones del dominio
CONTEXT.md          glosario del proyecto
```

Los libros, planillas y patrones utilizados para investigar el dominio viven localmente en `data/` y están excluidos de Git por derechos de autor y privacidad.

## Próximos pasos

1. Conectar la tabla corporal y las decisiones de holgura con los objetivos de prenda.
2. Validar el núcleo contra más construcciones raglán reales.
3. Exponer el cálculo en una interfaz web que muestre la traza de decisiones.
4. Incorporar fases de aumento solo-cuerpo y solo-manga cuando la evidencia de patrones lo justifique.

## Investigación

Las decisiones de dominio y las fuentes consultadas están documentadas en:

- [Investigación inicial de tallaje y graduación](docs/research/2026-09-18-knitwear-sizing-and-grading-sources.md)
- [Evidencia web sobre grading de prendas tejidas](docs/research/2026-09-18-web-evidence-hand-knitwear-grading-raglan.md)
- [Especificación del solucionador raglán](docs/specs/raglan-top-down-solver.md)
