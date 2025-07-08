import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Google Gemini Live Audio utilities
export function createBlob(pcmData: Float32Array): Blob {
  // Convert Float32Array to Int16Array for better compatibility
  const int16Array = new Int16Array(pcmData.length);
  for (let i = 0; i < pcmData.length; i++) {
    int16Array[i] = Math.max(-32768, Math.min(32767, pcmData[i] * 32768));
  }
  
  return new Blob([int16Array.buffer], { type: 'audio/wav' });
}

export function decode(base64String: string): Uint8Array {
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  audioData: Uint8Array,
  audioContext: AudioContext,
  sampleRate: number,
  channels: number
): Promise<AudioBuffer> {
  // Convert Uint8Array to ArrayBuffer
  const arrayBuffer = audioData.buffer.slice(
    audioData.byteOffset,
    audioData.byteOffset + audioData.byteLength
  );
  
  return await audioContext.decodeAudioData(arrayBuffer as ArrayBuffer);
}
