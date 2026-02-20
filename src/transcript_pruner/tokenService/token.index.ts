import { Session } from "../../types/pruner.types";
import { getPrunedSession } from "./token.service";
import { allLexicons } from "./token.config";
import { SessionSchema } from "../../validators/session.schema";
import { LLMEvaluationResult } from "../../types/evaluation.types";
import { useGeminiLLMApi } from "../../lib/gemini.api";
import { logger } from "@/lib/logger";
import { safeJsonParse } from "@/lib/json.manager";
import { useKimiLLMApi } from "@/lib/kimi.api";

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
    // const llmEvaluation = await useKimiLLMApi(systemPrompt,prunedSession.finalTranscript);

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

  const systemPrompt = `
    You are a Senior Healthcare Clinical Evaluator for the Shamiri Institute. Your task is to analyze session transcripts
    between "Fellows" (lay-providers) and "Members." You must evaluate the session based on the provided rubric and output
    a strict JSON object.

    ### TRANSCRIPT ARCHITECTURE:
    - The transcript contains "SYSTEM" tags (e.g., "[3 turn(s) omitted]").
    - These indicate gaps in the recording/pruning where content was removed for brevity.
    - DO NOT penalize the Fellow for abrupt transitions if they occur across a SYSTEM tag.
    - Evaluate the Fellow ONLY on the visible text provided.

    ### EVALUATION RUBRIC:
    1. Content Coverage (Growth Mindset):
    - Score 1 (Missed): Failed to mention "Growth Mindset" or defined it incorrectly.
    - Score 2 (Partial): Mentioned the concept but did not check for understanding or moved too quickly.
    - Score 3 (Complete): Explained the concept (e.g., "brain is a muscle"), gave an example, and asked for group thoughts.

    2. Facilitation Quality:
    - Score 1 (Poor): Monologue, interrupted students, or used confusing jargon.
    - Score 2 (Adequate): Polite but transactional. Stuck to the script without deep engagement.
    - Score 3 (Excellent): Warm, validated feelings (e.g., "That sounds hard"), and encouraged quiet members.

    3. Protocol Safety:
    - Score 1 (Violation): Gave medical/psychiatric/relationship advice or diagnosed a member.
    - Score 2 (Minor Drift): Briefly distracted by side topics (like sleep/family advice) but returned to the curriculum.
    - Score 3 (Adherent): Stayed strictly within the Shamiri curriculum and handled distractions gracefully.

    ### RISK DETECTION:
    - Flag: "RISK" if text contains indications of self-harm, suicidal ideation, or severe crisis. Otherwise "SAFE".
    - Quote: Extract the specific phrase triggering the risk; otherwise, return null.

    ### OUTPUT INSTRUCTIONS:
    - Return ONLY a valid JSON object.
    - Do NOT include markdown code blocks, "json" labels, or backticks.
    - Ensure justifications are concise but evidence-based.

    ### JSON SCHEMA:
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

  return systemPrompt;
}
