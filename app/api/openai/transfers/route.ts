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
    nombreDestinatario: z.string().optional(),
    amount: z.number().optional(),
    description: z.string().optional(),
    response: z.string(),
    page: z.enum(["dashboard", "transfers", "transfers/confirmation"]),
});


export async function POST(request: Request) {

    try {
        
        const {text, nombreDestinatario, amount, description}  = await request.json();

        console.log('Texto recibido:', text);

        const systemPrompt =`Eres un asistente virtual especializado en transferencias bancarias.
        Debes recolectar la siguiente información del usuario de manera amigable y profesional:
        
        - Nombre del destinatario (obligatorio)
        - Monto (obligatorio)
        - Descripción (opcional, solo si el usuario la proporciona)
        
        Tu objetivo es responder según las siguientes reglas:

        1. Si el usuario proporciona informacion de la transferencia, el formato de la respuesta debe ser:
        {
            "nombreDestinatario": "Juan Perez",
            "amount": 1000000,
            "description": "Descripción de la transferencia" (opcional),
            "response": "¡Gracias por proporcionar la información! Por favor revisa y confirma los datos de la transferencia.",
            "page" : "transfers/confirmation"
        }

        2. Si el usuario acepta o confirma la transferencia en la confirmación, el formato de la respuesta debe ser:
        {
            "nombreDestinatario": ${nombreDestinatario},
            "amount": ${amount},
            "description": ${description},
            "response": "¡Gracias por confirmar la transferencia!, tu solicitud será procesada en breve.",
            "page" : "dashboard"
        }

        3. Si no entiendes lo que el usuario te esta diciendo, o falta información o el usuario está corrigiendo datos, el formato de la respuesta debe ser:
        {
            "response": "¡Por favor, proporciona la información necesaria para continuar!",
            "page" : "transfers"
        }

        Mantén un tono conversacional y asegúrate de validar la información proporcionada.
        Si el usuario no proporciona la información correcta, pide amablemente que la repita.   
        `;

        console.log('Prompt:', systemPrompt);

        const response = await openai.responses.parse({
            model: "gpt-4.1-mini-2025-04-14",
            input: [{ role: "system", content: systemPrompt }, { role: "user", content: text }],
            text: { format: zodTextFormat(schema, "response") }
        });

        console.log('Respuesta de OpenAI:', response);

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


