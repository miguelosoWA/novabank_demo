class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.isRecording = false;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    
    if (!input || !input[0]) {
      return true;
    }

    const inputChannel = input[0];
    const outputChannel = output[0];

    // Copy input to output (pass-through)
    for (let i = 0; i < inputChannel.length; i++) {
      outputChannel[i] = inputChannel[i];
    }

    // Send audio data to main thread
    if (inputChannel.length > 0) {
      this.port.postMessage({
        type: 'audioData',
        data: inputChannel.slice()
      });
    }

    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor); 