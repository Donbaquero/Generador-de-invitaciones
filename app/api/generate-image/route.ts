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
    
    // Crear SVG simple con fuente sans-serif
    const svgText = `
      <svg width="800" height="600">
        <text x="400" y="300" 
              font-family="sans-serif"
              font-size="48" 
              font-weight="bold" 
              text-anchor="middle" 
              dominant-baseline="middle"
              fill="white">${name}</text>
      </svg>
    `

    // Usar Sharp con configuración minimal
    const imageBuffer = await sharp(imagePath, {
      failOnError: false
    })
    .composite([{
      input: Buffer.from(svgText),
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
