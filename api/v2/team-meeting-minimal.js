// Minimal team meeting endpoint for testing
const { SFNClient, StartExecutionCommand, DescribeExecutionCommand } = require('@aws-sdk/client-sfn');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, userId, poll = true } = req.body;

    if (!question || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sfn = new SFNClient({ region: 'us-east-1' });

    const execution = await sfn.send(new StartExecutionCommand({
      stateMachineArn: process.env.TEAM_MEETING_STATE_MACHINE_ARN,
      name: `team-meeting-${userId}-${Date.now()}`,
      input: JSON.stringify({
        question,
        userId,
        company_context: {
          company_stage: 'seed',
          industry: 'B2B SaaS',
          runway_months: 12,
          monthly_burn: 50000,
          mrr: 15000,
          team_size: 5,
        },
        past_decisions: [],
        timestamp: new Date().toISOString(),
      })
    }));

    if (!poll) {
      return res.status(202).json({
        executionId: execution.executionArn,
        status: 'running',
      });
    }

    // Poll for completion
    const startTime = Date.now();
    const timeout = 60000;

    while (Date.now() - startTime < timeout) {
      const status = await sfn.send(new DescribeExecutionCommand({
        executionArn: execution.executionArn,
      }));

      if (status.status === 'SUCCEEDED') {
        return res.status(200).json({
          executionId: execution.executionArn,
          status: 'completed',
          result: JSON.parse(status.output),
        });
      }

      if (status.status === 'FAILED' || status.status === 'TIMED_OUT' || status.status === 'ABORTED') {
        return res.status(500).json({
          error: `Execution ${status.status}: ${status.cause || 'Unknown error'}`,
        });
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return res.status(408).json({ error: 'Polling timeout - execution still running' });

  } catch (error) {
    return res.status(500).json({
      error: error.message,
      type: error.name,
      stack: error.stack,
    });
  }
};
