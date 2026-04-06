// api/v2/team-meeting.js
// Main API endpoint to trigger AI Employee Team Meeting orchestration

const { SFNClient, StartExecutionCommand, DescribeExecutionCommand } = require('@aws-sdk/client-sfn');
const { createClient } = require('@supabase/supabase-js');

const sfn = new SFNClient({ region: (process.env.AWS_REGION || 'us-east-1').trim() });

// State machine ARN (will be set after deployment)
const STATE_MACHINE_ARN = process.env.TEAM_MEETING_STATE_MACHINE_ARN;

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, userId, poll = true } = req.body;

    if (!question || !userId) {
      return res.status(400).json({
        error: 'Missing required fields: question, userId',
      });
    }

    console.log(`[team-meeting] Starting orchestration for user ${userId}`);

    // Fetch user's company context from Supabase (if available)
    let companyContext = {
      company_stage: 'early-stage',
      industry: 'technology',
      runway_months: 12,
      monthly_burn: 50000,
      mrr: 10000,
      team_size: 5,
    };

    // Initialize Supabase client inside handler to ensure env vars are trimmed
    if (process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY) {
      try {
        const supabase = createClient(
          process.env.REACT_APP_SUPABASE_URL.trim(),
          process.env.REACT_APP_SUPABASE_ANON_KEY.trim()
        );

        const { data: companyProfile, error: profileError } = await supabase
          .from('company_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (companyProfile && !profileError) {
          companyContext = companyProfile;
        }
      } catch (e) {
        console.warn('[team-meeting] Failed to init Supabase or fetch profile:', e.message);
      }
    }

    // Start Step Functions execution
    const executionName = `team-meeting-${userId}-${Date.now()}`;

    const execution = await sfn.send(new StartExecutionCommand({
      stateMachineArn: STATE_MACHINE_ARN,
      name: executionName,
      input: JSON.stringify({
        question,
        userId,
        company_context: companyContext,
        past_decisions: [], // TODO: Fetch from memory system in Phase 2
        timestamp: new Date().toISOString(),
      })
    }));

    console.log(`[team-meeting] Execution started: ${execution.executionArn}`);

    // If polling requested, wait for completion
    if (poll) {
      const result = await pollForCompletion(execution.executionArn, 60000); // 60 second timeout
      return res.status(200).json({
        executionId: execution.executionArn,
        status: 'completed',
        result: result,
      });
    }

    // Otherwise return immediately with execution ID
    return res.status(202).json({
      executionId: execution.executionArn,
      status: 'running',
      message: 'Team meeting in progress. Poll GET /api/v2/team-meeting/:executionId for results',
    });

  } catch (error) {
    console.error('[team-meeting] Error:', error);
    return res.status(500).json({
      error: error.message,
      type: error.name,
    });
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
