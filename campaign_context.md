# Contexto y Estado de la Campaña: CL_Search_FelipeServicios
*Fecha de última actualización: 11 de julio de 2026*

Este archivo sirve como base de conocimiento para la IA y para ti, registrando la estructura actual de la campaña, su configuración de anuncios y palabras clave, junto con el análisis de diagnóstico y optimizaciones pendientes.

---

## 1. Estructura de la Campaña

* **Nombre de la campaña:** `CL_Search_FelipeServicios`
* **Tipo de campaña:** Búsqueda (Search)
* **Presupuesto diario:** $5.000 CLP / día
* **Estrategia de puja:** Maximizar conversiones

### Grupo de Anuncios 1: `Apps Moviles`
* **Enfoque:** Captar clientes interesados en el desarrollo de aplicaciones móviles híbridas y nativas en Chile.
* **Palabras clave (Frase / Exacta):**
  * `"desarrollo de aplicaciones moviles chile"`
  * `"crear aplicacion movil chile"`
  * `"desarrollador react native chile"`
  * `"cotizar app movil"`
  * `[desarrollo de apps chile]`
* **Anuncio configurado:**
  * **Títulos (5/15):**
    1. *Apps Móviles Profesionales*
    2. *Desarrollador Freelance*
    3. *Cotiza tu App Móvil*
    4. *Desarrollo de Aplicaciones*
    5. *De la Idea a la Pantalla*
  * **Descripciones (2/4):**
    1. *Desarrollo de aplicaciones móviles de alto rendimiento. Lleva tu negocio a celulares.*
    2. *Trato directo, sin intermediarios. Código rápido, limpio y escalable.*

### Grupo de Anuncios 2: `Desarrollo Web`
* **Enfoque:** Captar clientes interesados en páginas web autoadministrables, veloces y desarrollo de software a medida.
* **Palabras clave (Frase / Exacta):**
  * `"desarrollo web a medida"`
  * `"programador web freelance"`
  * `"paginas web a medida chile"`
  * `"desarrollo e-commerce chile"`
  * `[programador freelance chile]`
* **Anuncio configurado:**
  * **Títulos (5/15):**
    1. *Desarrollo Web a Medida*
    2. *Programador Web Freelance*
    3. *E-commerce y Tiendas*
    4. *Sitios Web Rápidos y SEO*
    5. *Sistemas Web Modernos*
  * **Descripciones (2/4):**
    1. *Sitios web autoadministrables y veloces. Incrementa las ventas de tu negocio.*
    2. *Desarrollo profesional con base de datos. Código optimizado y amigable con Google.*

---

## 2. Diagnóstico de la Campaña & Plan de Acción

Analizando las alertas de la consola de Google Ads en tu captura de pantalla, tenemos tres áreas clave a optimizar:

### ⚠️ Alerta 1: "La configuración del seguimiento de conversiones está incompleta"
* **Por qué ocurre:** Google Ads sabe que tu objetivo es "Maximizar conversiones", pero aún no ha detectado ninguna conversión real registrada en el tag.
* **Estado actual:** Instalamos la etiqueta global de Google (`AW-17500708468`) en tu web en Next.js. El tag ya está en producción en `felipesalazar.cl`.
* **Acción:** Esta alerta desaparecerá automáticamente una vez que la web empiece a recibir clics desde Google Ads y se registren las primeras visitas. No requiere cambios de código adicionales.

### ⚠️ Alerta 2: "La eficacia del anuncio es baja"
* **Por qué ocurre:** Subimos el anuncio con **5 títulos** y **2 descripciones**. Google prefiere que completes la mayor variedad posible (hasta 15 títulos y 4 descripciones) para que su algoritmo de Machine Learning pueda alternar los textos y encontrar la mejor combinación.
* **Acción para subir a "Eficacia Excelente":** Agregar más variantes de texto al anuncio en cada grupo.
  * *Recomendación para Apps Móviles:* Agregar títulos como *"Apps para iOS y Android"*, *"Código Limpio y Rápido"*, *"Lleva tu Negocio al Celular"*, *"Cotización Gratis Hoy"*.
  * *Recomendación para Desarrollo Web:* Agregar títulos como *"Sitios Web Autoadministrables"*, *"Programador Web en Chile"*, *"Optimización de Velocidad"*, *"Soporte Técnico Continuo"*.

### ⚠️ Alerta 3: "Faltan suficientes palabras clave relevantes"
* **Por qué ocurre:** Google siempre sugiere agregar más palabras clave (especialmente en concordancia amplia) para aumentar el volumen de búsquedas y el gasto.
* **Acción:** **Ignorar temporalmente.** Para un presupuesto inicial acotado ($5.000 CLP/día), tener 12 palabras clave de frase/exactas súper específicas es mucho más rentable que tener 50 palabras clave amplias que desperdiciarían tu presupuesto en búsquedas irrelevantes. Mantén estas 12 palabras clave controladas y optimizadas.
