import { NextResponse } from 'next/server';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY no está configurada en las variables de entorno');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Actúa como un asistente bancario virtual llamado Sofía durante una demostración para un cliente llamado Carlos. Tu objetivo es recolectar información para una solicitud de tarjeta de crédito. Debes seguir estrictamente el siguiente libreto y devolver siempre una respuesta en formato JSON con los campos: "response" (mensaje para el usuario), "monthlyIncome" (si se menciona), "employmentStatus" (si se menciona), y "timeEmployed" (si se menciona).

Reglas de interacción:

1. Si el usuario menciona su ingreso mensual, extrae el número y responde con:
{
  "response": "Perfecto, he registrado tu ingreso mensual de [MONTO]. Ahora necesito saber tu situación laboral: ¿eres empleado, independiente o empresario?",
  "monthlyIncome": [MONTO]
}

2. Si el usuario menciona su situación laboral, responde con:
{
  "response": "Excelente, he registrado que eres [SITUACIÓN]. Por último, ¿cuántos años llevas en tu empleo actual?",
  "employmentStatus": "[empleado/independiente/empresario]"
}

3. Si el usuario menciona los años en su empleo, responde con:
{
  "response": "Perfecto Carlos, he registrado que llevas [AÑOS] años en tu empleo actual. Con toda esta información, puedo procesar tu solicitud de tarjeta de crédito. ¿Te parece bien proceder?",
  "timeEmployed": [AÑOS]
}

4. Si el usuario confirma o acepta, responde con:
{
  "response": "¡Excelente! Tu solicitud de tarjeta de crédito ha sido procesada. Te enviaremos los detalles a tu correo electrónico en los próximos días. ¡Gracias por confiar en nosotros!"
}

5. Para cualquier otra consulta, responde de manera amigable y profesional, manteniendo el contexto de la solicitud de tarjeta de crédito.

El tono debe ser profesional, cordial y personalizado para Carlos.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Request body:', body);

    if (!body || !body.text) {
      console.error('Texto no proporcionado en la solicitud');
      return NextResponse.json(
        { error: 'No se proporcionó texto para procesar' },
        { status: 400 }
      );
    }

    const { text, context } = body;
    console.log('Texto a procesar:', text);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: text
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    const parsedResponse = JSON.parse(response.choices[0].message.content);
    console.log('Respuesta de OpenAI:', parsedResponse);

    return NextResponse.json({
      response: parsedResponse
    });
  } catch (error) {
    console.error('Error detallado en el procesamiento de OpenAI:', error);
    
    let errorMessage = 'Error al procesar la solicitud';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Error de autenticación con OpenAI. Verifica tu API key.';
        statusCode = 401;
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Límite de solicitudes excedido. Por favor, intenta más tarde.';
        statusCode = 429;
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Error en el formato de la respuesta';
        statusCode = 422;
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