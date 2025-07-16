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
    response: z.boolean(),
});


export async function POST(request: Request) {

    try {
        
        const {text}  = await request.json();

        console.log('Texto recibido:', text);

        const systemPrompt =`Eres un asistente virtual especializado en transferencias bancarias.
        Debes recolectar la siguiente información del usuario de manera amigable y profesional:
        
        - Nombre del destinatario (obligatorio)
        - Monto (obligatorio)
        
        Tu objetivo es responder según las siguientes reglas:

        1. Si el agente bancario proporciona informacion de la transferencia, el formato de la respuesta debe ser:
        {
            "nombreDestinatario": "Juan Perez",
            "amount": 1000000,
            "response": true
        }

        2. Si no entiendes lo que el usuario te esta diciendo, o falta información o el usuario está corrigiendo datos, el formato de la respuesta debe ser:
        {
            "response": false
        }  
        `;

        console.log('Prompt:', systemPrompt);

        const response = await openai.responses.parse({
            model: "gpt-4.1-nano-2025-04-14",
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


