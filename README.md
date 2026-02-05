# Generador de Imágenes Personalizadas

Aplicación web simple que permite generar imágenes personalizadas con el nombre del usuario sobre una imagen base.

## Características

- Formulario simple para ingresar el nombre
- Generación automática de imagen con el nombre superpuesto
- Descarga automática de la imagen generada
- Interfaz moderna y responsiva
- Despliegue optimizado para Vercel

## Tecnologías

- Next.js 14 con App Router
- TypeScript
- Canvas API para generación de imágenes
- Tailwind CSS para estilos
- Despliegue en Vercel

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Colocar la imagen base en la raíz del proyecto con el nombre `WhatsApp Image 2026-02-05 at 7.19.06 AM.jpeg`

4. Ejecutar en desarrollo:
   ```bash
   npm run dev
   ```

5. Abrir [http://localhost:3000](http://localhost:3000)

## Despliegue en Vercel

1. Conectar el repositorio a Vercel
2. La aplicación se desplegará automáticamente
3. Asegurarse que la imagen base esté incluida en el despliegue

## Uso

1. Ingresa tu nombre en el formulario
2. Haz clic en "Generar Imagen"
3. La imagen se generará y descargará automáticamente
4. También puedes ver la vista previa y descargarla nuevamente

## Estructura del Proyecto

```
├── app/
│   ├── api/generate-image/
│   │   └── route.ts          # API para generar imágenes
│   ├── globals.css           # Estilos globales
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Página principal
├── WhatsApp Image 2026-02-05 at 7.19.06 AM.jpeg  # Imagen base
├── package.json
├── tsconfig.json
├── next.config.js
└── vercel.json               # Configuración para Vercel
```
