import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real application, you would get this from environment variables
    // For demo purposes, you'll need to set your Deepgram API key
    const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
    
    if (!deepgramApiKey) {
      return NextResponse.json(
        { error: 'Deepgram API key not configured' },
        { status: 500 }
      );
    }

    // Return the API key (in production, you might want to create temporary keys)
    return NextResponse.json({
      key: deepgramApiKey,
      expires: Date.now() + 3600000, // 1 hour from now
    });
  } catch (error) {
    console.error('Error in Deepgram API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 