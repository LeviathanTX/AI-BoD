# AI Employee Team Architecture
## Your Company's AI Executive Team + Advisory Board

> **Vision**: Build your own AI executive team (CEO, CTO, CFO, VP Sales, etc.) who work together to solve your business challenges. They consult the celebrity advisory board when they need outside expertise.

---

## 🎯 Core Concept: Two-Tier System

### Tier 1: Your AI Employee Team (Internal Agents)
**Role**: Day-to-day decision making, execution, internal deliberation

```
Your Company
├─ 🎯 CEO/Founder Agent (You)
│   └─ Strategic decisions, final calls, team coordination
├─ 💻 CTO/Tech Lead
│   └─ Architecture, tech stack, engineering roadmap
├─ 📈 VP Sales / Growth
│   └─ GTM strategy, pipeline, customer acquisition
├─ 💰 CFO/Finance
│   └─ Cash flow, metrics, financial modeling
├─ 🎨 Head of Product
│   └─ Roadmap, features, user research
├─ 👥 VP People/HR
│   └─ Hiring, culture, team management
└─ 🔧 VP Operations
    └─ Processes, efficiency, scaling
```

**Personality**: Direct, action-oriented, context-aware of YOUR company
**Cost Model**: Amazon Nova Micro ($0.035/M tokens) - cheap enough to "work 24/7"

### Tier 2: Advisory Board (External Consultants)
**Role**: Strategic guidance, outside perspective, expertise on-demand

```
Advisory Board (existing celebrity/professional advisors)
├─ 🐻 Reed Pawffman (Network effects, strategic thinking)
├─ 🐻 Jason Clawcanis (Angel investing, fundraising)
├─ 🐻 Cheryl Sandbearg (Scaling operations)
├─ 🐻 Marc Beardreessen (Tech vision, platforms)
└─ 30+ specialized advisors...
```

**When consulted**: Complex decisions, disagreements, outside expertise needed
**Cost Model**: Premium models (GPT-5.2, Claude Sonnet, Mistral) - used sparingly

---

## 📊 Orchestration Flow: "Team Meeting → Board Consultation"

### Example: "Should we add enterprise features or focus on SMB?"

```
┌────────────────────────────────────────────────────────────────┐
│ USER INPUT                                                      │
│ "Should we add enterprise features or focus on SMB growth?"    │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ STEP 1: INTERNAL TEAM MEETING (Parallel - Nova Micro)         │
│                                                                 │
│ 🎯 CEO Agent: "This is a classic prioritization challenge.     │
│               Let me hear from the team before I decide."      │
│                                                                 │
│ 💻 CTO: "Enterprise = 6 months: SSO, RBAC, audit logs,        │
│          security compliance. SMB = 1 month: self-serve."     │
│                                                                 │
│ 📈 VP Sales: "Our fastest deals are SMB ($5K ACV, 30-day      │
│              cycle). Enterprise is $100K but 9-month cycle."  │
│                                                                 │
│ 💰 CFO: "We have 8 months runway. Enterprise = longer path     │
│          to revenue. SMB = faster cash generation."           │
│                                                                 │
│ 🎨 Head of Product: "Our product is built for SMB. Enterprise │
│                      means rebuilding core architecture."     │
│                                                                 │
│ INTERNAL CONSENSUS: 3 of 4 lean SMB, but CTO flags risk       │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ STEP 2: CEO AGENT DECISION LOGIC                              │
│                                                                 │
│ IF: Team has strong consensus (4/4 or 3/4)                    │
│   → RECOMMEND TO USER (skip advisory board)                   │
│                                                                 │
│ IF: Team is split (2/2) OR high-stakes (>$100K impact)        │
│   → CONSULT ADVISORY BOARD                                     │
│                                                                 │
│ Decision: Team leans SMB, but CTO raised valid concern        │
│ Action: Consult board on "timing" question                    │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ STEP 3: ADVISORY BOARD CONSULTATION (Selective - Premium $$$) │
│                                                                 │
│ CEO Agent asks board:                                          │
│ "My team says focus SMB now, but we have 3 enterprise         │
│  prospects at $100K each. Is this the right call?"            │
│                                                                 │
│ 🐻 Jason Clawcanis (Angel/Fundraising):                        │
│ "SMB land-and-expand worked for Zoom, Slack, Dropbox. Build   │
│  bottom-up, then add enterprise later. BUT if those 3          │
│  prospects are Fortune 500 with reference value, take them."   │
│                                                                 │
│ 🐻 Cheryl Sandbearg (Operations):                              │
│ "Can you serve both? No. Pick one. With 8mo runway, you       │
│  can't afford 9-month enterprise cycles. Go SMB unless        │
│  those 3 deals close in 60 days."                             │
│                                                                 │
│ 🐻 Reed Pawffman (Strategy):                                   │
│ "What's your network effect play? SMB creates viral loops.     │
│  Enterprise = sales-driven, no network effects. Long-term,    │
│  SMB wins for platforms."                                      │
│                                                                 │
│ BOARD CONSENSUS: 3/3 say SMB, unless enterprise closes fast   │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ STEP 4: CEO AGENT FINAL SYNTHESIS                             │
│                                                                 │
│ "Here's my recommendation based on our internal team meeting  │
│  and advisory board consultation:                             │
│                                                                 │
│  ✅ DECISION: Focus SMB for next 6 months                      │
│                                                                 │
│  📋 RATIONALE:                                                 │
│  • Internal team (3/4) says SMB faster to revenue             │
│  • Advisory board (3/3) says SMB enables network effects      │
│  • Our 8-month runway requires fast cash generation           │
│  • Enterprise prospects are too slow unless they close in 60d │
│                                                                 │
│  🚨 CONTINGENCY:                                               │
│  IF those 3 enterprise prospects commit to 60-day close,      │
│  revisit this decision (VP Sales to pressure-test timeline)   │
│                                                                 │
│  📈 NEXT ACTIONS:                                              │
│  [ ] CTO: Finalize SMB self-serve architecture (2 weeks)      │
│  [ ] VP Sales: Focus pipeline 100% on SMB for Q2              │
│  [ ] CFO: Model SMB growth to $50K MRR (share by Friday)      │
│  [ ] CEO (You): Decide on enterprise prospects by EOW         │
│                                                                 │
│  💾 Logged to company memory: "2026 Q1 Strategy - SMB Focus"  │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                      USER APPROVES OR ADJUSTS
```

---

## 🏗️ Architecture: AWS Step Functions Workflow

### State Machine: "AI Employee Team Meeting"

```yaml
StateMachine: AI-Employee-Team-Meeting
StartAt: IntentClassification

States:
  # ── STEP 1: Classify the user's question ──
  IntentClassification:
    Type: Task
    Resource: arn:aws:lambda:us-east-1:xxx:function:IntentClassifier
    # Uses Nova Micro to classify: strategic, tactical, financial, technical, hiring, etc.
    Next: AssignRelevantEmployees
  
  # ── STEP 2: Select which AI employees should weigh in ──
  AssignRelevantEmployees:
    Type: Task
    Resource: arn:aws:lambda:us-east-1:xxx:function:EmployeeSelector
    # Strategic question? CEO + CTO + CFO
    # Hiring question? CEO + VP People
    # Product roadmap? CEO + CTO + Head of Product + VP Sales
    Next: InternalTeamMeeting
  
  # ── STEP 3: Run internal team meeting (parallel AI employee calls) ──
  InternalTeamMeeting:
    Type: Parallel
    Branches:
      - StartAt: CallCEOAgent
        States:
          CallCEOAgent:
            Type: Task
            Resource: arn:aws:lambda:us-east-1:xxx:function:AIEmployeeCaller
            Parameters:
              employee_role: "CEO"
              model: "amazon.nova-micro-v1:0"
            End: true
      
      - StartAt: CallCTOAgent
        States:
          CallCTOAgent:
            Type: Task
            Resource: arn:aws:lambda:us-east-1:xxx:function:AIEmployeeCaller
            Parameters:
              employee_role: "CTO"
              model: "amazon.nova-micro-v1:0"
            End: true
      
      - StartAt: CallCFOAgent
        States:
          CallCFOAgent:
            Type: Task
            Resource: arn:aws:lambda:us-east-1:xxx:function:AIEmployeeCaller
            Parameters:
              employee_role: "CFO"
              model: "amazon.nova-micro-v1:0"
            End: true
      
      # ... VP Sales, Head of Product, etc.
    
    Next: AnalyzeConsensus
  
  # ── STEP 4: CEO Agent analyzes team consensus ──
  AnalyzeConsensus:
    Type: Task
    Resource: arn:aws:lambda:us-east-1:xxx:function:ConsensusAnalyzer
    # CEO agent reviews all responses, detects:
    # - Strong consensus (4/4)? Skip board, recommend directly
    # - Split decision (2/2)? Consult board
    # - High-stakes (>$100K impact)? Consult board
    # - Novel situation (no past precedent)? Consult board
    Next: NeedsBoardConsultation
  
  # ── STEP 5: Decision point - consult board or not? ──
  NeedsBoardConsultation:
    Type: Choice
    Choices:
      - Variable: $.needsBoard
        BooleanEquals: true
        Next: SelectBoardAdvisors
      - Variable: $.needsBoard
        BooleanEquals: false
        Next: CEOFinalSynthesis
  
  # ── STEP 6A: Select relevant board advisors (if needed) ──
  SelectBoardAdvisors:
    Type: Task
    Resource: arn:aws:lambda:us-east-1:xxx:function:BoardAdvisorSelector
    # CEO agent picks 2-3 advisors from the 30+ available
    # Fundraising question? → Jason Clawcanis
    # Network effects? → Reed Pawffman
    # Scaling ops? → Cheryl Sandbearg
    Next: BoardConsultation
  
  # ── STEP 6B: Call advisory board (parallel premium model calls) ──
  BoardConsultation:
    Type: Parallel
    Branches:
      - StartAt: CallAdvisor1
        States:
          CallAdvisor1:
            Type: Task
            Resource: arn:aws:lambda:us-east-1:xxx:function:BoardAdvisorCaller
            # Uses premium models: GPT-5.2, Claude Sonnet, Mistral
            End: true
      
      - StartAt: CallAdvisor2
        States:
          CallAdvisor2:
            Type: Task
            Resource: arn:aws:lambda:us-east-1:xxx:function:BoardAdvisorCaller
            End: true
    
    Next: CEOFinalSynthesis
  
  # ── STEP 7: CEO Agent synthesizes final recommendation ──
  CEOFinalSynthesis:
    Type: Task
    Resource: arn:aws:lambda:us-east-1:xxx:function:CEOSynthesizer
    # CEO agent combines:
    # - Internal team discussion
    # - Board advisor input (if consulted)
    # - Past company decisions (memory)
    # Produces: Decision + Rationale + Next Actions + Contingencies
    Next: UpdateMemory
  
  # ── STEP 8: Store to company memory ──
  UpdateMemory:
    Type: Task
    Resource: arn:aws:lambda:us-east-1:xxx:function:MemoryUpdater
    # Stores:
    # - Decision made
    # - Who weighed in
    # - Reasoning
    # - Action items
    # To: PostgreSQL + OpenSearch (vector embeddings)
    Next: NotifyUser
  
  # ── STEP 9: Return to user ──
  NotifyUser:
    Type: Succeed
```

---

## 🧠 AI Employee Profiles

### 🎯 CEO/Founder Agent (Primary Decision Maker)

**Name**: "Alex" (neutral, represents you)
**Model**: Amazon Nova Pro ($0.80/M in, $3.20/M out)
**Role**: Orchestrates the team, makes final calls, consults board when needed

**System Prompt**:
```
You are Alex, the CEO of this company. You lead a team of AI executives 
who help you run the business.

YOUR LEADERSHIP STYLE:
• Decisive but consultative - you listen to your team, then decide
• Data-driven - you demand specifics (metrics, timelines, costs)
• Risk-aware - you balance bold moves with runway constraints
• Context-aware - you remember past decisions and their outcomes

YOUR TEAM:
• CTO: Technical architecture and engineering
• CFO: Financial modeling and metrics
• VP Sales: Growth and revenue
• Head of Product: Roadmap and features
• VP People: Hiring and culture
• VP Ops: Processes and efficiency

YOUR ADVISORY BOARD (consult when team is split or high-stakes):
• Reed Pawffman: Network effects, strategic thinking (GPT-5.2)
• Jason Clawcanis: Angel investing, fundraising (Mistral)
• Cheryl Sandbearg: Scaling operations (Nova Pro)
• 30+ specialized advisors for deep expertise

DECISION FRAMEWORK:
1. Pose question to relevant team members
2. Analyze responses for consensus/disagreement
3. If consensus: Make decision, assign actions
4. If split OR high-stakes: Consult 2-3 board advisors
5. Synthesize: Decision + Rationale + Actions + Contingencies

COMPANY CONTEXT (loaded from memory):
{user_company_context}

Remember: You're not just answering questions - you're running a company.
Every decision affects runway, team morale, customer trust, and future options.
```

### 💻 CTO/Tech Lead Agent

**Name**: "Morgan"
**Model**: Amazon Nova Micro ($0.035/M in, $0.14/M out)
**Role**: Technical decisions, architecture, engineering roadmap

**System Prompt**:
```
You are Morgan, the CTO of this company. You're part of an AI executive team.

YOUR RESPONSIBILITIES:
• Technical architecture and stack decisions
• Engineering roadmap and sprint planning
• Build vs buy decisions
• Security, scalability, technical debt
• Engineering team management

YOUR PERSPECTIVE:
• Technical feasibility trumps wishful thinking
• You flag time estimates (CEO often underestimates complexity)
• You advocate for technical excellence but acknowledge business constraints
• You think in: weeks of eng work, technical risk, maintainability

COMMUNICATION STYLE:
• Direct and specific: "This will take 6 weeks, not 2"
• Risk-aware: "This approach is fast but creates tech debt"
• Solution-oriented: "Can't do X, but here's Y alternative"
• Engineering-first: "This breaks our current architecture"

COMPANY TECH STACK (loaded from memory):
{user_tech_context}

When the CEO asks your opinion, you represent the engineering perspective.
Be honest about tradeoffs - the team needs your technical judgment.
```

### 💰 CFO/Finance Agent

**Name**: "Jordan"
**Model**: Amazon Nova Micro
**Role**: Financial modeling, metrics, cash flow

**System Prompt**:
```
You are Jordan, the CFO of this company. You're part of an AI executive team.

YOUR RESPONSIBILITIES:
• Cash flow modeling and burn rate tracking
• Revenue projections and unit economics
• Fundraising strategy and timing
• Financial metrics (CAC, LTV, payback period)
• Scenario planning (best/worst case)

YOUR PERSPECTIVE:
• Numbers don't lie - you ground discussions in metrics
• Runway is sacred - every decision impacts months remaining
• You flag financial risks before they become crises
• You model "what if" scenarios obsessively

COMMUNICATION STYLE:
• Quantitative: "This decision costs $X and delays profitability by Y months"
• Scenario-driven: "Best case: ... Worst case: ... Most likely: ..."
• Risk-focused: "We have 8 months runway. This extends it to 12 OR reduces it to 5"
• ROI-obsessed: "What's the payback period on this investment?"

COMPANY FINANCIALS (loaded from memory):
{user_financial_context}

When the CEO asks your opinion, you represent the financial reality check.
Be the voice of fiscal discipline - the team needs your financial judgment.
```

### 📈 VP Sales/Growth Agent

**Name**: "Taylor"
**Model**: Amazon Nova Micro
**Role**: GTM strategy, pipeline, customer acquisition

**System Prompt**:
```
You are Taylor, the VP Sales of this company. You're part of an AI executive team.

YOUR RESPONSIBILITIES:
• Go-to-market strategy and execution
• Sales pipeline and conversion rates
• Customer acquisition channels (paid, organic, partnerships)
• Pricing and packaging strategy
• Competitive positioning

YOUR PERSPECTIVE:
• Revenue solves most problems - growth is oxygen
• You know what customers actually want (not what founders think they want)
• You flag when product/pricing misalignment kills deals
• You're aggressive but realistic about pipeline conversion

COMMUNICATION STYLE:
• Pipeline-driven: "We have $X pipeline, Y% typically closes"
• Customer-voice: "Enterprise buyers keep asking for SSO"
• Competitive-aware: "Competitor Z just launched this feature"
• Conversion-focused: "This change will increase close rate by X%"

COMPANY SALES DATA (loaded from memory):
{user_sales_context}

When the CEO asks your opinion, you represent the revenue perspective.
Be the voice of growth - the team needs your sales judgment.
```

### 🎨 Head of Product Agent

**Name**: "Casey"
**Model**: Amazon Nova Micro
**Role**: Product roadmap, features, user research

**System Prompt**:
```
You are Casey, the Head of Product of this company. You're part of an AI executive team.

YOUR RESPONSIBILITIES:
• Product roadmap and prioritization
• Feature development and user research
• Product-market fit validation
• User experience and design decisions
• Backlog management

YOUR PERSPECTIVE:
• Users care about outcomes, not features
• You balance "what users ask for" vs "what they actually need"
• You advocate for simplicity and focus
• You kill features that don't move core metrics

COMMUNICATION STYLE:
• User-focused: "Users churn because of X, not Y"
• Metrics-driven: "This feature increases retention by X%"
• Ruthless prioritization: "We should kill feature A to ship feature B"
• Vision + execution: "Here's the 6-month roadmap to PMF"

COMPANY PRODUCT DATA (loaded from memory):
{user_product_context}

When the CEO asks your opinion, you represent the product perspective.
Be the voice of the user - the team needs your product judgment.
```

---

## 📊 Memory System: "Company Brain"

### What Gets Stored
```typescript
interface CompanyMemory {
  // ── CORE COMPANY CONTEXT ──
  company_stage: "pre-seed" | "seed" | "series-a" | "series-b+";
  industry: string;
  business_model: "B2B SaaS" | "B2C" | "Marketplace" | "E-commerce" | "Other";
  team_size: number;
  runway_months: number;
  monthly_burn: number;
  
  // ── CURRENT METRICS ──
  mrr: number;
  arr: number;
  growth_rate_mom: number;
  cac: number;
  ltv: number;
  churn_rate: number;
  
  // ── TECH STACK ──
  tech_stack: {
    frontend: string[];
    backend: string[];
    database: string[];
    infrastructure: string[];
  };
  
  // ── PAST DECISIONS ──
  decisions: Array<{
    date: Date;
    question: string;
    decision: string;
    rationale: string;
    outcome?: "success" | "failure" | "too_early";
    who_decided: string[]; // Which AI employees + advisors weighed in
  }>;
  
  // ── STRATEGIC PRIORITIES ──
  current_priorities: string[];
  okrs: Array<{
    objective: string;
    key_results: string[];
    progress: number; // 0-100%
  }>;
  
  // ── TEAM LEARNING ──
  ai_employee_track_record: {
    [employee: string]: {
      recommendations: number;
      followed: number;
      success_rate: number;
    };
  };
}
```

### Memory Retrieval at Query Time
```typescript
async function getRelevantContext(
  userId: string,
  question: string
): Promise<CompanyMemory> {
  // 1. Fetch base company context (PostgreSQL)
  const baseContext = await supabase
    .from('company_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  // 2. Vector search for similar past decisions (OpenSearch)
  const questionEmbedding = await generateEmbedding(question);
  const similarDecisions = await opensearch.search({
    index: 'company-decisions',
    body: {
      query: {
        knn: {
          embedding: {
            vector: questionEmbedding,
            k: 5 // Top 5 most similar past decisions
          }
        }
      }
    }
  });
  
  // 3. Fetch recent metrics (PostgreSQL)
  const recentMetrics = await supabase
    .from('company_metrics')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);
  
  // 4. Combine into unified context
  return {
    ...baseContext,
    recent_metrics: recentMetrics[0],
    similar_past_decisions: similarDecisions.hits.hits.map(h => h._source)
  };
}
```

---

## 💰 Cost Model: Two-Tier Economics

### Per Team Meeting (Internal Only - No Board)
```
Intent classification (Nova Micro):       $0.0001
Memory retrieval (OpenSearch):            $0.0010
Employee selection logic (Nova Micro):    $0.0002
AI Employee calls (5 parallel, Nova Micro):
  - CEO Agent:                            $0.0015
  - CTO Agent:                            $0.0015
  - CFO Agent:                            $0.0015
  - VP Sales Agent:                       $0.0015
  - Head of Product Agent:                $0.0015
CEO Consensus Analysis (Nova Pro):        $0.0040
CEO Final Synthesis (Nova Pro):           $0.0040
Memory Update (OpenSearch):               $0.0010
────────────────────────────────────────────────
TOTAL (internal team only):               ~$0.018
```

### Per Team Meeting (With Board Consultation)
```
Internal team meeting (above):            $0.018
Board advisor selection (Nova Micro):     $0.0002
Board advisor calls (3 parallel, premium):
  - Jason Clawcanis (Mistral Large):      $0.0050
  - Reed Pawffman (GPT-5.2):              $0.0150
  - Cheryl Sandbearg (Nova Pro):          $0.0030
CEO Final Synthesis (Nova Pro):           $0.0040
────────────────────────────────────────────────
TOTAL (with board consultation):          ~$0.045
```

### Key Insight
- **80% of decisions**: Internal team only ($0.018/meeting)
- **20% of decisions**: Require board ($0.045/meeting)
- **Blended cost**: $0.0234/meeting (73% cheaper than current)

**At scale**:
- 1000 users × 15 meetings/month = 15,000 meetings
- Cost: $351/month (vs $675 current = 48% savings)

---

## 🚀 Phase 1 Implementation (Week 1)

### Day 1-2: AWS Infrastructure Setup

#### 1. Step Functions State Machine
```bash
cd ~/Projects/ai-bod
mkdir -p infrastructure/orchestration

# Create state machine definition
cat > infrastructure/orchestration/team-meeting-state-machine.json <<EOF
{
  "Comment": "AI Employee Team Meeting Orchestration",
  "StartAt": "IntentClassification",
  "States": {
    ... (state machine from above)
  }
}
EOF

# Deploy via AWS CLI
aws stepfunctions create-state-machine \
  --name "AI-Employee-Team-Meeting" \
  --definition file://infrastructure/orchestration/team-meeting-state-machine.json \
  --role-arn "arn:aws:iam::ACCOUNT:role/StepFunctionsExecutionRole"
```

#### 2. Lambda Functions Setup
```bash
mkdir -p lambdas/{intent-classifier,employee-selector,ai-employee-caller,consensus-analyzer,board-advisor-selector,board-advisor-caller,ceo-synthesizer,memory-updater}

# Install dependencies for all lambdas
cd lambdas/ai-employee-caller
npm init -y
npm install @aws-sdk/client-bedrock-runtime
```

#### 3. OpenSearch Serverless Cluster
```bash
# Create collection via AWS CLI
aws opensearchserverless create-collection \
  --name "ai-bod-company-memory" \
  --type "VECTORSEARCH"

# Create index with k-NN mapping
curl -X PUT \
  "https://[collection-id].us-east-1.aoss.amazonaws.com/company-decisions" \
  -H "Content-Type: application/json" \
  -d '{
    "settings": {
      "index.knn": true
    },
    "mappings": {
      "properties": {
        "user_id": { "type": "keyword" },
        "decision_text": { "type": "text" },
        "embedding": {
          "type": "knn_vector",
          "dimension": 1536
        },
        "timestamp": { "type": "date" },
        "outcome": { "type": "keyword" }
      }
    }
  }'
```

### Day 3-4: Core Lambda Functions

#### Lambda: AI Employee Caller
```typescript
// lambdas/ai-employee-caller/index.ts
import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

const bedrock = new BedrockRuntimeClient({ region: 'us-east-1' });

// AI Employee system prompts
const EMPLOYEE_PROMPTS = {
  CEO: `You are Alex, the CEO... (full prompt from above)`,
  CTO: `You are Morgan, the CTO... (full prompt from above)`,
  CFO: `You are Jordan, the CFO... (full prompt from above)`,
  VP_SALES: `You are Taylor, the VP Sales... (full prompt from above)`,
  HEAD_OF_PRODUCT: `You are Casey, the Head of Product... (full prompt from above)`,
};

export const handler = async (event: any) => {
  const {
    employee_role,
    question,
    company_context,
    past_decisions,
  } = event;
  
  // Get employee system prompt
  const systemPrompt = EMPLOYEE_PROMPTS[employee_role]
    .replace('{user_company_context}', JSON.stringify(company_context))
    .replace('{past_decisions}', JSON.stringify(past_decisions));
  
  // Call Bedrock (Nova Micro for employees)
  const response = await bedrock.send(new ConverseCommand({
    modelId: 'amazon.nova-micro-v1:0',
    messages: [{
      role: 'user',
      content: [{ text: question }]
    }],
    system: [{ text: systemPrompt }],
    inferenceConfig: {
      maxTokens: 1000,
      temperature: 0.7,
    }
  }));
  
  return {
    employee_role,
    response: response.output.message.content[0].text,
    timestamp: new Date().toISOString(),
  };
};
```

#### Lambda: Consensus Analyzer
```typescript
// lambdas/consensus-analyzer/index.ts
import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

const bedrock = new BedrockRuntimeClient({ region: 'us-east-1' });

export const handler = async (event: any) => {
  const { employee_responses, question } = event;
  
  // CEO Agent analyzes consensus
  const analysisPrompt = `You are the CEO reviewing your team's responses to this question:
  
Question: ${question}

Team Responses:
${employee_responses.map((r: any) => `${r.employee_role}: ${r.response}`).join('\n\n')}

Analyze the team's consensus:
1. Are they aligned (3+ agree)?
2. Is this a high-stakes decision (>$100K impact, affects runway, strategic pivot)?
3. Is this a novel situation with no past precedent?

If ANY of these are true, we should consult the advisory board.

Return JSON:
{
  "needsBoard": true/false,
  "rationale": "why or why not",
  "stakesLevel": "low|medium|high",
  "consensusScore": 0-100
}`;

  const response = await bedrock.send(new ConverseCommand({
    modelId: 'amazon.nova-pro-v1:0', // CEO uses Nova Pro
    messages: [{ role: 'user', content: [{ text: analysisPrompt }] }],
    inferenceConfig: { maxTokens: 500, temperature: 0.3 }
  }));
  
  const analysis = JSON.parse(response.output.message.content[0].text);
  
  return {
    ...analysis,
    employee_responses, // Pass through for next step
  };
};
```

### Day 5: API Endpoint

```typescript
// api/v2/team-meeting.ts
import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';

const sfn = new SFNClient({ region: 'us-east-1' });

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { question, userId } = req.body;
  
  // Fetch company context
  const companyContext = await getCompanyContext(userId);
  
  // Start Step Functions execution
  const execution = await sfn.send(new StartExecutionCommand({
    stateMachineArn: process.env.TEAM_MEETING_STATE_MACHINE_ARN!,
    input: JSON.stringify({
      question,
      userId,
      companyContext,
      timestamp: new Date().toISOString(),
    })
  }));
  
  // Poll for completion (or use callback pattern)
  const result = await pollExecution(execution.executionArn);
  
  return res.status(200).json({
    executionId: execution.executionArn,
    result: result,
  });
}

async function getCompanyContext(userId: string) {
  // Fetch from Supabase + OpenSearch
  // (implementation from memory section above)
}

async function pollExecution(arn: string) {
  // Poll Step Functions until complete
  // (simple implementation - can optimize with EventBridge)
}
```

---

## 🎨 UI Preview: "Your AI Team Meeting"

```
┌─────────────────────────────────────────────────────────────┐
│ 💼 Ask Your Team                                   [Export] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ You: "Should we add enterprise features or focus on SMB?"  │
│                                                             │
│ ┌─ Your AI Executive Team is discussing... ───────────────┐│
│ │ 🎯 Alex (CEO)        [Listening to team...]             ││
│ │ 💻 Morgan (CTO)      [Analyzing...]                     ││
│ │ 💰 Jordan (CFO)      [Running numbers...]               ││
│ │ 📈 Taylor (VP Sales) [Checking pipeline...]             ││
│ │ 🎨 Casey (Product)   [Thinking...]                      ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ═══════════════════════════════════════════════════════   │
│ 📊 INTERNAL TEAM DISCUSSION                                │
│                                                             │
│ 💻 Morgan (CTO):                                            │
│ "Enterprise means 6 months of work: SSO, RBAC, audit logs. │
│  SMB is 1 month: self-serve onboarding. Given our 8-month │
│  runway, SMB is the only viable path."                     │
│                                                             │
│ 📈 Taylor (VP Sales):                                       │
│ "Our best deals are SMB: $5K ACV, 30-day cycle. Enterprise │
│  is $100K but takes 9 months. Pipeline says go SMB."       │
│                                                             │
│ 💰 Jordan (CFO):                                            │
│ "At $30K/month burn, enterprise's 9-month cycle is too     │
│  risky. SMB generates cash faster. Go SMB."                │
│                                                             │
│ 🎨 Casey (Product):                                         │
│ "Our product is built for SMB self-serve. Enterprise means │
│  rebuilding core architecture. That's 6+ months."          │
│                                                             │
│ 🎯 Alex (CEO):                                              │
│ "Team consensus is clear (4/4): SMB focus. But I see 3     │
│  enterprise prospects worth $300K. Let me consult the      │
│  board on timing..."                                        │
│                                                             │
│ ┌─ Consulting Advisory Board... ──────────────────────────┐│
│ │ 🐻 Jason Clawcanis  [Thinking...]                       ││
│ │ 🐻 Cheryl Sandbearg [Analyzing...]                      ││
│ │ 🐻 Reed Pawffman    [Strategizing...]                   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ═══════════════════════════════════════════════════════   │
│ 🐻 ADVISORY BOARD INPUT                                    │
│                                                             │
│ 🐻 Jason Clawcanis (Angel Investor):                       │
│ "SMB land-and-expand worked for Zoom, Slack. BUT if those │
│  3 prospects are Fortune 500 with reference value, take    │
│  them. Otherwise, go SMB."                                 │
│                                                             │
│ 🐻 Cheryl Sandbearg (Operations):                          │
│ "Can you serve both? No. With 8mo runway, you can't afford │
│  9-month enterprise cycles. Go SMB unless those 3 deals    │
│  close in 60 days."                                        │
│                                                             │
│ 🐻 Reed Pawffman (Strategy):                               │
│ "SMB creates network effects. Enterprise is sales-driven,  │
│  no viral loops. Long-term, SMB wins for platforms."       │
│                                                             │
│ ═══════════════════════════════════════════════════════   │
│ 🎯 CEO FINAL DECISION                                      │
│                                                             │
│ ✅ DECISION: Focus 100% on SMB for next 6 months          │
│                                                             │
│ 📋 RATIONALE:                                              │
│ • Internal team unanimous (4/4): SMB faster to revenue     │
│ • Advisory board (3/3): SMB enables network effects        │
│ • 8-month runway requires fast cash generation             │
│ • Enterprise prospects too slow unless 60-day close        │
│                                                             │
│ 🚨 CONTINGENCY:                                            │
│ IF those 3 enterprise prospects commit to 60-day close,    │
│ Taylor (VP Sales) will pressure-test timeline and we'll    │
│ revisit this decision.                                     │
│                                                             │
│ 📈 ACTION ITEMS:                                           │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ [ ] Morgan (CTO): Finalize SMB self-serve (2 wks)  │   │
│ │ [ ] Taylor (Sales): 100% SMB pipeline for Q2       │   │
│ │ [ ] Jordan (CFO): Model SMB → $50K MRR (Friday)    │   │
│ │ [ ] You (CEO): Decide on enterprise prospects (EOW)│   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ 💾 Saved to Company Memory: "2026 Q1 Strategy Decision"   │
│                                                             │
│ [✓ Approve Decision] [✏️ Adjust] [🔄 Re-Discuss]          │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Phase 1 Deliverables (End of Week 1)

1. **AWS Infrastructure**:
   - ✅ Step Functions state machine deployed
   - ✅ 8 Lambda functions (intent, employee caller, consensus, etc.)
   - ✅ OpenSearch Serverless cluster with k-NN index
   - ✅ IAM roles and permissions

2. **API Endpoint**:
   - ✅ `POST /api/v2/team-meeting`
   - ✅ Accepts: question + userId
   - ✅ Returns: team discussion + CEO decision + action items

3. **AI Employee System**:
   - ✅ 5 AI employees (CEO, CTO, CFO, VP Sales, Head of Product)
   - ✅ Each with distinct personality, system prompt, decision framework
   - ✅ All running on Nova Micro ($0.035/M tokens)

4. **Orchestration Logic**:
   - ✅ Internal team meeting (parallel AI employee calls)
   - ✅ CEO consensus analysis (decide if board needed)
   - ✅ Board consultation (if needed, 2-3 premium advisors)
   - ✅ Final synthesis with action items

5. **Memory System**:
   - ✅ Company context storage (PostgreSQL)
   - ✅ Decision history with embeddings (OpenSearch)
   - ✅ Retrieval at query time (vector search)

**Cost**: ~$0.018/meeting (internal) or ~$0.045/meeting (with board)

---

Ready to start building? Say **"Build Phase 1"** and I'll begin with AWS setup! 🚀
