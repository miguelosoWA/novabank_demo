import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Google Gemini Live Audio utilities
export function createAudioData(pcmData: Float32Array): { data: string, mimeType: string } {
  // Convert Float32Array to Int16Array for better compatibility
  const int16Array = new Int16Array(pcmData.length);
  for (let i = 0; i < pcmData.length; i++) {
    int16Array[i] = Math.max(-32768, Math.min(32767, pcmData[i] * 32768));
  }
  
  // Convert to base64 string as required by Gemini API
  const buffer = int16Array.buffer;
  const base64Data = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  
  return {
    data: base64Data,
    mimeType: "audio/pcm;rate=16000"
  };
}

export function createWavFromPCM(pcmData: Uint8Array, sampleRate: number = 24000): ArrayBuffer {
  // Create WAV file header
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const dataSize = pcmData.length;
  const fileSize = 36 + dataSize;
  
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  
  // WAV file header
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, fileSize, true); // File size
  view.setUint32(8, 0x57415645, false); // "WAVE"
  view.setUint32(12, 0x666D7420, false); // "fmt "
  view.setUint32(16, 16, true); // Chunk size
  view.setUint16(20, 1, true); // Audio format (PCM)
  view.setUint16(22, numChannels, true); // Number of channels
  view.setUint32(24, sampleRate, true); // Sample rate
  view.setUint32(28, byteRate, true); // Byte rate
  view.setUint16(32, blockAlign, true); // Block align
  view.setUint16(34, bitsPerSample, true); // Bits per sample
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, dataSize, true); // Data size
  
  // Copy audio data
  const audioData = new Uint8Array(buffer, 44);
  audioData.set(pcmData);
  
  return buffer;
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
  try {
    // Convert Uint8Array to ArrayBuffer
    const arrayBuffer = audioData.buffer.slice(
      audioData.byteOffset,
      audioData.byteOffset + audioData.byteLength
    );
    
    return await audioContext.decodeAudioData(arrayBuffer as ArrayBuffer);
  } catch (error) {
    console.error('Error decoding audio data:', error);
    console.log('Audio data length:', audioData.length);
    console.log('Audio data first 10 bytes:', audioData.slice(0, 10));
    
    // Try to create a simple audio buffer as fallback
    const buffer = audioContext.createBuffer(channels, audioData.length / 2, sampleRate);
    const channelData = buffer.getChannelData(0);
    
    // Convert bytes to float32 samples
    for (let i = 0; i < audioData.length; i += 2) {
      const sample = (audioData[i] | (audioData[i + 1] << 8)) / 32768.0;
      channelData[i / 2] = sample;
    }
    
    return buffer;
  }
}
