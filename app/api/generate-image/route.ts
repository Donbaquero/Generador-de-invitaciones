import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import path from 'path'

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
    
    // Crear SVG para el texto - versión simplificada
    const svgText = Buffer.from(`
      <svg width="800" height="600">
        <text x="550" y="500" 
              font-family="sans-serif" 
              font-size="60" 
              font-weight="bold" 
              text-anchor="middle" 
              fill="white">${name}</text>
      </svg>
    `, 'utf8')

    // Combinar imagen base con texto usando Sharp
    const imageBuffer = await sharp(imagePath)
      .composite([{
        input: svgText,
        top: 0,
        left: 0
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
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('Name received:', name)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
