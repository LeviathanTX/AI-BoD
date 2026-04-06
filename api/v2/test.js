// Simple test endpoint
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
    env_check: {
      has_state_machine_arn: !!process.env.TEAM_MEETING_STATE_MACHINE_ARN,
      has_aws_access_key: !!process.env.AWS_ACCESS_KEY_ID,
      has_aws_region: !!process.env.AWS_REGION,
      aws_region_value: process.env.AWS_REGION,
    }
  });
};
