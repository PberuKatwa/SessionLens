# Shamiri Supervisor Copilot

A web-based dashboard enabling Shamiri Supervisors to review therapy sessions conducted by Fellows and access AI-generated session insights. Solves the quality assurance bottleneck at scale by amplifying supervisor capacity through structured AI analysis and human-in-the-loop validation.

## Purpose

Shamiri delivers evidence-based mental health interventions to young people using a Tiered Care Model. As we scale to serve millions of youths, Supervisors face a critical bottleneck: they cannot listen to every session recording to ensure safety and protocol adherence. This application amplifies supervisor capacity using Generative AI while preserving human judgment and accountability.

## Core Features

- **Session Dashboard**: View 10+ completed therapy sessions with metadata (Fellow Name, Date, Group ID, Status)
- **AI Session Analysis**: Structured LLM-generated insights including 3-sentence summary, quality scores, and risk detection
- **3-Point Quality Index**: Evaluate sessions on Content Coverage, Facilitation Quality, and Protocol Safety
- **Risk Detection**: Binary SAFE/RISK flag with exact quote extraction for self-harm or crisis indicators
- **Human-in-the-Loop**: Supervisors validate, reject, or override AI findings with contextual notes

---

## System Architecture

```
Session Upload → Pruning Engine (67% reduction) → Gemini LLM → 
Structured Evaluation → Database → Supervisor Dashboard (Human Validation)
```

### Transcript Pruning Engine

**Why**: Raw transcripts exceed 5,000+ words. Pruning reduces tokens by 67% while preserving clinical signals, cutting latency from ~3.2s to ~1.1s and API costs by 67%.

**How** (`src/transcript_pruner/transcriptPruner/transcript.pruner.ts`):
1. **Signal Detection**: Identifies clinically relevant turns using lexicons (safety, pedagogy, empathy, reflection)
2. **Context Expansion**: Expands critical turns bidirectionally with surrounding dialogue
3. **Smart Capping**: Limits repetitive content while preserving narrative flow
4. **Gap Annotation**: Marks omitted sections with `[X turn(s) omitted]` tags

**Performance**:
- Word Count: 4,200 → 1,400 (67% reduction)
- LLM Latency: 3.2s → 1.1s (66% faster)
- API Cost: $0.042 → $0.014 (67% cheaper)

---

## Quality Evaluation Rubric

### Metric 1: Content Coverage (Teaching Fidelity)
- **Score 1 (Missed)**: Failed to mention concept or defined incorrectly
- **Score 2 (Partial)**: Mentioned but didn't check understanding
- **Score 3 (Complete)**: Explained clearly, gave examples, engaged group

### Metric 2: Facilitation Quality (Delivery Style)
- **Score 1 (Poor)**: Monologue, interrupted, confusing jargon
- **Score 2 (Adequate)**: Polite but transactional, stuck to script
- **Score 3 (Excellent)**: Warm, validated feelings, encouraged participation

### Metric 3: Protocol Safety (Scope Adherence)
- **Score 1 (Violation)**: Gave unauthorized medical/psychiatric advice
- **Score 2 (Minor Drift)**: Got distracted but returned to curriculum
- **Score 3 (Adherent)**: Stayed within Shamiri curriculum

### Risk Assessment
- **Flag**: `SAFE` or `RISK`
- **Quote**: Exact phrase if risk detected (self-harm, suicidal ideation, crisis) or `null`

---

## Type Safety & Validation

All inputs validated with Zod schemas for runtime type safety.

### Session Upload Validation

```typescript
// src/validators/session.schema.ts
export const SessionSchema = z.object({
  session_topic: z.string(),
  duration_minutes: z.number().positive(),
  transcript: z.array(z.object({
    speaker: z.string(),
    text: z.string()
  }))
});
```

### LLM Response Validation

```typescript
// src/validators/evaluation.schema.ts
export const LLMEvaluationSchema = z.object({
  session_summary: z.string().min(1),
  metrics: z.object({
    content_coverage: z.object({
      score: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      justification: z.string().min(1)
    }),
    facilitation_quality: z.object({
      score: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      justification: z.string().min(1)
    }),
    protocol_safety: z.object({
      score: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      justification: z.string().min(1)
    })
  }),
  risk_assessment: z.object({
    flag: z.union([z.literal("SAFE"), z.literal("RISK")]),
    quote: z.string().nullable()
  })
}).strict();
```

**Validation Flow**: Parse JSON → Validate with Zod → Use type-safe data → Store in database

---

## Data Models

### GroupSessions Table
Stores raw session transcripts (immutable source of truth)

```typescript
interface GroupSession {
  id: number;
  user_id: number;              // Supervisor ID
  group_id: number;             // Group identifier
  fellow_name: string;          // Fellow conducting session
  transcript: RawTurn[];        // Raw transcript data
  is_processed: boolean;        // Has LLM evaluation been run?
  row_status: 'active' | 'trash';
  created_at: timestamp;
}
```

### AnalyzedSessions Table
Stores LLM evaluations and supervisor reviews (audit trail)

```typescript
interface AnalyzedSession {
  id: number;
  session_id: number;           // FK to GroupSession
  summary: string;              // 3-sentence session summary
  content_coverage: 1 | 2 | 3;
  facilitation_quality: 1 | 2 | 3;
  protocol_safety: 1 | 2 | 3;
  is_safe: boolean;             // Risk flag
  llm_evaluation: object;       // Full LLM JSON response
  review_status: 'unreviewed' | 'reviewed' | 'flagged';
  reviewer_id: number;          // Supervisor who reviewed
  reviewer_comments: string;    // Contextual notes
  row_status: 'active' | 'trash';
  created_at: timestamp;
}
```

---

## Evaluation Pipeline

The `evaluation.service.ts` orchestrates the entire workflow:

```typescript
export async function evaluateSession(groupSessionId: number) {
  // 1. Fetch unprocessed session
  const groupSession = await getUnprocessedGroupSessionById(groupSessionId);
  
  // 2. Run LLM evaluation (with pruning)
  const { llmEvaluation } = await getLLMEvaluation(transcript);
  
  // 3. Extract safety flag
  const isContentSafe = llmEvaluation.risk_assessment.flag === "SAFE";
  
  // 4. Store results
  const analyzedSession = await createAnalyzedSession({
    session_id: groupSession.id,
    summary: llmEvaluation.session_summary,
    content_coverage: llmEvaluation.metrics.content_coverage.score,
    facilitation_quality: llmEvaluation.metrics.facilitation_quality.score,
    protocol_safety: llmEvaluation.metrics.protocol_safety.score,
    is_safe: isContentSafe,
    llm_evaluation: llmEvaluation
  });
  
  // 5. Mark session as processed
  await updateProcessedStatus({ id: groupSession.id, is_processed: true });
  
  return analyzedSession;
}
```

---

## API Endpoints

### `POST /api/sessions/group`
Upload session transcript (multipart/form-data: fellowName, groupId, transcriptFile)
- Validates against `SessionSchema`
- Stores in `GroupSessions` table
- Returns session ID and processing status

### `GET /api/sessions/group`
Fetch paginated list of group sessions
- Query params: `?page=1&limit=10`
- Returns sessions with metadata and pagination info

### `POST /api/sessions/analyzed/[id]`
Trigger AI evaluation for session
- Prunes transcript → Calls Gemini LLM → Validates response → Stores results
- Validates LLM response against `LLMEvaluationSchema`
- Returns analyzed session with scores and risk assessment

### `POST /api/sessions/analyzed/review`
Supervisor validates/overrides AI findings
- Enables human-in-the-loop validation
- Supervisors can confirm, override, or flag sessions
- Stores reviewer ID, comments, and final status

### `GET /api/sessions/combined/minimal`
Fetch paginated session list for dashboard
- Minimal payload for fast rendering
- Returns: id, fellow_name, group_id, created_at, is_processed, is_safe, review_status

---

## Frontend Components

- **Sidebar** (`src/components/layout/Sidebar.tsx`): Navigation and session filtering
- **Dashboard** (`src/app/dashboard/page.tsx`): Main supervisor interface with session overview
- **Analyzed Sessions** (`src/app/dashboard/analyzed/page.tsx`): List of evaluated sessions
- **Session Detail** (`src/app/dashboard/analyzed/[id]/page.tsx`): Detailed review interface with transcript, AI scores, and supervisor override form

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Gemini API key

### Installation

```bash
# Install dependencies
npm install

# Configure environment
GEMINI_API_KEY=your_key
DATABASE_URL=postgresql://user:password@localhost:5432/shamiri
NEXT_PUBLIC_API_URL=http://localhost:3000

# Run migrations
npm run db:migrate

# Start development
npm run dev
```

### Key Files

- `src/transcript_pruner/transcriptPruner/transcript.pruner.ts` - Pruning engine
- `src/services/server/evaluation.service.ts` - Evaluation orchestration
- `src/validators/*.schema.ts` - Zod validation schemas
- `src/repositories/*.repository.ts` - Database layer
- `src/lib/gemini.api.ts` - Gemini LLM integration
- `src/app/api/sessions/group/route.ts` - Session upload endpoint

---

## Design Decisions

### Why Pruning Reduces Latency
1. **Fewer Tokens**: 67% reduction in token count
2. **Smaller Context Window**: LLM processes less text
3. **Faster Inference**: Gemini 2.5 Flash optimized for speed
4. **Lower Cost**: Fewer tokens = lower API charges

### Why Pruning Preserves Accuracy
1. **Signal-Based Selection**: Keeps clinically relevant content
2. **Context Expansion**: Preserves surrounding dialogue
3. **Gap Annotation**: Tells LLM where content was removed
4. **Bidirectional Expansion**: Captures full conversational context

### Why Human Review Matters
1. **Contextual Judgment**: Supervisors understand local context
2. **Override Capability**: Can correct AI misinterpretations
3. **Accountability**: Creates audit trail of decisions
4. **Continuous Improvement**: Feedback loop improves future evaluations

---

## Security & Best Practices

- **Database**: Parameterized queries prevent SQL injection
- **Authentication**: Supervisor login required for all endpoints
- **Authorization**: Supervisors only view sessions under their supervision
- **Data Privacy**: Transcripts stored securely; no PII in logs
- **Risk Flagging**: Safety flags extracted and reviewed immediately
- **Type Safety**: Zod validation at every input layer
- **Error Handling**: Descriptive validation errors for debugging

---

## Monitoring & Logging

```typescript
logger.info("Starting LLM evaluation pipeline");
logger.info("Session validated successfully");
logger.info("Gemini LLM evaluation complete", { durationMs: 1200 });
logger.info("Successfully created analyzed session for session ID: 42");
```

Monitor: evaluation latency, error rates, session processing volume, API performance

---

## Future Enhancements

- Batch session processing for efficiency
- Custom evaluation rubrics per program
- Supervisor performance analytics
- Automated escalation workflows
- Multi-language support
- Mobile app for on-the-go review

---

**Built with ❤️ for youth mental health at scale.**
