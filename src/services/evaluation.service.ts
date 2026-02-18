import { parseJsonFile, safeJsonParse } from "@/lib/json.manager";
import { createAnalyzedSession } from "@/repositories/analyzedSessions.repository";
import { getGroupSessionById } from "@/repositories/groupSessions.repository";
import { getLLMEvaluation } from "@/transcript_pruner/tokenService/token.index";
import { Session } from "@/types/pruner.types";


export async function evaluateSession(groupSessionId:number) {
  try {
    const groupSession = await getGroupSessionById(groupSessionId);

    const transcript = JSON.stringify(groupSession.transcript);
    console.log("group session", groupSession)
    console.log("trpe session", typeof(groupSession.transcript))
    // const parsedSession = await parseJsonFile<Session>(groupSession.transcript);

    const { llmEvaluation } = await getLLMEvaluation(transcript);

    let isContentSafe = true;

    if (llmEvaluation.risk_assessment.flag !== "SAFE") isContentSafe = false;

    const analyzedSession = await createAnalyzedSession({
      session_id: groupSession.id,
      summary: llmEvaluation.session_summary,
      llm_evaluation: llmEvaluation,
      is_safe: isContentSafe,
      content_coverage: llmEvaluation.metrics.content_coverage.score,
      facilitation_quality: llmEvaluation.metrics.facilitation_quality.score,
      protocol_safety: llmEvaluation.metrics.protocol_safety.score
    });

    // console.log("llm evaluation", llmEvaluation)
    console.log("analyzedd", analyzedSession);
    // console.log("llm evaluation", llmEvaluation)

    return analyzedSession;
  } catch (error) {
    throw error;
  }
}
