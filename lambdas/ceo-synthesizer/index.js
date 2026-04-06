// lambdas/ceo-synthesizer/index.js
// CEO Agent final synthesis: combines team + board input into decision with action items

const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');

const bedrock = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'us-east-1' });

exports.handler = async (event) => {
  try {
    const {
      question,
      employee_responses = [],
      board_responses = [],
      company_context = {},
    } = event;

    console.log(`[ceo-synthesizer] Synthesizing decision with ${employee_responses.length} team + ${board_responses.length} board responses`);

    // Format team discussion
    const teamDiscussion = employee_responses
      .map(r => `${r.employee_name} (${r.employee_role}):\n${r.response}`)
      .join('\n\n─────────────────\n\n');

    // Format board input (if consulted)
    const boardInput = board_responses.length > 0
      ? board_responses
          .map(r => `${r.advisor_name} (${r.advisor_role}):\n${r.response}`)
          .join('\n\n─────────────────\n\n')
      : 'Advisory board was not consulted (team had strong consensus).';

    const synthesisPrompt = `You are Alex, the CEO of this company. You've just facilitated a team meeting${board_responses.length > 0 ? ' and consulted your advisory board' : ''}.

Now you need to synthesize everything into a clear decision with action items.

ORIGINAL QUESTION:
${question}

═══════════════════════════════════════════════════════════
INTERNAL TEAM DISCUSSION:
${teamDiscussion}

${board_responses.length > 0 ? `═══════════════════════════════════════════════════════════
ADVISORY BOARD INPUT:
${boardInput}` : ''}

═══════════════════════════════════════════════════════════
COMPANY CONTEXT:
- Stage: ${company_context.company_stage || 'Early-stage'}
- Runway: ${company_context.runway_months || 'Unknown'} months
- Monthly Burn: $${company_context.monthly_burn || 'Unknown'}
- MRR: $${company_context.mrr || 'Unknown'}

YOUR CEO SYNTHESIS SHOULD INCLUDE:

1. DECISION: Clear yes/no or specific path forward
2. RATIONALE: Why this decision (reference who said what)
   - If team + board aligned: "Team consensus (X/X) supported by board (Y/Y)"
   - If disagreement: "Despite X saying Y, I'm choosing Z because..."
3. KEY INSIGHTS: 2-3 most important points from the discussion
4. CONTINGENCIES: "IF this happens, THEN revisit this decision"
5. ACTION ITEMS: Specific next steps assigned to team members
   Format: "[ ] Person (Role): Action (Deadline)"

RETURN VALID JSON (no markdown):
{
  "decision": "Clear decision statement",
  "rationale": "Why this decision with references to team/board input",
  "key_insights": [
    "Most important insight 1",
    "Most important insight 2",
    "Most important insight 3"
  ],
  "consensus_summary": "X/X team members agreed, Y/Y board advisors supported",
  "disagreements": [
    {
      "point": "What they disagreed about",
      "positions": {
        "person_name": "Their position",
        "another_person": "Their different position"
      },
      "your_reasoning": "Why you sided with X over Y"
    }
  ],
  "contingencies": [
    "IF condition, THEN action"
  ],
  "action_items": [
    {
      "assignee": "Morgan (CTO)",
      "action": "Specific task",
      "deadline": "2 weeks",
      "priority": "high/medium/low"
    }
  ],
  "confidence_level": "high/medium/low",
  "follow_up_date": "When to revisit this (e.g., '30 days', 'Q2 2026')"
}

Be decisive. Be specific. Reference actual points made by your team and advisors.`;

    // Call Bedrock (CEO uses Nova Pro for synthesis)
    const response = await bedrock.send(new ConverseCommand({
      modelId: 'amazon.nova-pro-v1:0',
      messages: [{
        role: 'user',
        content: [{ text: synthesisPrompt }]
      }],
      inferenceConfig: {
        maxTokens: 2000,
        temperature: 0.5,
      }
    }));

    const responseText = response.output.message.content[0].text;

    // Parse JSON response
    let synthesis;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      synthesis = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (parseError) {
      console.error('[ceo-synthesizer] Failed to parse JSON:', responseText);
      // Fallback structure
      synthesis = {
        decision: 'Decision synthesis failed - manual review required',
        rationale: responseText.substring(0, 500),
        key_insights: ['See full response for details'],
        action_items: [],
        confidence_level: 'low',
      };
    }

    console.log(`[ceo-synthesizer] Decision: ${synthesis.decision.substring(0, 100)}...`);

    return {
      statusCode: 200,
      body: {
        ...synthesis,
        question,
        team_members_consulted: employee_responses.map(r => r.employee_name),
        board_advisors_consulted: board_responses.map(r => r.advisor_name),
        timestamp: new Date().toISOString(),
      }
    };

  } catch (error) {
    console.error('[ceo-synthesizer] Error:', error);
    return {
      statusCode: 500,
      body: {
        error: error.message,
        decision: 'Synthesis failed - manual review required',
      }
    };
  }
};
