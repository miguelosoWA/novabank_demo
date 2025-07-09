class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this.bufferSize = 4096
    this.buffer = new Float32Array(this.bufferSize)
    this.bufferIndex = 0
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0]
    const output = outputs[0]
    
    if (input.length > 0) {
      const inputChannel = input[0]
      
      // Copy input data to buffer
      for (let i = 0; i < inputChannel.length; i++) {
        this.buffer[this.bufferIndex] = inputChannel[i]
        this.bufferIndex++
        
        // When buffer is full, send it to main thread
        if (this.bufferIndex >= this.bufferSize) {
          this.port.postMessage({
            type: 'audioData',
            data: this.buffer.slice()
          })
          this.bufferIndex = 0
        }
      }
      
      // Pass through to output (for monitoring)
      if (output.length > 0) {
        const outputChannel = output[0]
        for (let i = 0; i < inputChannel.length; i++) {
          outputChannel[i] = inputChannel[i]
        }
      }
    }
    
    return true
  }
}

registerProcessor('audio-processor', AudioProcessor) 