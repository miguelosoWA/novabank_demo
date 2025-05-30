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
    nombreDestinatario: z.string(),
    amount: z.number(),
    description: z.string().optional(),
    response: z.string(),
    page: z.string()
});


export async function POST(request: Request) {

    try {
        
        const {text, nombreDestinatario, amount, description}  = await request.json();

        console.log('Texto recibido:', text);

        const systemPrompt =`Eres un asistente virtual especializado en transferencias bancarias.
        Tu objetivo es recolectar la información necesaria del usuario de manera amigable y profesional.
        Debes recolectar la siguiente información:
        1. Nombre del destinatario (obligatorio)
        2. Monto (obligatorio)
        3. Descripción (opcional, solo si el usuario la proporciona)

        Actualmente tienes la siguiente información:
        Nombre del destinatario: ${nombreDestinatario}
        Monto: ${amount}
        Descripción: ${description}

        Mantén un tono conversacional y asegúrate de validar la información proporcionada.
        Si el usuario no proporciona la información correcta, pide amablemente que la repita.

        Cuando hayas recolectado el nombre del destinatario y el monto (la descripción es opcional), responde agradeciendo y confirma que se mostrará la pantalla de confirmación de transferencia.
        Si el usuario acepta la transferencia en la pantalla de confirmación, responde agradeciendo y confirma que será redirigido al dashboard.
        Si el usuario indica que quiere hacer otra transferencia después de aceptar, vuelve a mostrar la pantalla de confirmación de transferencia.

        El formato de la respuesta debe ser el siguiente:
        {
            "nombreDestinatario": "Juan Perez",
            "amount": 1000000,
            "description": "Transferencia de prueba" (opcional),
            "response": "¡Gracias por proporcionar la información! Por favor revisa y confirma la transferencia.",
            "page" : "transfers/confirmation"
        }

        Si el usuario acepta o confirma la transferencia en la confirmación, la página a la que debe redirigir es:
        "dashboard"

        Si el usuario indica que quiere hacer otra transferencia después de aceptar, la página a la que debe redirigir es:
        "transfers/confirmation"

        Si falta información o el usuario está corrigiendo datos, la página a la que debe redirigir es:
        "transfers/confirmation"


        IMPORTANTE:
        No decir a donde redirigir, solo responder con el formato de la respuesta.
        `;

        console.log('Prompt:', systemPrompt);

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


