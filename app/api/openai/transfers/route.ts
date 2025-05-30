import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { useTransferStore } from "@/lib/store/transfer-store"

if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no está configurada en las variables de entorno');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const schema = z.object({
    nombreDestinatario: z.string(),
    amount: z.number(),
    description: z.string(),
    response: z.string(),
    page: z.string()
});


export async function POST(request: Request) {

    try {
        
        const {text}  = await request.json();

        const { nombreDestinatario, amount, description } = useTransferStore.getState();

        console.log('Texto recibido:', text);

        const systemPrompt =`Eres un asistente virtual especializado en transferencias bancarias.
        Tu objetivo es recolectar la información necesaria del usuario de manera amigable y profesional.
        Debes recoletar la siguiente información:
        1. Nombre del destinatario
        2. Monto
        3. Descripción

        Actualmente tienes la siguiente información:
        Nombre del destinatario: ${nombreDestinatario}
        Monto: ${amount}
        Descripción: ${description}


        Mantén un tono conversacional y asegúrate de validar la información proporcionada.
        Si el usuario no proporciona la información correcta, pide amablemente que la repita.
        Cuando hayas recolectado toda la información, agradece al usuario y confirma que su solicitud será procesada.

        El formato de la respuesta debe ser el siguiente:
        {
            "nombreDestinatario": "Juan Perez",
            "amount": 1000000,
            "description": "Transferencia de prueba",
            "response": "¡Gracias por proporcionar la información! Su solicitud será procesada en breve. Por favor, acepta para proceder",
            "page" : "transfers/confirmation"
        }

        Si el usuario acepta la solicitud, la página a la que debe redirigir es:
        "dashboard"

        Si el usuario no acepta la solicitud, la página a la que debe redirigir es:
        "transfers"
        `;

        const response = await openai.responses.parse({
            model: "gpt-4o-2024-08-06",
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


