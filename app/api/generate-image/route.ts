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
            width: 800px;
            height: 600px;
          }
          .background {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .text-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.9);
            color: black;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 48px;
            font-weight: bold;
            text-align: center;
            font-family: Arial, sans-serif;
            border: 3px solid black;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
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
