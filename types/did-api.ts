export interface DIDStreamResponse {
  id: string
  websocket_url: string
  status: string
}

export interface DIDMessage {
  type: "text" | "video"
  text?: string
  data?: ArrayBuffer
}

export interface DIDConfig {
  stitch: boolean
  result_format: "mp4" | "webm"
}

export interface DIDStreamRequest {
  source_url: string
  driver_url: string
  config: DIDConfig
}

export interface DIDTalkRequest {
  text: string
  session_id?: string
} 