import { generateText, type ModelMessage } from "ai";
import "dotenv/config";
import type { AgentCallbacks } from "../types.js";
import { SYSTEM_PROMPT } from "./system/prompt.js";
import { openai } from "@ai-sdk/openai";
import { tools } from "./tools/index.js";
import { executeTools } from "./executeTools.js";
import { getTracer, Laminar } from "@lmnr-ai/lmnr";

const MODEL_NAME = "gpt-5-mini";

Laminar.initialize({
	projectApiKey: process.env.LMNR_PROJECT_API_KEY,
});

export const runAgent = async (
	userMessage: string,
	conversationHistory?: ModelMessage[],
	callbacks?: AgentCallbacks,
) => {
	const { text, toolCalls } = await generateText({
		model: openai(MODEL_NAME),
		prompt: userMessage,
		system: SYSTEM_PROMPT,
		tools: tools,
		experimental_telemetry: {
			isEnabled: true,
			tracer: getTracer(),
		},
	});

	console.log(text, toolCalls);

	toolCalls.forEach(async (toolCall) => {
		const result = await executeTools(toolCall.toolName, toolCall.input);
		console.log(result);
	});
};

runAgent("what is the current date and time");
