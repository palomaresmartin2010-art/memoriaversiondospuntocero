# Imágenes del portal

Guarda aquí las imágenes que se publicarán con el sitio.

## Uso desde React

Los archivos dentro de `public/images` se referencian desde la raíz:

```tsx
<ImagePlaceholder
  label="Equipo de estudiantes"
  src="/images/equipo-estudiantes.jpg"
/>
```

Si la ruta no existe o la imagen no carga, el componente vuelve a mostrar el placeholder automáticamente.

## Organización sugerida

```text
public/images/
├── inicio/
├── proyecto/
├── objetos/
├── salidas/
├── fechas/
├── visitas/
├── reconocimientos/
├── aliados/
├── galeria/
└── equipo/
```

Usa nombres de archivo en minúsculas, sin espacios y con guiones, por ejemplo:

```text
public/images/salidas/museo-nacional-01.webp
```
