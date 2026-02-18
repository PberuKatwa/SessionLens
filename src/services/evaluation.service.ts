import { createAnalyzedSession } from "@/repositories/analyzedSessions.repository";
import { getUnprocessedGroupSessionById, updateProcessedStatus } from "@/repositories/groupSessions.repository";
import { getLLMEvaluation } from "@/transcript_pruner/tokenService/token.index";

export async function evaluateSession(groupSessionId:number) {
  try {
    const groupSession = await getUnprocessedGroupSessionById(groupSessionId);

    const transcript = JSON.stringify(groupSession.transcript);
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

    if (!analyzedSession) throw new Error(`No analyzed session was found`);

    await updateProcessedStatus({ id: groupSession.id, is_processed: true });

    return analyzedSession;
  } catch (error) {
    throw error;
  }
}
