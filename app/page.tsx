'use client'

import { useState } from 'react'

export default function Home() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const generateImage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      alert('Por favor ingresa tu nombre')
      return
    }

    setLoading(true)
    setImageUrl(null)

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error('Error al generar la imagen')
      }

      const contentType = response.headers.get('content-type')
      
      if (contentType?.includes('text/html')) {
        // Si es HTML, crear una ventana para que el usuario guarde
        const htmlContent = await response.text()
        
        // Crear una nueva ventana con el HTML
        const newWindow = window.open('', '_blank', 'width=800,height=600')
        if (newWindow) {
          newWindow.document.write(htmlContent)
          newWindow.document.close()
          
          // Agregar instrucciones para guardar
          setTimeout(() => {
            const instruction = newWindow.document.createElement('div')
            instruction.innerHTML = `
              <div style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 5px; z-index: 9999;">
                <p>Para guardar: Haz clic derecho → Guardar imagen como...</p>
                <p>O usa Ctrl+S (Cmd+S en Mac)</p>
                <button onclick="window.close()" style="margin-top: 10px; padding: 5px 10px;">Cerrar</button>
              </div>
            `
            newWindow.document.body.appendChild(instruction)
          }, 500)
        }
        
      } else {
        // Si es imagen, procesar como antes
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setImageUrl(url)

        // Descargar automáticamente
        const a = document.createElement('a')
        a.href = url
        a.download = `imagen-${name.replace(/\s+/g, '-').toLowerCase()}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }

    } catch (error) {
      console.error('Error:', error)
      alert('Hubo un error al generar la imagen. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Haz tu invitación</h1>
        
        <form onSubmit={generateImage}>
          <div className="form-group">
            <label htmlFor="name">Tu Nombre:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Escribe tu nombre aquí"
              maxLength={50}
              disabled={loading}
            />
          </div>
          
          <button type="submit" disabled={loading || !name.trim()}>
            {loading ? (
              <>
                <span className="loading"></span>
                Generando...
              </>
            ) : (
              'Generar invitación'
            )}
          </button>
        </form>

        {imageUrl && (
          <div className="image-preview">
            <h3>Tu invitacion personalizada:</h3>
            <img src={imageUrl} alt={`Imagen personalizada para ${name}`} />
            <br />
            <br />
            <button 
              onClick={() => {
                const a = document.createElement('a')
                a.href = imageUrl
                a.download = `imagen-${name.replace(/\s+/g, '-').toLowerCase()}.png`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }}
            >
              Descargar invitación
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
