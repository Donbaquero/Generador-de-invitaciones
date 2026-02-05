import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
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

    // Leer la imagen base y convertirla a base64
    const imagePath = path.join(process.cwd(), 'WhatsApp Image 2026-02-05 at 7.19.06 AM.jpeg')
    const imageBuffer = await fs.readFile(imagePath)
    const base64Image = imageBuffer.toString('base64')
    
    // Crear un HTML con CSS para generar la imagen con texto
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #000;
          }
          .container {
            position: relative;
            width: 100%;
            max-width: 800px;
            height: auto;
            max-height: 600px;
          }
          .background {
            width: 100%;
            height: auto;
            object-fit: contain;
          }
          .text-overlay {
            position: absolute;
            top: 65%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: transparent;
            color: white;
            padding: 0;
            border-radius: 0;
            font-size: 36px;
            font-style: italic;
            text-align: center;
            font-family: Arial, sans-serif;
            border: none;
            box-shadow: none;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="data:image/jpeg;base64,${base64Image}" class="background" alt="Background">
          <div class="text-overlay">${name}</div>
        </div>
      </body>
      </html>
    `
    
    // Retornar HTML que el cliente puede procesar
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
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
