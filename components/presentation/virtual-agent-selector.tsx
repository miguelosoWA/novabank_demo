"use client"

import { useState, useRef } from "react"
import { GeminiVirtualAgent, GeminiVirtualAgentRef } from "./gemini-virtual-agent"
import { OpenAIVirtualAgent, OpenAIVirtualAgentRef } from "./openai-virtual-agent"

type AgentType = 'gemini' | 'openai'

interface VirtualAgentSelectorProps {
  apiKey: string
  onStreamReady?: () => void
  onStreamError?: (error: string) => void
}

export function VirtualAgentSelector({ apiKey, onStreamReady, onStreamError }: VirtualAgentSelectorProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('gemini')
  const geminiRef = useRef<GeminiVirtualAgentRef>(null)
  const openaiRef = useRef<OpenAIVirtualAgentRef>(null)

  const handleAgentChange = (agent: AgentType) => {
    setSelectedAgent(agent)
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Agent Selector */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 text-white px-4 py-2 rounded-lg z-50">
        <button
          onClick={() => handleAgentChange('gemini')}
          className={`px-3 py-1 rounded transition-all ${
            selectedAgent === 'gemini' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white/20 text-gray-300 hover:bg-white/30'
          }`}
        >
          Gemini
        </button>
        <button
          onClick={() => handleAgentChange('openai')}
          className={`px-3 py-1 rounded transition-all ${
            selectedAgent === 'openai' 
              ? 'bg-green-600 text-white' 
              : 'bg-white/20 text-gray-300 hover:bg-white/30'
          }`}
        >
          OpenAI
        </button>
      </div>

      {/* Virtual Agent */}
      <div className="flex-1 relative">
        {selectedAgent === 'gemini' ? (
          <GeminiVirtualAgent
            ref={geminiRef}
            apiKey={apiKey}
            onStreamReady={onStreamReady}
            onStreamError={onStreamError}
          />
        ) : (
          <OpenAIVirtualAgent
            ref={openaiRef}
            onStreamReady={onStreamReady}
            onStreamError={onStreamError}
          />
        )}
      </div>
    </div>
  )
} 