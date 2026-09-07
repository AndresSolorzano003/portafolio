# Andrés Solórzano · Portafolio

Portafolio personal construido con React, Vite, Tailwind CSS, Framer Motion y GSAP (ScrollTrigger). El scroll es el hilo conductor: los elementos se ensamblan al entrar en pantalla y se desarman al salir.

## Editar contenido

Todo el texto editable (perfil, redes, proyectos, habilidades, estadísticas) vive en un solo archivo:

```
src/data/portfolio.js
```

Reemplaza ahí los proyectos placeholder por los reales (título, descripción, tags, link) y las fotos que necesites en `src/assets/`.

## Comandos

```bash
npm install     # instalar dependencias
npm run dev     # servidor de desarrollo
npm run build   # build de producción (carpeta dist/)
npm run preview # previsualizar el build
npm run lint    # oxlint
```

## Stack

- React 19 + Vite
- Tailwind CSS v4
- Framer Motion (gestos, tilt 3D, transiciones)
- GSAP + ScrollTrigger (coreografía de scroll: armado/desarmado, parallax, barras de progreso)
