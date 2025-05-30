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
    monthlyIncome: z.number().optional(),
    employmentStatus: z.enum(["empleado", "independiente", "empresario"]).optional(),
    timeEmployed: z.string().optional(),
    response: z.string(),
    page: z.enum(["dashboard", "credit-card", "credit-card/confirmation"]),
});

export async function POST(request: Request) {
  try {
    const { text, monthlyIncome, employmentStatus, timeEmployed } = await request.json();
    
    const systemPrompt = `Eres un asistente virtual especializado en solicitudes de tarjetas de crédito.
    Debes recolectar la siguiente información del usuario de manera amigable y profesional:
    
    - Ingreso mensual
    - Situación laboral (empleado, independiente o empresario)
    - Tiempo en el empleo actual

    Tu objetivo es responder según las siguientes reglas:
    	
    1. Si el usuario proporciona información de la solicitud, el formato de la respuesta debe ser:
    El formato de la respuesta debe ser el siguiente:
    {
      "monthlyIncome": 1000000,
      "employmentStatus": "empleado",
      "timeEmployed": "5 años",
      "response": "¡Gracias por proporcionar la información! Por favor revisa y confirma los datos proporcionados.",
      "page": "credit-card/confirmation"
    }
      
    2. Si el usuario acepta o confirma la solicitud, el formato de la respuesta debe ser:
    {
      "monthlyIncome": ${monthlyIncome},
      "employmentStatus": ${employmentStatus},
      "timeEmployed": ${timeEmployed},
      "response": "¡Gracias por confirmar la solicitud!, tu solicitud será procesada en breve.",
      "page": "dashboard"
    }

    3. Si no entiendes lo que el usuario te esta diciendo, o falta información o el usuario está corrigiendo datos, el formato de la respuesta debe ser:
    {
      "response": "¡Por favor, proporciona la información necesaria para continuar!",
      "page": "credit-card"
    }

    Mantén un tono conversacional y asegúrate de validar la información proporcionada.
    Si el usuario no proporciona la información correcta, pide amablemente que la repita. 
    `
    ;

    const response = await openai.responses.parse({
      model: "gpt-4.1-mini-2025-04-14",
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