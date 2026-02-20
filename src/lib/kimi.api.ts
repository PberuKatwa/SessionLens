import axios from "axios";
import { Session } from "../types/pruner.types";
import { LLMEvaluation } from "../types/evaluation.types";
import { LLMEvaluationSchema } from "../validators/evaluation.schema";
import { llmConfig } from "@/config/config";

export async function useKimiLLMApi(
  systemPrompt: string,
  finalTranscript: Session
): Promise<LLMEvaluation> {
  try {
    const { kimiApiKey } = llmConfig();

    const promptInput = `
      Session Topic: ${finalTranscript.session_topic}
      Payload: ${JSON.stringify(finalTranscript.transcript)}
    `;

    const response = await axios.post(
      "https://kimi-k2.ai/api/v1/chat/completions",
      {
        model: "kimi-k2-0905",

        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: promptInput }
        ],

        temperature: 0.2,

        // ⚠️ IMPORTANT → forces clean JSON output (Gemini equivalent)
        response_format: { type: "json_object" }
      },
      {
        headers: {
          Authorization: `Bearer ${kimiApiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const rawText = response.data?.choices?.[0]?.message?.content;

    if (!rawText) {
      throw new Error("Kimi returned empty response");
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawText);
    } catch {
      throw new Error("LLM returned invalid JSON");
    }

    const validation = LLMEvaluationSchema.safeParse(parsedJson);

    if (!validation.success) {
      console.error("Zod validation error:", validation.error.format());
      throw new Error("LLM response failed schema validation");
    }

    return validation.data;

  } catch (error: any) {
    console.error("Kimi Eval Error:", error?.response?.data || error.message);
    throw new Error(`Error in getting Kimi evaluation: ${error.message}`);
  }
}
