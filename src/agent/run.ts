import { generateText, type ModelMessage } from 'ai'
import 'dotenv/config'
import type { AgentCallbacks } from '../types'
import { SYSTEM_PROMPT } from './system/prompt'
import { openai } from '@ai-sdk/openai'
import { tools } from './tools'
import { executeTools } from './executeTools'

const MODEL_NAME = "gpt-5-mini"

export const runAgent = async (userMessage: string, conversationHistory: ModelMessage[], callbacks: AgentCallbacks) => {
  const { text, toolCalls } = await generateText(
    {
      model: openai(MODEL_NAME),
      prompt: userMessage,
      system: SYSTEM_PROMPT,
      tools: tools,
    },
  )

  console.log(text, toolCalls)

  toolCalls.forEach(async (toolCall) => {
    const result = await executeTools(toolCall.toolName, toolCall.input)
    console.log(result)
  })
}

runAgent('what is the current date and time')
