import { parseJsonFile, safeJsonParse } from "@/lib/json.manager";
import { createAnalyzedSession } from "@/repositories/analyzedSessions.repository";
import { getGroupSessionById } from "@/repositories/groupSessions.repository";
import { getLLMEvaluation } from "@/transcript_pruner/tokenService/token.index";
import { Session } from "@/types/pruner.types";


export async function evaluateSession(groupSessionId:number) {
  try {

    const groupSession = await getGroupSessionById(groupSessionId);
    // const parsedSession = await parseJsonFile<Session>(groupSession.transcript);

    const { llmEvaluation } = await getLLMEvaluation(groupSession.transcript);

    console.log("llm evaluation", llmEvaluation)
    console.log("llm evaluation", llmEvaluation)
    console.log("llm evaluation", llmEvaluation)




    // const analyzedSession = await createAnalyzedSession({
    //   session_id: groupSession.id,

    // })

  } catch (error) {
    throw error;
  }
}
