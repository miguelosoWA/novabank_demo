import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import clientInfo from '@/data/client-info.json';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY no está configurada en las variables de entorno');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const schema = z.object({
  text: z.string(),
  page: z.enum(["dashboard", "investments", "investments", "profile"]),
  reason: z.string(),
});

const SYSTEM_PROMPT = `Eres un asistente virtual bancario profesional y amable. Tu función es:

1. Analizar la solicitud del usuario y determinar a qué sección de la banca en línea debe ser dirigido
2. Proporcionar una respuesta clara y concisa basada en los datos del banco
3. Especificar la página a la que debe ser redirigido el usuario

Datos del banco disponibles:
${JSON.stringify(clientInfo, null, 2)}

Las secciones disponibles son:
- accounts: Para consultas sobre cuentas bancarias, saldos y movimientos
- cards: Para información sobre tarjetas de crédito y débito
- investments: Para consultas sobre inversiones y productos financieros
- payments: Para pagos, transferencias y facturas
- reports: Para reportes financieros y análisis de gastos
- settings: Para configuración de la cuenta y preferencias

Debes:
1. Analizar la solicitud del usuario
2. Usar los datos del banco para proporcionar información relevante
3. Determinar la sección más apropiada para la solicitud
4. Proporcionar una respuesta natural y conversacional
5. Incluir datos específicos del cliente cuando sea relevante
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
      model: "gpt-4o-2024-08-06",
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