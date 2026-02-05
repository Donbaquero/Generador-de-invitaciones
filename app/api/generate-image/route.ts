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
    
    // Crear texto usando formas geométricas simples (sin fuentes)
    // Esto evita completamente el problema de fontconfig
    const nameChars = name.toUpperCase()
    let svgContent = '<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">'
    
    // Agregar cada carácter como un rectángulo con texto (fallback simple)
    const charWidth = 40
    const startX = 400 - (nameChars.length * charWidth) / 2
    
    for (let i = 0; i < nameChars.length; i++) {
      const x = startX + (i * charWidth)
      svgContent += `
        <g>
          <rect x="${x}" y="280" width="${charWidth - 5}" height="40" fill="white" stroke="black" stroke-width="1"/>
          <text x="${x + charWidth/2}" y="305" 
                text-anchor="middle" 
                font-size="24" 
                fill="black">${nameChars[i]}</text>
        </g>
      `
    }
    
    svgContent += '</svg>'
    
    // Procesar directamente con Sharp
    const imageBuffer = await sharp(imagePath)
      .composite([{
        input: Buffer.from(svgContent),
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
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('Name received:', name)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
