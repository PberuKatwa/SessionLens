import { Session } from "../../types/pruner.types";
import { getPrunedSession } from "./token.service";
import { allLexicons } from "./token.config";
import { SessionSchema } from "../../validators/session.schema";
import { LLMEvaluationResult } from "../../types/evaluation.types";
import { useGeminiLLMApi } from "../../lib/gemini.api";
import { logger } from "@/lib/logger";
import { safeJsonParse } from "@/lib/json.manager";

export async function getLLMEvaluation( jsonData: string): Promise<LLMEvaluationResult> {
  try {
    logger.info("Starting LLM evaluation pipeline");
    const parsedJson = safeJsonParse<Session>(jsonData);

    const validationResult = SessionSchema.safeParse(parsedJson);
    if (!validationResult.success) {
      logger.error("Session validation failed", { validationErrors: validationResult.error.flatten() });
      throw new Error("Invalid session data format");
    }

    const sessionData = validationResult.data;
    logger.info("Session validated successfully");

    const prunedSession = await getPrunedSession(allLexicons, sessionData);
    const systemPrompt = buildSystemPrompt();

    logger.info("Calling Gemini LLM (optimized)");

    const llmStart = performance.now();
    const llmEvaluation = await useGeminiLLMApi(systemPrompt, prunedSession.finalTranscript);
    const llmDuration = performance.now() - llmStart;

    logger.info("Gemini LLM evaluation complete", { durationMs: Math.round(llmDuration) });

    return { llmEvaluation, prunedTranscript: prunedSession};

  } catch (error) {
    logger.error("LLM evaluation pipeline failed", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });

    throw error;
  }
}

function buildSystemPrompt(): string {
  return `
    You are an expert Educational Quality Auditor.
    Evaluate the FULL, UNEDITED session transcript provided.

    RUBRICS:
    1. Content Coverage (1-3): Focus on Growth Mindset definitions (muscle metaphor, effort vs talent).
    2. Facilitation Quality (1-3): Focus on open-ended questions and validation.
    3. Protocol Safety (1-3): Ensure NO medical/psychiatric advice was given.

    RISK DETECTION:
    - Flag: "RISK" if text contains indications of self-harm, suicidal ideation, or severe crisis.
    - Otherwise return "SAFE".
    - Quote: Extract the triggering phrase; otherwise null.

    OUTPUT INSTRUCTIONS:
    - Return ONLY a valid JSON object.
    - No markdown blocks.
    - Concise but evidence-based justifications.

    JSON SCHEMA:
    {
      "session_summary": "string (exactly 3 sentences)",
      "metrics": {
        "content_coverage": { "score": number, "justification": "string" },
        "facilitation_quality": { "score": number, "justification": "string" },
        "protocol_safety": { "score": number, "justification": "string" }
      },
      "risk_assessment": {
        "flag": "SAFE" | "RISK",
        "quote": "string" | null
      }
    }
  `;
}
