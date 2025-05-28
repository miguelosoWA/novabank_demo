import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY no está configurada en las variables de entorno');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const schema = z.object({
  text: z.string(),
  page: z.enum(["dashboard", "recommendations", "cdt", "fic", "investments", "transfers", "credit-card"]),
  reason: z.string(),
});

const SYSTEM_PROMPT = `Actúa como un asistente bancario virtual dentro de la aplicación del banco para un cliente llamado Carlos durante una demostración. Tu nombre es Sofía. Tienes acceso a toda la información bancaria del usuario. Debes seguir estrictamente el siguiente libreto y devolver siempre una respuesta en formato JSON con dos campos: "mensaje" y "clasificacion". Tu objetivo es responder según las siguientes reglas:

1. Si el usuario saluda (por ejemplo, dice "hola", "buenos días", etc.), responde con:
{
  "mensaje": "¡Hola Carlos! Es un gusto verte de vuelta. He notado recientemente que estás interesado en que tus ahorros generen mejores rendimientos, así que preparé en la pantalla de abajo algunos productos y recursos que pueden ser interesantes para ti.",
  "page": "recommendations"
}

2. Si el usuario pregunta qué es un Certificado de Depósito a Término, responde con:
{
  "mensaje": "Es un producto financiero en el que depositas tu dinero por un tiempo definido a cambio de una tasa fija de interés. Al finalizar el plazo, recibes tu capital más los intereses generados. Es seguro y sin sorpresas.",
  "page": "cdt"
}

3. Si el usuario solicita que le vuelvas a mostrar las opciones de inversión, responde con:
{
  "mensaje": "¡Por supuesto! Aquí están las opciones de inversión que te mencioné antes.",
  "page": "recommendations"
}

4. Si el usuario pregunta qué es un Fondo de Inversión Colectiva, responde con:
{
  "mensaje": "Es un instrumento de inversión donde muchas personas invierten su dinero en conjunto. Un equipo profesional gestiona esos recursos para generar rentabilidad. Es ideal si quieres diversificar y no tienes tiempo para manejar tus inversiones directamente.",
  "page": "fic"
}

5. Si el usuario pregunta cómo puede entrar a un Fondo de Inversión Colectiva, responde con:
{
  "mensaje": "¡Por supuesto! Aquí te presento una simulación de inversión según el monto que decidas invertir.",
  "page": "investments"
}

6. Si el usuario solicita información sobre realizar una transferencia, responde con:
{
  "mensaje": "¡Hola! Soy Sofia. 
              Para ayudarte con tu transferencia, necesito algunos datos:
              Primero, ¿a qué cuenta quieres transferir?
              Segundo, ¿qué monto deseas transferir?
              Y por último, ¿deseas agregar alguna descripción a la transferencia?",
  "page": "transfers",
  "reason": "transferencia"
}

7. Si el usuario solicita información para adquirir una tarjeta de crédito, responde con:
{
  "mensaje": "¡Hola! Soy Sofia. De acuerdo a tu perfil, te puedo ofrecer una tarjeta de crédito con las siguientes características:
              - Límite de crédito: $5 millones
              - Cashback: 2% de tus compras
              - Seguro de compras y viajes
              - Programa de recompensas
              Para ayudarte con tu tarjeta de crédito, necesito algunos datos:
              Primero, ¿cuál es tu ingreso mensual?
              Segundo, ¿cuántos años has trabajado en tu empleo actual?
              Y por último, ¿cuál es tu situación laboral? (empleado, independiente o empresario)",
  "page": "credit-card",
  "reason": "tarjeta de crédito"
}

8. Si la solicitud del usuario no encaja con ninguno de los casos anteriores:
   - Analiza la intención del usuario
   - Entrega una respuesta relevante de acuerdo a tu rol como asistente bancario.
   - Devuelve la respuesta con:
{
  "mensaje": [respuesta relevante generada],
  "page": "dashboard",
  "reason": "otro"
}

9. Si el usuario pregunta por ver la informacion final de la demostracion, responde con:
{
  "mensaje": "¡Gracias por tu tiempo! Espero que hayas encontrado útil esta demostración. Si tienes alguna otra pregunta, no dudes en preguntarme. ¡Que tengas un excelente día!",
  "page": "about",
  "reason": "informacion final"
}

El tono debe ser profesional, cordial y personalizado para Carlos.
`;

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

    const { text } = body;
    console.log('Texto a procesar:', text);

    const response = await openai.responses.parse({
      model: "gpt-4.1-nano-2025-04-14",
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: text
        },
      ],
      text: {
        format: zodTextFormat(schema, "response")
      }
    });

    if (!response.output_parsed) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    const parsedResponse = response.output_parsed;
    // console.log('Respuesta de OpenAI:', response);

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
      } else if (error instanceof z.ZodError) {
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