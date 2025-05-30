import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { useCreditCardStore } from "@/lib/store/credit-card-store"


if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY no está configurada en las variables de entorno');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const schema = z.object({
    monthlyIncome: z.number(),
    employmentStatus: z.enum(["empleado", "independiente", "empresario"]),
    timeEmployed: z.string(),
    response: z.string(),
    page: z.string()
});

export async function POST(request: Request) {
  try {
    const { text, monthlyIncome, employmentStatus, timeEmployed } = await request.json();
    
    const systemPrompt = `Eres un asistente virtual especializado en solicitudes de tarjetas de crédito.
    Tu objetivo es recolectar la información necesaria del usuario de manera amigable y profesional.
    Debes recoletar la siguiente información:
    1. Ingreso mensual
    2. Situación laboral (empleado, independiente o empresario)
    3. Tiempo en el empleo actual


    Actualmente tienes la siguiente información:
    Ingreso mensual: ${monthlyIncome}
    Situación laboral: ${employmentStatus}
    Tiempo en el empleo actual: ${timeEmployed}
    
    Mantén un tono conversacional y asegúrate de validar la información proporcionada.
    Cuando hayas recolectado toda la información, agradece al usuario y confirma que su solicitud será procesada.
    
    El formato de la respuesta debe ser el siguiente:
    {
      "monthlyIncome": 1000000,
      "employmentStatus": "empleado",
      "timeEmployed": "5 años",
      "response": "¡Gracias por proporcionar la información! Su solicitud será procesada en breve.",
      "page": "credit-card/confirmation"
    }
      
    Si el usuario acepta la solicitud, la página a la que debe redirigir es:
    "dashboard"

    Si el usuario no acepta la solicitud, la página a la que debe redirigir es:
    "credit-card"

    Si falta información o el usuario está corrigiendo datos, la página a la que debe redirigir es:
    "credit-card"

    IMPORTANTE:
    No decir a donde redirigir, solo responder con el formato de la respuesta.
    `
    ;
    

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