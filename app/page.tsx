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
