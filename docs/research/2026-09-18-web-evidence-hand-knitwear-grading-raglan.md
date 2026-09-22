# Evidencia web: graduación de patrones de tejido a mano y raglán top-down

**Pregunta.** ¿Qué información fiable existe sobre *grading* (graduación/tallaje) de sweaters tejidos a mano, especialmente raglan top-down, que pueda orientar el MVP?

**Método.** Consulta web de estándares del sector, investigación revisada por pares y documentación técnica publicada por organizaciones/diseñadoras responsables de sus propios patrones. Se excluyeron blogs SEO, agregadores y foros como evidencia. Consultado el **2026-09-18**. Esta nota complementa, no sustituye, [la investigación basada en los libros del proyecto](2026-09-18-knitwear-sizing-and-grading-sources.md).

## Conclusión breve

Sí, existe una base sólida para un MVP, pero no una ecuación universal que convierta un talle base en todos los demás. La evidencia converge en un flujo: **medidas corporales explícitas → holgura intencional → medidas terminadas por talle → conversión con muestra bloqueada/lavada → reglas de construcción → muestra física y validación**. Para un raglán top-down tradicional, el algoritmo debe evitar que el crecimiento de contorno corporal obligue a profundizar proporcionalmente el canesú y ensanche demasiado las mangas; por ello los parámetros de cuerpo, manga y profundidad de sisa deben poder variar de forma independiente.

## Evidencia directa: estándares e investigación

### 1. El talle corporal, la medida terminada y la holgura son capas distintas

El [Craft Yarn Council (CYC)](https://www.craftyarncouncil.com/standards/body-sizing) publica tablas de **medidas corporales** para tejido y crochet, e indica que las instrucciones suelen publicar medidas de la prenda terminada y un esquema con pecho/busto, escote, largo de espalda, manga, etc. También define el tallaje de sweater como pecho/busto corporal más holgura positiva o negativa. Es una fuente sectorial útil para valores iniciales y vocabulario, no una tabla antropométrica universal para presentar como verdad del producto.

El mismo estándar propone, como guías de silueta, aproximadamente 5–10 cm de holgura negativa para muy ajustado, 0 cm para ceñido, 5–10 cm positiva para clásico, 10–15 cm para holgado y más de 15 cm para oversized. Señala expresamente que son guías y que cambiar largos puede alterar la apariencia del diseño. Esto respalda modelar la holgura como una decisión de diseño, no inferirla automáticamente desde la etiqueta del talle.

### 2. La graduación proporcional uniforme no está respaldada por la antropometría

El estudio revisado por pares de [Schofield y LaBat (2005), *Clothing and Textiles Research Journal*](https://doi.org/10.1177/0887302X0502300301) examinó reglas de graduación de 17 fuentes y contrastó siete supuestos con medidas de torso superior de la encuesta antropométrica de mujeres del ejército estadounidense. Ninguno de los siete supuestos fue respaldado; según sus autores, aplicarlos genera prendas cuyos tamaños y proporciones no reflejan los cuerpos.

La conclusión no valida una tabla concreta para tejedoras —población, época y prenda son distintos—, pero sí invalida una premisa tentadora del producto: “multiplicar todas las medidas del talle base por el mismo factor” o aplicar siempre el mismo salto a todas ellas. La tabla de cuerpo y las reglas de cada medida han de ser configurables y versionadas.

### 3. La muestra debe representar la prenda terminada; puntos y vueltas importan de modos distintos

La lección original de [The Knitting Guild Association (TKGA), *Top-Down Raglan Pullover*](https://tkga.org/wp-content/uploads/issue_archives/2010/Top-Down%20Raglan%20Pullover%20Lesson.pdf) indica bloquear/lavar la muestra como se cuidará la prenda final. Afirma que la tensión de puntos es la más determinante para la talla terminada, pero que una desviación sustantiva de tensión de vueltas puede requerir otro hilo. En un raglán, las vueltas también determinan la profundidad de sisa y el reparto de aumentos.

Por tanto, el MVP debe pedir y guardar, al menos:

- puntos y vueltas por 10 cm, medidos **después** del mismo tratamiento previsto para la prenda;
- punto/motivo de la muestra, hilado, agujas y protocolo de cuidado;
- medidas objetivo en cm antes de redondear a puntos o vueltas.

La conversión `puntos = cm × (puntos / cm)` y `vueltas = cm × (vueltas / cm)` es geometría, no una regla de graduación. El redondeo y las restricciones del motivo se deben registrar como una desviación visible de los cm objetivo.

### 4. Validar una prenda real continúa siendo necesario

El paper de Jellema, van der Bie, Zhou y Huysmand, [*Virtual Fitting of Personalised Knitwear Based on 3D Anthropometry* (EPDE 2020)](https://www.researchgate.net/publication/344249066_INTERNATIONAL_CONFERENCE_ON_ENGINEERING_AND_PRODUCT_DESIGN_EDUCATION_VIRTUAL_FITTING_OF_PERSONALISED_KNITWEAR_BASED_ON_3D_ANTHROPOMETRY), describe una prueba de sweater personalizado en la que el ajuste virtual se evaluó con la persona de prueba y se comparó después con la prenda realmente tejida. Los autores señalan que medidas, holgura y postura se deben tratar conjuntamente y que el prototipo se evalúa con personas.

Es evidencia de que la salida del algoritmo debe ser una **propuesta trazable**, no una garantía de ajuste. Para el MVP, documentar muestra/feedback del talle base y de ambos extremos es más defendible que afirmar que una tabla generada está “validada”.

## Práctica experta documentada: implicaciones específicas de raglán

Estas fuentes son documentación original de profesionales de patrones, no estudios controlados. Sirven para decisiones de producto y deben marcarse como reglas editables, no como constantes científicas.

### 5. El raglán top-down tradicional acopla medidas que el cuerpo no siempre acopla

En [*Designing Inverleith*](https://ysolda.com/blogs/journal/designing-inverleith), la diseñadora Ysolda Teague explica que en un raglán top-down tradicional la profundidad del canesú, el contorno de cuerpo y el contorno de manga son proporcionales: al necesitar más cuerpo, se profundiza el canesú y las mangas pueden quedar demasiado amplias antes de alcanzar el contorno corporal necesario. Describe emplear *compound raglan shaping* para salir de esa restricción.

**Consecuencia para el motor:** no modelar “número de rondas de aumento” como el único controlador de talle. Separar como objetivos y restricciones:

- contorno de pecho/busto de prenda y reparto delantero/espalda;
- contorno de manga en bíceps y número de puntos bajo la axila;
- profundidad de sisa/canesú y caída/forma de escote;
- reglas de aumento por fase y por sección, con posibilidad de rondas sin aumento, aumentos solo en cuerpo, puntos extra bajo axila o variantes de raglán compuesto.

La lección de [TKGA](https://tkga.org/wp-content/uploads/issue_archives/2010/Top-Down%20Raglan%20Pullover%20Lesson.pdf) confirma la arquitectura básica: marcadores definen los puntos de aumento del raglán y los aumentos junto a ellos construyen el marco del sweater. Pero su ejemplo empieza en plano y usa aumentos en bordes del delantero; por ello sería incorrecto codificar un “+8 puntos por ronda” como ley universal. Depende de si se teje en redondo, del escote, de los bordes y del diseño.

### 6. No todas las medidas deben crecer con el mismo salto

Teague documenta que, en su propia tabla, un rango de 30 pulgadas de busto corresponde a menos de 4 pulgadas de variación de hombro, y enuncia que las medidas no pueden graduarse uniformemente en todo el rango. La misma observación es coherente con el estudio de Schofield y LaBat, aunque no la convierte en una tabla universal.

En [su guía para elegir talle](https://ysolda.com/blogs/journal/choosing-a-size), la diseñadora distingue claramente medida corporal, medida terminada y holgura; recomienda mirar el esquema completo y advierte que el busto completo puede variar mucho entre personas similares en otras medidas. También propone partir de high bust en ciertos casos y aplicar ajustes de busto o combinar conteos entre talles para un sweater más ceñido. Esto respalda que el producto admita medidas secundarias y modificaciones, en vez de prometer que el busto resuelve el talle.

### 7. Un patrón publicado puede ofrecer opciones, no un único cuerpo “promedio”

El patrón/documentación de [Studio Sweater de Ysolda](https://ysolda.com/collections/patterns-with-bust-shaping/products/studio-sweater) es un ejemplo de práctica inclusiva publicable: 12 talles de 70 a 183 cm de busto/pecho, alturas regular/tall y cuatro opciones de forma de busto; además, declara su holgura de referencia. No prueba que ese esquema sea óptimo para todos los diseños, pero demuestra una alternativa concreta al escalado único: una base de talles con ejes de personalización separados.

## Afirmaciones que **no** están verificadas para automatizar todavía

- No hay evidencia localizada de una fórmula universal de aumentos raglán que conserve ajuste y silueta para cualquier hilado, muestra, motivo, nivel de holgura y rango de talles.
- Los rangos de holgura del CYC son guías, no predicciones de confort para cada fibra, estructura, peso, caída o recuperación del tejido.
- No es seguro deducir una talla corporal completa a partir de busto/pecho, altura o talla comercial; las investigaciones de graduación y la práctica de diseño advierten contra esas proporciones fijas.
- “Raglán compuesto” no es una especificación única: el término necesita una representación de reglas de construcción antes de implementarse.
- La tolerancia aceptable de redondeo, por ejemplo en cm al convertir a puntos, requiere pruebas con patrones y diseñadoras; no se encontró un umbral validado para tejido a mano.

## Decisiones recomendadas para el MVP

1. Limitar la primera versión a **jersey raglán top-down, en redondo, manga larga, punto liso o motivo con múltiplo configurable**, y etiquetarla así. Excluir inicialmente cardigan, cuello con geometría compleja y raglán compuesto automático.
2. Crear una plantilla de talles editable que contenga cuerpo y objetivos terminados por separado. Campos mínimos: busto/pecho, alto busto opcional, cintura/cadera opcionales, largo de cuerpo, largo de manga, bíceps, profundidad de sisa, contorno de cuello y holgura por medida.
3. Recibir el talle base como especificación medible —no solo instrucciones— y pedir los objetivos de cada talle; después calcular conteos y un plan de aumentos que conserve los objetivos.
4. Tratar el resultado como un sistema de ecuaciones con restricciones: conteos enteros, simetría, múltiplos de motivo, mínimo de puntos de manga/cuerpo, puntos bajo axila y fases de aumento. Si no existe solución dentro de tolerancia, mostrar el conflicto en vez de inventar una.
5. Mostrar siempre la trazabilidad `cm corporal + holgura → cm terminados → puntos/vueltas teóricos → puntos/vueltas redondeados → cm resultantes`, más la diferencia final.
6. Diseñar el flujo de validación: muestra tratada, prototipo de talle base, prototipos de los extremos, observaciones de ajuste y versionado de las reglas. La evidencia actual permite automatizar la propuesta y auditoría; la validación de fit sigue siendo humana.

## Fuentes y fecha de acceso

1. Craft Yarn Council. “[Standard Body Measurements/Sizing](https://www.craftyarncouncil.com/standards/body-sizing).” Acceso: 2026-09-18.
2. Craft Yarn Council. “[Standards & Guidelines for Knitting and Crochet](https://media.craftyarncouncil.com/sites/default/files/images/standards/CYC_YarnStandards-2018-11-06.pdf).” Acceso: 2026-09-18.
3. The Knitting Guild Association. “[Top-Down Raglan Pullover Lesson](https://tkga.org/wp-content/uploads/issue_archives/2010/Top-Down%20Raglan%20Pullover%20Lesson.pdf).” *Fashion Framework*, 2010. Acceso: 2026-09-18.
4. Schofield, N. A.; LaBat, K. L. “[Defining and Testing the Assumptions Used in Current Apparel Grading Practice](https://doi.org/10.1177/0887302X0502300301).” *Clothing and Textiles Research Journal* 23(3), 2005. Acceso: 2026-09-18.
5. Jellema, A. H.; van der Bie, M.; Zhou, W.; Huysmand, T. “[Virtual Fitting of Personalised Knitwear Based on 3D Anthropometry](https://www.researchgate.net/publication/344249066_INTERNATIONAL_CONFERENCE_ON_ENGINEERING_AND_PRODUCT_DESIGN_EDUCATION_VIRTUAL_FITTING_OF_PERSONALISED_KNITWEAR_BASED_ON_3D_ANTHROPOMETRY).” *Engineering and Product Design Education*, 2020. Acceso: 2026-09-18.
6. Teague, Ysolda. “[Choosing a size](https://ysolda.com/blogs/journal/choosing-a-size).” 2019. Acceso: 2026-09-18.
7. Teague, Ysolda. “[Designing Inverleith](https://ysolda.com/blogs/journal/designing-inverleith).” 2019. Acceso: 2026-09-18.
8. Teague, Ysolda. “[Studio Sweater](https://ysolda.com/collections/patterns-with-bust-shaping/products/studio-sweater).” Acceso: 2026-09-18.
