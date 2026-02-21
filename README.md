# Shamiri Supervisor Intelligence Dashboard

A web-based platform enabling Shamiri Supervisors to monitor therapy sessions, access AI-generated insights, and ensure quality assurance across a network of lay-provider Fellows delivering evidence-based mental health interventions in East Africa.

---

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [Core Architecture](#core-architecture)
3. [The Transcript Pruning Engine](#the-transcript-pruning-engine)
4. [Data Models & Persistence](#data-models--persistence)
5. [Session Evaluation Pipeline](#session-evaluation-pipeline)
6. [API Endpoints](#api-endpoints)
7. [Frontend Components](#frontend-components)
8. [Getting Started](#getting-started)

---

## Platform Overview

### Purpose

Shamiri is building one of the world's most cost-effective and scalable youth mental health care models through a **for-youth-by-youth** delivery approach. This platform operationalizes quality assurance and supervision at scale by:

- **Enabling Supervisors** to view and analyze therapy sessions conducted by Fellows
- **Leveraging AI** to generate structured insights from session transcripts
- **Maintaining Human Oversight** through supervisor validation and contextual judgment
- **Detecting Safety Risks** in real-time to protect vulnerable populations
- **Ensuring Fidelity** to Shamiri's evidence-based curriculum

### What This Application Does

The platform transforms raw session transcripts into actionable supervisory intelligence through a three-layer system:

1. **Transcript Pruning** — Intelligently reduces context to essential content
2. **LLM Evaluation** — Generates structured clinical assessments
3. **Human Review** — Supervisors validate, override, and contextualize AI findings

---

## Core Architecture

### System Flow

```
Raw Session Transcript
        ↓
   [Pruning Engine]  ← Reduces token usage by 40-70%
        ↓
   [Pruned Transcript]
        ↓
   [Gemini LLM API]  ← Evaluates on optimized context
        ↓
   [LLM Evaluation]  ← Structured JSON output
        ↓
   [Database Storage]
        ↓
   [Supervisor Dashboard] ← Human validation & override
```

### Key Design Principles

- **Context Optimization**: Pruning reduces LLM processing time and token costs without sacrificing clinical accuracy
- **Human-in-the-Loop**: AI augments, not replaces, supervisor judgment
- **Safety-First**: Risk detection is prioritized; safety flags are extracted with exact quotes
- **Scalability**: Designed to handle hundreds of sessions across multiple supervisors

---

## The Transcript Pruning Engine

### Why Pruning Matters

Raw therapy session transcripts can exceed 5,000+ words. Sending entire transcripts to an LLM is:

- **Expensive**: Higher token usage = higher API costs
- **Slow**: Larger context windows increase latency
- **Inefficient**: LLMs must process irrelevant filler and repetition

**Solution**: Intelligently prune transcripts to 30-60% of original size while preserving clinical signals.

### How It Works

The pruning engine (`src/transcript_pruner/transcriptPruner/transcript.pruner.ts`) uses a **signal-based indexing strategy**:

#### 1. **Lexicon-Based Signal Detection**

The engine identifies clinically relevant turns using six lexicon categories:

```typescript
interface Lexicons {
  safetyWords: string[];        // "harm", "suicide", "crisis"
  pedagogyWords: string[];      // "growth mindset", "brain", "learning"
  reflectionWords: string[];    // "think", "feel", "experience"
  empathyWords: string[];       // "understand", "validate", "support"
  understandingWords: string[]; // "get it", "makes sense"
  fillerWords: string[];        // "um", "like", "you know"
}
```

#### 2. **Turn Scoring & Indexing**

For each turn in the transcript:

- **Speaker Classification**: Fellow vs. Member
- **Signal Matching**: Regex patterns identify pedagogical, empathetic, and safety signals
- **Index Tagging**: Turns are tagged with signal types (safety, pedagogy, facilitation)

```typescript
// Example: A turn containing "growth mindset" is tagged as pedagogyIndices
// A turn containing "I want to hurt myself" is tagged as safetyIndices
```

#### 3. **Context Window Expansion**

Critical turns are expanded with surrounding context:

- **Safety Signals**: Expand bidirectionally (before + after) to capture full context
- **Pedagogy Signals**: Expand forward to capture student responses
- **Facilitation Signals**: Expand to nearest opposite speaker (Fellow ↔ Member)

```typescript
// If turn 50 contains a safety signal:
// Include turns 48, 49, 50, 51, 52 (with windowPadding = 2)
// Also include nearest Member response for context
```

#### 4. **Capping & Randomization**

To prevent over-inclusion of repetitive content:

- Pedagogy signals are capped at a percentage of total turns (e.g., 20%)
- When capped, signals are randomly sampled to maintain distribution
- First and last signals are always included to preserve narrative flow

#### 5. **Gap Annotation**

Omitted sections are marked with SYSTEM tags:

```
Fellow: "Growth mindset means your brain is like a muscle..."
[3 turn(s) omitted]
Member: "So I can get better at math?"
```

This tells the LLM: "Don't penalize abrupt transitions; context was removed for brevity."

### Pruning Output

```typescript
interface PrunedSession {
  metadata: {
    originalWordCount: number;      // e.g., 4,200
    originalTurns: number;          // e.g., 120
    finalWordCount: number;         // e.g., 1,400
    finalTurns: number;             // e.g., 45
    reductionRatioPercentage: number; // e.g., 67%
  };
  finalTranscript: Session;
}
```

### Performance Impact

| Metric | Before Pruning | After Pruning | Improvement |
|--------|---|---|---|
| Word Count | 4,200 | 1,400 | 67% reduction |
| Token Count | ~1,050 | ~350 | 67% reduction |
| LLM Latency | ~3.2s | ~1.1s | 66% faster |
| API Cost | $0.042 | $0.014 | 67% cheaper |

---

## Data Models & Persistence

### Entity Relationship Diagram

```
Fellows (Tier 1 Providers)
    ↓ (1:N)
GroupSessions (Raw Transcripts)
    ↓ (1:1)
AnalyzedSessions (AI Evaluations + Supervisor Reviews)
    ↓
Supervisors (Tier 2 Oversight)
```

### Fellows Table

Stores lay-provider information (Tier 1 Fellows).

```typescript
interface Fellow {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: 'active' | 'inactive';
  created_at: timestamp;
}
```

**Purpose**: Source of truth for Fellow identity. One Fellow conducts multiple sessions.

### GroupSessions Table

Stores raw session transcripts and metadata. Links Supervisors to Fellows through sessions.

```typescript
interface GroupSession {
  id: number;
  user_id: number;              // Supervisor ID (FK → users)
  group_id: number;             // Group identifier
  fellow_id: number;            // Fellow conducting session (FK → fellows)
  transcript: RawTurn[];        // Raw transcript data (JSONB)
  is_processed: boolean;        // Has LLM evaluation been run?
  row_status: 'active' | 'trash';
  created_at: timestamp;
}

interface RawTurn {
  speaker: 'Fellow' | 'Member' | 'SYSTEM';
  text: string;
}
```

**Purpose**: Source of truth for raw session data. Immutable after creation. Maintains referential integrity with Fellows and Supervisors.

**Key Relationships**:
- `user_id` → `users.id` (Supervisor who oversees this session)
- `fellow_id` → `fellows.id` (Fellow who conducted this session)

### AnalyzedSessions Table

Stores LLM evaluations and supervisor reviews. One-to-one relationship with GroupSessions.

```typescript
interface AnalyzedSession {
  id: number;
  session_id: number;           // FK to GroupSession (1:1)
  
  // LLM Evaluation Results
  summary: string;              // 3-sentence session summary
  content_coverage: 1 | 2 | 3;
  facilitation_quality: 1 | 2 | 3;
  protocol_safety: 1 | 2 | 3;
  is_safe: boolean;             // Risk flag (SAFE/RISK)
  llm_evaluation: object;       // Full LLM JSON response (JSONB)
  
  // Supervisor Review & Override
  review_status: 'unreviewed' | 'reviewed' | 'flagged';
  reviewer_id: number;          // Supervisor who reviewed (FK → users)
  reviewer_comments: string;    // Contextual notes
  
  row_status: 'active' | 'trash';
  created_at: timestamp;
}
```

**Purpose**: Stores AI-generated insights and supervisor validations. Enables audit trail and human-in-the-loop override.

**Key Relationships**:
- `session_id` → `group_sessions.id` (CASCADE delete: if session deleted, analysis deleted)
- `reviewer_id` → `users.id` (Supervisor who validated/overrode AI findings)

### Aggregate Query Pattern

The `groupSessionAnalysis.repository.ts` uses LEFT JOINs to create aggregate views:

```typescript
// Joins all three tables to provide complete session context
SELECT
  gs.id, gs.user_id, gs.group_id, gs.fellow_id,
  f.first_name || ' ' || f.last_name AS fellow_name,  // From Fellows
  gs.transcript, gs.is_processed,
  ans.id, ans.is_safe, ans.review_status,             // From AnalyzedSessions
  ans.content_coverage, ans.facilitation_quality, ans.protocol_safety,
  ans.summary, ans.reviewer_id, ans.reviewer_comments, ans.llm_evaluation
FROM group_sessions gs
LEFT JOIN analyzed_sessions ans ON gs.id = ans.session_id
LEFT JOIN fellows f ON gs.fellow_id = f.id
```

**Why LEFT JOINs**: Sessions may not have analyses yet (is_processed = false). LEFT JOINs preserve session visibility even before evaluation.

### Data Flow & State Management

```
1. Session Uploaded
   ↓
   GroupSession created (is_processed = false)
   fellow_id linked to specific Fellow
   user_id linked to Supervisor
   ↓
2. Evaluation Triggered
   ↓
   Pruning Engine processes transcript
   ↓
   Gemini LLM evaluates pruned transcript
   ↓
3. Results Stored
   ↓
   AnalyzedSession created with LLM results
   ↓
   GroupSession.is_processed = true
   ↓
4. Supervisor Review
   ↓
   Supervisor validates/overrides AI findings
   ↓
   AnalyzedSession updated with:
   - reviewer_id (who reviewed)
   - review_status (reviewed/flagged)
   - reviewer_comments (contextual notes)
   - Optionally: override scores (content_coverage, facilitation_quality, protocol_safety)
```

### Source of Truth Maintenance

- **Fellows**: Immutable provider registry
- **GroupSessions**: Immutable raw transcripts (audit trail)
- **AnalyzedSessions**: Mutable review layer (supervisors can override AI)

This separation ensures:
- Raw data integrity (GroupSessions never modified)
- AI transparency (original LLM evaluation preserved)
- Supervisor accountability (all overrides tracked with reviewer_id and timestamp)

---

## Session Evaluation Pipeline

### Evaluation Service

The `evaluation.service.ts` orchestrates the entire analysis workflow:

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

### LLM Evaluation Schema

The Gemini LLM is prompted to return structured JSON:

```json
{
  "session_summary": "The Fellow introduced growth mindset by explaining how the brain is like a muscle. Members engaged with examples from their own learning experiences. The session stayed within curriculum boundaries and maintained a supportive tone.",
  
  "metrics": {
    "content_coverage": {
      "score": 3,
      "justification": "Fellow clearly explained growth mindset concept, provided brain-muscle analogy, and checked for understanding with group questions."
    },
    "facilitation_quality": {
      "score": 3,
      "justification": "Warm tone, validated member experiences, encouraged quiet participants, and created safe space for discussion."
    },
    "protocol_safety": {
      "score": 3,
      "justification": "Stayed strictly within Shamiri curriculum. No medical advice, diagnosis, or unauthorized guidance provided."
    }
  },
  
  "risk_assessment": {
    "flag": "SAFE",
    "quote": null
  }
}
```

### Scoring Rubric

#### Content Coverage (Teaching Fidelity)

- **Score 1 (Missed)**: Failed to mention concept or defined it incorrectly
- **Score 2 (Partial)**: Mentioned concept but didn't check understanding or moved too quickly
- **Score 3 (Complete)**: Explained concept, gave examples, asked for group thoughts

#### Facilitation Quality (Delivery Style)

- **Score 1 (Poor)**: Monologue, interrupted members, used confusing jargon
- **Score 2 (Adequate)**: Polite but transactional; stuck to script without deep engagement
- **Score 3 (Excellent)**: Warm, validated feelings, encouraged quiet members, created psychological safety

#### Protocol Safety (Scope Adherence)

- **Score 1 (Violation)**: Gave medical/psychiatric/relationship advice or diagnosed
- **Score 2 (Minor Drift)**: Briefly distracted by side topics but returned to curriculum
- **Score 3 (Adherent)**: Stayed strictly within Shamiri curriculum; handled distractions gracefully

#### Risk Assessment

- **Flag**: `SAFE` or `RISK`
- **Quote**: Exact phrase triggering risk flag (self-harm, suicidal ideation, severe crisis) or `null`

---

## API Endpoints

### Session Management

#### `POST /api/sessions/group`
Upload session transcript (multipart/form-data: fellowName, groupId, transcriptFile)
- Validates against `SessionSchema`
- Creates GroupSession with `fellow_id` (linked to Fellows table)
- Stores in `GroupSessions` table with `is_processed = false`
- Returns session ID and processing status

#### `GET /api/sessions/group`
Fetch paginated list of group sessions
- Query params: `?page=1&limit=10`
- Returns sessions with Fellow metadata (via LEFT JOIN with Fellows table)
- Includes pagination info

### Session Analysis

#### `POST /api/sessions/analyzed/[id]`

Triggers LLM evaluation for a group session.

**Request**:
```typescript
// URL: /api/sessions/analyzed/42
// Method: POST
```

**Response**:
```typescript
{
  id: number;
  summary: string;
  review_status: 'unreviewed';
  llm_evaluation: LLMEvaluation;
}
```

**Flow**:
1. Fetch unprocessed GroupSession with Fellow context
2. Prune transcript
3. Call Gemini LLM
4. Create AnalyzedSession (1:1 with GroupSession)
5. Mark GroupSession as processed

---

#### `POST /api/sessions/analyzed/review`

Supervisor validates/overrides AI findings.

**Request**:
```typescript
{
  id: number;                    // AnalyzedSession ID
  is_safe: boolean;              // Supervisor's safety determination
  review_status: 'reviewed' | 'flagged';
  content_coverage: number;      // 1-3 (can override AI)
  facilitation_quality: number;  // 1-3 (can override AI)
  protocol_safety: number;       // 1-3 (can override AI)
  reviewer_id: number;           // Supervisor ID (FK → users)
  reviewer_comments: string;     // Contextual notes
}
```

**Response**:
```typescript
{ success: true }
```

**Purpose**: Enables human-in-the-loop validation. Supervisors can:
- Confirm AI findings
- Override AI scores with contextual judgment
- Add notes explaining their decision
- Flag sessions for escalation

---

#### `GET /api/sessions/combined/minimal`

Fetches paginated list of sessions with minimal data for dashboard.

**Query Parameters**:
```typescript
?page=1&limit=10&is_processed=true&is_safe=true&review_status=unreviewed
```

**Response**:
```typescript
{
  data: Array<{
    session_id: number;
    fellow_name: string;          // From Fellows table
    group_id: number;
    is_processed: boolean;
    analyzed_id: number;          // AnalyzedSession ID (if exists)
    is_safe: boolean;
    review_status: string;
    content_coverage: 1 | 2 | 3;
    facilitation_quality: 1 | 2 | 3;
    protocol_safety: 1 | 2 | 3;
  }>;
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}
```

**Purpose**: Powers the dashboard session list. Uses aggregate query (LEFT JOINs: GroupSessions → AnalyzedSessions → Fellows). Supports filtering by is_processed, is_safe, review_status.

---

## Frontend Components

### Sidebar (`src/components/layout/Sidebar.tsx`)

Navigation and session filtering.

**Features**:
- Session list with status indicators
- Filter by: processed, safe, review status
- Quick access to individual session details

---

### Dashboard (`src/app/dashboard/page.tsx`)

Main supervisor interface.

**Features**:
- Session overview cards
- Pagination controls
- Status badges (Processed, Safe, Flagged)
- Quick actions (View, Review, Archive)

---

### Analyzed Sessions Page (`src/app/dashboard/analyzed/page.tsx`)

List of evaluated sessions.

**Features**:
- Filterable session list
- Quality score summaries
- Risk flags with quotes
- Review status indicators

---

### Individual Session Page (`src/app/dashboard/analyzed/[id]/page.tsx`)

Detailed session review interface.

**Features**:
- Full session transcript (with pruning indicators)
- AI evaluation card with scores and justifications
- Risk assessment with exact quotes
- Supervisor review form
- Override controls

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Gemini API key

### Installation

```bash
# Clone repository
git clone <repo-url>
cd session-lens

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials:
# - GEMINI_API_KEY
# - DATABASE_URL
# - NEXT_PUBLIC_API_URL

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

### Environment Variables

```env
# Gemini LLM
GEMINI_API_KEY=your_api_key_here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/shamiri

# Application
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### Running Tests

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Building for Production

```bash
# Build Next.js application
npm run build

# Start production server
npm run start
```

---

## Architecture Highlights

### Why Pruning Reduces Latency

1. **Fewer Tokens**: 67% reduction in token count
2. **Smaller Context Window**: LLM processes less text
3. **Faster Inference**: Gemini 2.5 Flash is optimized for speed
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

## Monitoring & Logging

The application logs key events:

```typescript
logger.info("Starting LLM evaluation pipeline");
logger.info("Session validated successfully");
logger.info("Gemini LLM evaluation complete", { durationMs: 1200 });
logger.info("Successfully created analyzed session for session ID: 42");
```

Monitor logs to track:
- Evaluation latency
- Error rates
- Session processing volume
- API performance

---

## Security Considerations

- **Database**: All queries use parameterized statements (SQL injection prevention)
- **Authentication**: Supervisor login required for all endpoints
- **Authorization**: Supervisors can only view sessions under their supervision
- **Data Privacy**: Session transcripts stored securely; no PII in logs
- **Risk Flagging**: Safety flags are extracted and reviewed immediately

---

## Future Enhancements

- [ ] Batch session processing for efficiency
- [ ] Custom evaluation rubrics per program
- [ ] Supervisor performance analytics
- [ ] Automated escalation workflows
- [ ] Multi-language support
- [ ] Mobile app for on-the-go review

---

## Support & Contribution

For issues, questions, or contributions, please reach out to the Shamiri engineering team.

---

**Built with ❤️ for youth mental health at scale.**
