// lambdas/api-gateway-handler/index.js
// API Gateway handler for triggering AI Employee Team Meeting

const { SFNClient, StartExecutionCommand, DescribeExecutionCommand } = require('@aws-sdk/client-sfn');

const sfn = new SFNClient({ region: process.env.AWS_REGION || 'us-east-1' });
const STATE_MACHINE_ARN = process.env.TEAM_MEETING_STATE_MACHINE_ARN;

exports.handler = async (event) => {
  console.log('[api-gateway-handler] Received request:', JSON.stringify(event, null, 2));

  // Handle preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { question, userId, poll = true } = body;

    if (!question || !userId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Missing required fields: question, userId',
        }),
      };
    }

    console.log(`[api-gateway-handler] Starting orchestration for user ${userId}`);

    // Default company context (TODO: Fetch from Supabase in Phase 2)
    const companyContext = {
      company_stage: 'seed',
      industry: 'B2B SaaS',
      runway_months: 12,
      monthly_burn: 50000,
      mrr: 15000,
      team_size: 5,
      growth_rate_mom: 15,
    };

    // Start Step Functions execution
    const executionName = `team-meeting-${userId}-${Date.now()}`;

    const execution = await sfn.send(new StartExecutionCommand({
      stateMachineArn: STATE_MACHINE_ARN,
      name: executionName,
      input: JSON.stringify({
        question,
        userId,
        company_context: companyContext,
        past_decisions: [],
        timestamp: new Date().toISOString(),
      })
    }));

    console.log(`[api-gateway-handler] Execution started: ${execution.executionArn}`);

    // If polling requested, wait for completion
    if (poll) {
      const result = await pollForCompletion(execution.executionArn, 60000);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          executionId: execution.executionArn,
          status: 'completed',
          result: result,
        }),
      };
    }

    // Otherwise return immediately
    return {
      statusCode: 202,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        executionId: execution.executionArn,
        status: 'running',
        message: 'Team meeting in progress',
      }),
    };

  } catch (error) {
    console.error('[api-gateway-handler] Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: error.message,
        type: error.name,
      }),
    };
  }
};

async function pollForCompletion(executionArn, timeoutMs) {
  const startTime = Date.now();
  const pollInterval = 2000; // 2 seconds

  while (Date.now() - startTime < timeoutMs) {
    const status = await sfn.send(new DescribeExecutionCommand({
      executionArn,
    }));

    if (status.status === 'SUCCEEDED') {
      return JSON.parse(status.output);
    }

    if (status.status === 'FAILED' || status.status === 'TIMED_OUT' || status.status === 'ABORTED') {
      throw new Error(`Execution ${status.status}: ${status.cause || 'Unknown error'}`);
    }

    // Still running, wait and poll again
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error('Polling timeout - execution still running after 60 seconds');
}
