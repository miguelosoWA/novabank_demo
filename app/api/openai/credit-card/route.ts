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
    monthlyIncome: z.number(),
    employmentStatus: z.enum(["empleado", "independiente", "empresario"]),
    yearsEmployed: z.number(),
    response: z.string(),
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    const systemPrompt = `Eres un asistente virtual especializado en solicitudes de tarjetas de crédito.
    Tu objetivo es recolectar la información necesaria del usuario de manera amigable y profesional.
    Debes recoletar la siguiente información:
    4. Ingreso mensual
    5. Situación laboral (empleado, independiente o empresario)
    6. Años en el empleo actual
    
    Mantén un tono conversacional y asegúrate de validar la información proporcionada.
    Si el usuario no proporciona la información correcta, pide amablemente que la repita.
    Cuando hayas recolectado toda la información, agradece al usuario y confirma que su solicitud será procesada.
    
    El formato de la respuesta debe ser el siguiente:
    {
      "monthlyIncome": 1000000,
      "employmentStatus": "empleado",
      "yearsEmployed": 5,
      "response": "¡Gracias por proporcionar la información! Su solicitud será procesada en breve."
    }`;
    

    const response = await openai.responses.parse({
      model: "gpt-4.1-nano-2025-04-14",
      input: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: text
        }
      ],
      text: {
        format: zodTextFormat(schema, "response")
      }
    });

    if (!response.output_parsed) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    const parsedResponse = response.output_parsed;
    console.log('Respuesta de OpenAI:', parsedResponse);

    return NextResponse.json({
      response: parsedResponse
    });
  } catch (error) {
    console.error("Error en OpenAI API:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
} 