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

    // Leer la imagen base
    const imagePath = path.join(process.cwd(), 'WhatsApp Image 2026-02-05 at 7.19.06 AM.jpeg')
    const imageBuffer = await fs.readFile(imagePath)
    
    // Crear un HTML simple que muestre la imagen con texto
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #000000ff;
            font-family: Georgia, serif;
          .invitation-container {
            position: relative;
            max-width: 800px;
            width: 100%;
          }
          .background-image {
            width: 100%;
            height: auto;
            display: block;
          }
          .name-overlay {
            position: absolute;
            bottom: 55%;
            left: 50%;
            transform: translateX(-50%);
            background: transparent;
            color: white;
            padding: 5px 40px;
            font-size: 36px;
            font-style: italic;
            text-align: center;
            text-shadow: none;
            white-space: nowrap;
          }
          .instructions {
            margin-top: 20px;
            text-align: center;
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #ddd;
          }
          .download-btn {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px;
          }
          .download-btn:hover {
            background: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="invitation-container">
          <img src="data:image/jpeg;base64,${imageBuffer.toString('base64')}" class="background-image" alt="Invitación">
          <div class="name-overlay">${name}</div>
        </div>
        <div class="instructions">
          <h3>¡Tu invitación está lista!</h3>
          <p>Para guardar la imagen:</p>
          <button class="download-btn" onclick="downloadImage()">Descargar Imagen</button>
        </div>
        
        <script>
          function downloadImage() {
            const container = document.querySelector('.invitation-container');
            html2canvas(container).then(canvas => {
              const link = document.createElement('a');
              link.download = 'invitacion-${name}.png';
              link.href = canvas.toDataURL();
              link.click();
            }).catch(() => {
              alert('Si no puedes descargar, haz clic derecho en la imagen y selecciona "Guardar imagen como..."');
            });
          }
        </script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
      </body>
      </html>
    `
    
    // Retornar HTML
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })

  } catch (error) {
    console.error('Error generando imagen:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
