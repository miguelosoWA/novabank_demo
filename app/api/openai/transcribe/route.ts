import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json({ error: 'Archivo de audio requerido' }, { status: 400 })
    }

    // Convertir el archivo a buffer
    const audioBuffer = await audioFile.arrayBuffer()

    // Enviar a OpenAI Whisper para transcripción
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: (() => {
        const formData = new FormData()
        formData.append('file', new Blob([audioBuffer], { type: audioFile.type }), 'audio.webm')
        formData.append('model', 'whisper-1')
        formData.append('language', 'es')
        return formData
      })()
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error en OpenAI Whisper:', errorText)
      return NextResponse.json({ error: 'Error al transcribir audio' }, { status: 500 })
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      text: data.text,
      language: data.language
    })

  } catch (error) {
    console.error('Error en transcripción:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 