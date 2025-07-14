import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json({ error: 'Archivo de audio requerido' }, { status: 400 })
    }

    // Check if Deepgram API key is configured
    if (!process.env.DEEPGRAM_API_KEY) {
      return NextResponse.json({ error: 'Deepgram API key not configured' }, { status: 500 })
    }

    // Convert file to buffer for Deepgram
    const audioBuffer = await audioFile.arrayBuffer()

    // Send to Deepgram for transcription
    const deepgramUrl = 'https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&language=es'
    
    const response = await fetch(deepgramUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
        'Content-Type': audioFile.type || 'audio/webm',
      },
      body: audioBuffer
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error en Deepgram:', errorText)
      return NextResponse.json({ error: 'Error al transcribir audio' }, { status: 500 })
    }

    const data = await response.json()
    
    // Deepgram response structure is different from OpenAI
    // Extract text from Deepgram's response format
    const transcriptText = data.results?.channels?.[0]?.alternatives?.[0]?.transcript || ''
    
    return NextResponse.json({
      success: true,
      text: transcriptText,
      language: data.results?.channels?.[0]?.detected_language || 'es'
    })

  } catch (error) {
    console.error('Error en transcripción:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 