# Investigación inicial: tallaje y graduación para prendas de punto

**Propósito.** Esta nota sintetiza los dos libros aportados como fuentes primarias para orientar un producto web que, desde un patrón base, proponga un rango de talles. Ambos textos estudian la indumentaria en general; no aportan una receta completa de construcción de punto. Por eso separo explícitamente lo que está respaldado por estas fuentes de lo que queda por investigar con bibliografía específica de tejido.

## Alcance y vocabulario

- Un sistema de tallaje no es solamente etiquetas S/M/L: el texto distingue *control measurements* (medidas corporales que definen/asignan un talle), medidas secundarias/terciarias para completar la forma, *size roll/system* (conjunto de talles), *size scale*, intervalo/paso/grade y rango. [Anthropometry, Apparel Sizing and Design (Woodhead -- Deepti Gupta; Norsaadah Zakaria; Textile Institute -- Woodhead Publishing series in textiles, -- 9780857096814 -- 4d6e06181a5a4f32ffbf6587a6c586a8 -- Anna’s Archive.pdf, PDF p. 213; p. impresa 188]
- *Grading* es producir patrones de un rango de talles aplicando aumentos o disminuciones en puntos específicos del patrón base. Idealmente, las especificaciones de talles proceden de datos antropométricos y los aumentos de las medidas de cada talle; si esa cadena está mal conectada, la prenda puede no corresponder a su tabla ni ajustar a quien sí coincide con ella. [Sizing in Clothing_ Developing Effective Sizing Systems for -- Susan P Ashdown; Textile Institute (Manchester, England) -- Woodhead Publishing in -- 9780849390982 -- 558a951039c98de6f5bff37ea9bfc55b -- Anna’s Archive.pdf, PDF p. 175; p. impresa 152]
- Para el producto, conviene nombrar cuatro capas distintas: **cuerpo por talle → holgura (ease) → medidas finales de la prenda → puntos/vueltas según muestra**. La primera y tercera son dimensiones en cm; la última es la traducción propia del tejido. Esta separación es una implicación de las fuentes, no una fórmula textual de los libros. [Anthropometry…, PDF pp. 205–206; pp. impresas 180–181]

## Principios que el algoritmo debe respetar

- No escalar proporcionalmente todo desde el talle de la diseñadora. La fuente advierte contra asumir incrementos constantes por punto, que todos los largos crecen con los contornos, diferencias constantes entre contornos, incrementos lineales o altura de busto fija. Las reglas han de relacionarse con datos de la población objetivo y *landmarks* corporales que correspondan a los puntos del patrón. [Anthropometry…, PDF pp. 83–84; pp. impresas 58–59]
- Un sistema de una única medida que escala el resto equivale a “design for the mean”: presupone proporciones constantes y el texto reporta ajuste satisfactorio para solo 20 % del grupo objetivo en ese enfoque. [Anthropometry…, PDF p. 80; p. impresa 55]
- Elegir controles por tipología de prenda: un torso de ajuste importante puede requerir pecho, cadera y largo natural de cintura; un inferior, cintura, cadera y altura de tiro. También cabe un enfoque híbrido, por ejemplo pecho + estatura. [Anthropometry…, PDF pp. 194–195, 203; pp. impresas 169–170, 178]
- La regresión múltiple es una opción para derivar otras medidas a partir de controles: el libro ilustra `Y = a·estatura + b·cadera + c·pecho + k`. Sus coeficientes describen cuánto debe cambiar cada medida cuando cambian los controles. [Anthropometry…, PDF pp. 205–206; pp. impresas 180–181]
- Los intervalos entre talles no son universales: deben superar el error de medición y considerar variación de fabricación, estiramiento/encogimiento y tolerancia admisible; intervalos demasiado estrechos pueden no mejorar el ajuste de forma rentable. La fuente reconoce intervalos uniformes y variables. [Anthropometry…, PDF pp. 204–205, 213–214; pp. impresas 179–180, 188–189]

## Holgura, elasticidad y muestra de tejido

- *Ease* es la diferencia intencional entre medida corporal y medida de la prenda. Incluye holgura de uso (movimiento) y de diseño (silueta/estilo); ambas dependen de material, estilo, función y preferencia. [Sizing in Clothing…, PDF p. 289; p. impresa 266]
- El punto es directamente relevante: el texto identifica los tejidos de punto (por ejemplo rib y jersey) como materiales elásticos. El estiramiento puede simplificar el ajuste, pero no garantiza que la prenda ajuste bien; hay mucha variación de elongación y recuperación. Patrones para material elástico suelen ser menores que el cuerpo y usan *negative ease*, y lavado/uso pueden modificar tamaño. [Sizing in Clothing…, PDF pp. 291–292; pp. impresas 268–269]
- La evidencia revisada describe que el desarrollo de patrones de punto y reglas de graduación ha empleado prueba y error, con muestras ajustadas en formas y modelos vivos. Informa además que cambiar el material objetivo puede exigir un conjunto nuevo de patrones, porque las propiedades del material determinan la forma del patrón. [Sizing in Clothing…, PDF pp. 292–293; pp. impresas 269–270]
- Por tanto, **la tensión de la muestra no debe ser el único input material**: es el conversor geométrico esencial (`puntos = cm × puntos/cm`, `vueltas = cm × vueltas/cm`), pero el producto debe registrar por separado elasticidad/recuperación, caída, grosor y el bloqueo/lavado de referencia. La necesidad de tratar propiedades materiales además de dimensiones está sustentada por las fuentes; la forma de esos campos y ecuaciones es una propuesta de producto que habrá que validar. [Sizing in Clothing…, PDF pp. 292–295; pp. impresas 269–272]
- Propiedades mecánicas —formabilidad, tracción/elongación, cizalla, flexión y espesor— influyen en confección, apariencia, caída, holgura y dimensiones del patrón. [Sizing in Clothing…, PDF pp. 293–295; pp. impresas 270–272]

## Cómo representar la graduación

- El patrón base debe quedar probado antes de graduar: se selecciona una modelo/forma representativa, se comprueba que costuras y marcas coincidan y que ajuste en áreas críticas; los errores del base se reproducen y pueden amplificarse en todo el rango. [Sizing in Clothing…, PDF p. 181; p. impresa 158]
- Un sistema computable debe tener punto cero por pieza y puntos cardinales a los cuales asignar cambios. En sistemas CAD, cada regla de graduación es el desplazamiento horizontal/vertical (`x`, `y`) aplicado en cada punto. [Sizing in Clothing…, PDF pp. 181, 187–189; pp. impresas 158, 164–166]
- Las curvas requieren tratamiento especial: mover solo los extremos puede distorsionarlas; pueden requerirse puntos intermedios con reglas propias. [Sizing in Clothing…, PDF p. 190; p. impresa 167]
- Una graduación 2D simplificada solo sigue altura y contorno; una compleja/3D incorpora variaciones de volumen y supresión. La elección depende del número de talles, estilo, cercanía al cuerpo, tejido y criterio experto. La fuente limita la aplicación segura de 2D a prendas muy holgadas y rangos muy cortos; no debe interpretarse como límite universal para tejido, sino como alerta de riesgo. [Sizing in Clothing…, PDF pp. 184–186; pp. impresas 161–163]
- La práctica de usar el mismo incremento para busto, cintura y cadera, o reglas iguales delante/detrás, no está respaldada necesariamente por datos antropométricos. En el estudio expuesto, cintura y cadera no crecían a la misma tasa que busto, y varias convenciones de *grade breaks* resultaron artificiales. [Sizing in Clothing…, PDF pp. 203–205; pp. impresas 180–182]
- Visualmente, un conjunto de patrones “anidados” con puntos espaciados por igual y líneas paralelas puede parecer correcto, pero esa prueba privilegia conservar la forma del talle base y no demuestra ajuste equivalente en cuerpos con proporciones cambiantes. [Sizing in Clothing…, PDF pp. 213–216; pp. impresas 190–193]

## Implicaciones concretas para un MVP fiable

1. Crear una ficha versionada por diseño: tipo de prenda, construcción, talle base, medidas finales del base, puntos de control, holgura intencional y restricciones de construcción (repartos, aumentos/disminuciones, largo de sisa/manga, etc.).
2. Modelar una **tabla de cuerpo objetivo** editable antes de generar la tabla de prenda. Inicialmente puede provenir de una tabla que la diseñadora elija; no presentarla como una verdad antropométrica universal.
3. Definir holgura por medida y por talle, no un único porcentaje global. Ofrecer valores sugeridos diferenciando tejido/estilo, pero mantener la decisión de la diseñadora.
4. Pedir una muestra lavada/bloqueada con puntos y vueltas por 10 cm; calcular con precisión interna y posponer el redondeo a puntos/vueltas hasta aplicar restricciones de construcción. Guardar la tensión, aguja, hilo y método de lavado como datos reproducibles.
5. Hacer que las reglas sean por medida/punto y por transición de talle, no solo “escalar todo X %”. Admitir reglas no lineales y excepciones frente/espalda.
6. Emitir una tabla auditable: cuerpo → ease → cm de prenda → puntos/vueltas no redondeados → redondeo y su desviación en cm. Señalar cuando el redondeo o una restricción constructiva exceda una tolerancia configurada.
7. Validar físicamente, como mínimo, el talle base y extremos. Las fuentes recomiendan probar prototipos representativos del rango y registrar ajustes; una referencia propone como orientación que ajuste bien al 80 % o más de la muestra, pero no existe un umbral universal porque depende del uso. [Anthropometry…, PDF pp. 216, 218, 220; pp. impresas 191, 193, 195]

## Métricas y controles de calidad

- Para evaluar un sistema completo, la literatura usa cobertura de población, *aggregate loss* (distancia entre dimensiones del cuerpo y talle asignado) y número total de talles. La cobertura típica citada de 65–80 % depende de población y muestra; no es una garantía comercial o clínica. [Anthropometry…, PDF pp. 51–54; pp. impresas 26–29]
- Por prenda/talle, controlar al menos: coherencia de medidas finales con la tabla, *ease* resultante, desviación por redondeo, igualdad de longitudes en costuras que se unen y, al probar, facilidad de movimiento, tensión, deslizamiento y arrugas. [Sizing in Clothing…, PDF pp. 214–215, 295; pp. impresas 191–192, 272]

## Preguntas abiertas antes de prometer automatización

1. ¿Qué categorías se abordarán primero: sweater raglán, jersey de hombro caído, cárdigan, top sin mangas, prendas infantiles? Cada una cambia las medidas de control y las restricciones de construcción.
2. ¿La salida es una recomendación editable en cm/puntos/vueltas o instrucciones publicables completas? Lo primero es un MVP más verificable.
3. ¿Qué tablas corporales y población objetivo elegirá cada diseñadora? Los libros desaconsejan presentarlas como universales.
4. ¿Cómo se medirá y normalizará la muestra: antes/después de bloqueo, en reposo y bajo una carga definida, y después de uso/lavado? Este punto necesita fuentes específicas de tejido de punto.
5. ¿Qué nivel de ajuste tendrá cada diseño (ceñido, estándar, holgado) y qué holgura negativa/positiva corresponde a cada estructura de tejido? Requiere evidencia específica y pruebas con tejedoras.
6. ¿Cómo se validarán aumentos, disminuciones y repartos para que la matemática sea construible y conserve el lenguaje de diseño de cada autora?

## Límites de la evidencia usada

Los dos libros son fuentes primarias aportadas y son sólidos para principios de sizing/grading y relación material–fit, pero no son manuales de escalado de patrones tejidos a mano. En particular, no proporcionan una fórmula validada que convierta una muestra de punto en reglas de graduación para todos los diseños. La siguiente investigación debería cubrir fuentes técnicas específicas de patronaje de tejido, tensión/elastidad, bloqueo y construcciones de prendas.
