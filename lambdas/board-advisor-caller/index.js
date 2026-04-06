// lambdas/board-advisor-caller/index.js
// Calls advisory board members (celebrity advisors) using premium models

const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');

const bedrock = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'us-east-1' });

// Advisory Board Model Mapping (using proven, working models)
// NOTE: Using Nova Pro for all advisors for now until marketplace subscriptions are configured
const ADVISOR_MODELS = {
  'reed-pawffman': 'amazon.nova-pro-v1:0', // Was: us.anthropic.claude-sonnet-4-6
  'jason-clawcanis': 'amazon.nova-pro-v1:0', // Was: mistral.mistral-large-3-675b-instruct
  'cheryl-sandbearg': 'amazon.nova-pro-v1:0',
  'marc-beardreessen': 'amazon.nova-pro-v1:0', // Was: us.anthropic.claude-sonnet-4-6
  'satya-nadellaw': 'amazon.nova-pro-v1:0',
  'jamie-diamondpaw': 'amazon.nova-pro-v1:0',
};

// Simplified advisor system prompts (full prompts loaded from existing AdvisorContext)
const ADVISOR_PERSONALITIES = {
  'reed-pawffman': {
    name: 'Reed Pawffman',
    role: 'Network Effects & Strategic Thinking',
    style: 'Strategic, network-oriented, long-term focused',
  },
  'jason-clawcanis': {
    name: 'Jason Clawcanis',
    role: 'Angel Investor & Fundraising Expert',
    style: 'Direct, contrarian, no-BS advice',
  },
  'cheryl-sandbearg': {
    name: 'Cheryl Sandbearg',
    role: 'Operational Excellence & Scaling',
    style: 'Analytical, data-driven, execution-focused',
  },
  'marc-beardreessen': {
    name: 'Marc Beardreessen',
    role: 'Technology Vision & Platforms',
    style: 'Contrarian, visionary, "software eats the world"',
  },
};

exports.handler = async (event) => {
  try {
    const {
      advisor_id,
      question,
      company_context = {},
      internal_team_discussion = '',
    } = event;

    console.log(`[board-advisor-caller] Calling ${advisor_id} for consultation`);

    const advisor = ADVISOR_PERSONALITIES[advisor_id];
    if (!advisor) {
      throw new Error(`Unknown advisor: ${advisor_id}`);
    }

    const modelId = ADVISOR_MODELS[advisor_id];

    // Build advisory board prompt
    const advisoryPrompt = `You are ${advisor.name}, a member of this company's advisory board.

YOUR ROLE: ${advisor.role}
YOUR COMMUNICATION STYLE: ${advisor.style}

CONTEXT - THE INTERNAL TEAM HAS DISCUSSED THIS:
The company's CEO (Alex) and executive team (CTO Morgan, CFO Jordan, VP Sales Taylor, Head of Product Casey) have already discussed this question internally. Here's their discussion:

${internal_team_discussion}

THE CEO IS NOW ASKING YOU SPECIFICALLY:
${question}

COMPANY BACKGROUND:
- Stage: ${company_context.company_stage || 'Early-stage'}
- Industry: ${company_context.industry || 'Not specified'}
- Runway: ${company_context.runway_months || 'Unknown'} months
- MRR: $${company_context.mrr || 'Not disclosed'}
- Team Size: ${company_context.team_size || 'Small team'}

YOUR ADVISORY RESPONSE SHOULD:
1. Acknowledge what the internal team said (agree or disagree)
2. Provide your unique perspective based on your expertise
3. Give specific, actionable advice (not generic platitudes)
4. Cite relevant examples or patterns you've seen
5. Flag risks or opportunities the team might have missed

Remember: You're being consulted because this is a high-stakes or split decision.
Be direct and valuable - the CEO needs your outside perspective.`;

    // Call Bedrock with appropriate model
    const response = await bedrock.send(new ConverseCommand({
      modelId,
      messages: [{
        role: 'user',
        content: [{ text: advisoryPrompt }]
      }],
      inferenceConfig: {
        maxTokens: 1500,
        temperature: 0.7,
      }
    }));

    const responseText = response.output.message.content[0].text;

    console.log(`[board-advisor-caller] ${advisor.name} response length: ${responseText.length} chars`);

    return {
      statusCode: 200,
      body: {
        advisor_id,
        advisor_name: advisor.name,
        advisor_role: advisor.role,
        response: responseText,
        timestamp: new Date().toISOString(),
        model_used: modelId,
      }
    };

  } catch (error) {
    console.error('[board-advisor-caller] Error:', error);
    return {
      statusCode: 500,
      body: {
        error: error.message,
        advisor_id: event.advisor_id,
      }
    };
  }
};
