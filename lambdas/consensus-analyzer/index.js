// lambdas/consensus-analyzer/index.js
// CEO Agent analyzes team consensus and decides if advisory board consultation is needed

const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');

const bedrock = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'us-east-1' });

exports.handler = async (event) => {
  try {
    const { employee_responses, question, company_context } = event;

    console.log(`[consensus-analyzer] Analyzing consensus for ${employee_responses.length} responses`);

    // Format employee responses for analysis
    const formattedResponses = employee_responses
      .map(r => `${r.employee_name} (${r.employee_role}):\n${r.response}`)
      .join('\n\n─────────────────\n\n');

    const analysisPrompt = `You are Alex, the CEO analyzing your executive team's responses to determine if we need outside advisory board consultation.

QUESTION ASKED:
${question}

YOUR TEAM'S RESPONSES:
${formattedResponses}

COMPANY CONTEXT:
- Stage: ${company_context.company_stage || 'Unknown'}
- Runway: ${company_context.runway_months || 'Unknown'} months
- Monthly Burn: $${company_context.monthly_burn || 'Unknown'}
- MRR: $${company_context.mrr || 'Unknown'}

ANALYSIS CRITERIA:
You should consult the advisory board if ANY of these are true:

1. SPLIT DECISION: Team is divided (less than 75% agreement)
   - Look for conflicting recommendations
   - Check if 2+ team members disagree significantly

2. HIGH STAKES: Decision has major impact
   - Affects runway by >2 months
   - Financial impact >$100K
   - Strategic pivot (changes business model, target market, etc.)
   - Irreversible decision (hiring/firing execs, major partnerships)

3. NOVEL SITUATION: No clear precedent
   - First time facing this type of decision
   - Team lacks domain expertise
   - Multiple unknowns with high uncertainty

4. EMOTIONAL/TEAM CONFLICT: Responses show strong disagreement
   - Team members questioning each other's judgment
   - Defensive or heated language

RETURN JSON (no markdown, just valid JSON):
{
  "needsBoard": true/false,
  "rationale": "1-2 sentence explanation of why or why not",
  "stakesLevel": "low/medium/high",
  "consensusScore": 0-100,
  "primaryReason": "split_decision/high_stakes/novel_situation/team_aligned",
  "recommendedAdvisors": ["jason-clawcanis", "reed-pawffman", "cheryl-sandbearg"],
  "specificQuestion": "The specific question to ask the board (if needed)"
}

If team is aligned and stakes are reasonable, set needsBoard to false.
If consulting board, recommend 2-3 advisors most relevant to this decision.`;

    // Call Bedrock (CEO uses Nova Pro for analysis)
    const response = await bedrock.send(new ConverseCommand({
      modelId: 'amazon.nova-pro-v1:0',
      messages: [{
        role: 'user',
        content: [{ text: analysisPrompt }]
      }],
      inferenceConfig: {
        maxTokens: 800,
        temperature: 0.3, // Lower temp for more consistent analysis
      }
    }));

    const responseText = response.output.message.content[0].text;

    // Parse JSON response
    let analysis;
    try {
      // Try to extract JSON if wrapped in markdown
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (parseError) {
      console.error('[consensus-analyzer] Failed to parse JSON:', responseText);
      // Fallback: assume board consultation needed if parsing fails
      analysis = {
        needsBoard: true,
        rationale: 'Analysis parsing failed - defaulting to board consultation for safety',
        stakesLevel: 'high',
        consensusScore: 50,
        primaryReason: 'novel_situation',
        recommendedAdvisors: ['jason-clawcanis', 'reed-pawffman', 'cheryl-sandbearg'],
        specificQuestion: question,
      };
    }

    console.log(`[consensus-analyzer] Result: needsBoard=${analysis.needsBoard}, consensus=${analysis.consensusScore}%`);

    return {
      statusCode: 200,
      body: {
        ...analysis,
        employee_responses, // Pass through for next step
        question,
        timestamp: new Date().toISOString(),
      }
    };

  } catch (error) {
    console.error('[consensus-analyzer] Error:', error);
    return {
      statusCode: 500,
      body: {
        error: error.message,
        // Fail safe: if error, default to board consultation
        needsBoard: true,
        rationale: 'Error in analysis - consulting board for safety',
      }
    };
  }
};
