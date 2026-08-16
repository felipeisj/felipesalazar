---
name: web-demo-palettes
description: Referencia de paletas de colores y estilos visuales seleccionados por los usuarios en la waitlist para la creación automatizada de demos web.
---

# Paletas de Colores de Demos Web (Canva-Style)

Esta skill proporciona las definiciones de color y estilos visuales que los usuarios eligen al solicitar una demostración web en el sitio felipe-servicios. Utiliza esta guía para configurar la interfaz de cualquier demo web que construyas, asegurando que se adapte exactamente a la paleta seleccionada.

---

## Paletas Disponibles

### 1. Tech Cool (Azul Tecnológico)
* **ID:** `tech-cool`
* **Enfoque:** Software, tecnología, SaaS y servicios profesionales corporativos.
* **Colores:**
  - **Primario / Fondo Oscuro:** `#0F172A` (Slate 900)
  - **Acento Principal:** `#2563EB` (Blue 600)
  - **Acento Secundario:** `#38BDF8` (Sky 400)
  - **Fondo Claro / Texto Claro:** `#F8FAFC` (Slate 50)
* **CSS Custom Properties:**
  ```css
  --color-primary: #0f172a;
  --color-accent: #2563eb;
  --color-accent-soft: #38bdf8;
  --color-bg-light: #f8fafc;
  ```

### 2. Dark Luxury (Oscuro Premium)
* **ID:** `dark-luxury`
* **Enfoque:** Elegante, sofisticado y exclusivo. Ideal para restaurantes de alta gama, marcas premium y portafolios de lujo.
* **Colores:**
  - **Primario / Fondo Oscuro:** `#18181B` (Zinc 900)
  - **Acento Principal:** `#D97706` (Amber 600)
  - **Acento Secundario:** `#F59E0B` (Amber 500)
  - **Fondo Claro / Texto Claro:** `#FAFAFA` (Zinc 50)
* **CSS Custom Properties:**
  ```css
  --color-primary: #18181b;
  --color-accent: #d97706;
  --color-accent-soft: #f59e0b;
  --color-bg-light: #fafafa;
  ```

### 3. Minimalist Earth (Tonos Tierra)
* **ID:** `minimal-earth`
* **Enfoque:** Cálido, orgánico y natural. Recomendado para estudios de yoga, decoración de interiores, artesanías y bienestar.
* **Colores:**
  - **Fondo Principal Claro:** `#FAF9F6` (Arena / Alabastro)
  - **Acento Oscuro / Texto:** `#854D0E` (Marrón Tierra 800)
  - **Acento Secundario:** `#606F49` (Verde Musgo / Sage 700)
  - **Líneas / Bordes:** `#E4E1D8` (Gris Cálido)
* **CSS Custom Properties:**
  ```css
  --color-bg-light: #faf9f6;
  --color-accent: #854d0e;
  --color-accent-soft: #606f49;
  --color-border: #e4e1d8;
  ```

### 4. Vibrant Creative (Energía Creativa)
* **ID:** `vibrant-creative`
* **Enfoque:** Llamativo, alegre y contemporáneo. Excelente para agencias creativas, tiendas de ropa juvenil, calzado y marcas de diseño.
* **Colores:**
  - **Primario / Acento:** `#4F46E5` (Indigo 600)
  - **Acento Secundario:** `#EC4899` (Fucsia / Rosa 500)
  - **Destacados:** `#F59E0B` (Amarillo Mango 500)
  - **Fondo Claro:** `#F3F4F6` (Gris Claro 100)
* **CSS Custom Properties:**
  ```css
  --color-primary: #4f46e5;
  --color-accent: #ec4899;
  --color-accent-soft: #f59e0b;
  --color-bg-light: #f3f4f6;
  ```

### 5. Fresh Mint (Eco Verde)
* **ID:** `fresh-mint`
* **Enfoque:** Saludable, ecológico, natural y sustentable. Recomendado para tiendas orgánicas, dietéticas y marcas sustentables.
* **Colores:**
  - **Primario / Fondo Oscuro:** `#064E3B` (Esmeralda 900)
  - **Acento Principal:** `#10B981` (Esmeralda 500)
  - **Acento Secundario:** `#A7F3D0` (Menta / Esmeralda 200)
  - **Fondo Claro:** `#ECFDF5` (Esmeralda 50)
* **CSS Custom Properties:**
  ```css
  --color-primary: #064e3b;
  --color-accent: #10b981;
  --color-accent-soft: #a7f3d0;
  --color-bg-light: #ecfdf5;
  ```

---

## Instrucciones para el Agente

Cuando se te solicite crear una demo web en base a una solicitud de la waitlist:
1. Identifica el campo `selectedColorPalette` (o `Paleta de Colores Elegida`) de la solicitud.
2. Aplica la paleta correspondiente mapeando los colores del listado a los tokens de diseño o variables CSS de la nueva demo web.
3. Asegura que la estética general (bordes redondeados, tipografía, sombras) se alinee con el enfoque de la paleta.
