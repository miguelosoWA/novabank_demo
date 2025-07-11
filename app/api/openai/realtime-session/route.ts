import { NextResponse } from 'next/server';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY no está configurada en las variables de entorno');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { voice = "alloy", instructions } = body;

    console.log('Creating ephemeral session with voice:', voice);

    // Use the REST API directly to create an ephemeral session
    const sessionConfig: any = {
      model: "gpt-4o-realtime-preview-2025-06-03",
      voice: voice,
    };

    // Add instructions (system prompt) if provided
    if (instructions) {
      sessionConfig.instructions = instructions;
      console.log('Using custom instructions for session');
    }

    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionConfig),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error creating session: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Ephemeral session created successfully');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating ephemeral session:', error);
    
    let errorMessage = 'Error al crear la sesión';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Error de autenticación con OpenAI. Verifica tu API key.';
        statusCode = 401;
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Límite de solicitudes excedido. Por favor, intenta más tarde.';
        statusCode = 429;
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: statusCode }
    );
  }
} 