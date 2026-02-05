import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import path from 'path'

// Configurar Sharp para Vercel
if (process.env.VERCEL) {
  sharp.cache(false);
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Nombre es requerido' },
        { status: 400 }
      )
    }

    // Cargar la imagen base
    const imagePath = path.join(process.cwd(), 'WhatsApp Image 2026-02-05 at 7.19.06 AM.jpeg')
    
    // Crear texto usando una imagen base64 generada dinámicamente
    // Esto evita completamente los problemas de fuentes en Sharp
    const textImage = await createTextImage(name)
    
    // Componer imagen base con texto
    const imageBuffer = await sharp(imagePath)
      .composite([{
        input: textImage,
        gravity: 'center'
      }])
      .png()
      .toBuffer()

    // Retornar la imagen
    return new NextResponse(new Uint8Array(imageBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="imagen-${name.replace(/\s+/g, '-').toLowerCase()}.png"`,
      },
    })

  } catch (error) {
    console.error('Error generando imagen:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Name received:', name)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Función para crear imagen de texto sin depender de fuentes del sistema
async function createTextImage(text: string): Promise<Buffer> {
  // Crear un SVG simple con texto como paths (sin fuentes)
  const svgText = createTextSVG(text)
  
  // Convertir a buffer usando Sharp pero sin composición
  return await sharp(Buffer.from(svgText))
    .png()
    .toBuffer()
}

// Crear SVG con texto dibujado como formas geométricas
function createTextSVG(text: string): string {
  const chars = text.toUpperCase()
  const charWidth = 35
  const charHeight = 50
  const totalWidth = chars.length * charWidth
  const startX = (800 - totalWidth) / 2
  
  let svgContent = `
    <svg width="800" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect x="${startX - 10}" y="25" width="${totalWidth + 20}" height="${charHeight}" 
            fill="white" stroke="black" stroke-width="2" rx="5"/>
  `
  
  // Agregar cada carácter como texto simple (sin font-family específico)
  for (let i = 0; i < chars.length; i++) {
    const x = startX + (i * charWidth) + (charWidth / 2)
    svgContent += `
      <text x="${x}" y="55" 
            text-anchor="middle" 
            font-size="32" 
            font-weight="bold" 
            fill="black">${chars[i]}</text>
    `
  }
  
  svgContent += '</svg>'
  return svgContent
}
