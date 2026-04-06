// lambdas/intent-classifier/index.js
// Classifies user questions (for future routing optimization)

const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');

const bedrock = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'us-east-1' });

exports.handler = async (event) => {
  try {
    const { question } = event;

    console.log(`[intent-classifier] Classifying: ${question.substring(0, 100)}...`);

    const classificationPrompt = `Classify this business question into categories.

Question: ${question}

Return JSON (no markdown):
{
  "primary_category": "strategic|technical|financial|sales|product|hiring|operational",
  "urgency": "low|medium|high",
  "complexity": "simple|moderate|complex",
  "estimated_time": "5min|15min|30min|1hour"
}`;

    const response = await bedrock.send(new ConverseCommand({
      modelId: 'amazon.nova-micro-v1:0',
      messages: [{
        role: 'user',
        content: [{ text: classificationPrompt }]
      }],
      inferenceConfig: {
        maxTokens: 300,
        temperature: 0.3,
      }
    }));

    const responseText = response.output.message.content[0].text;

    // Parse JSON
    let classification;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      classification = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch {
      classification = {
        primary_category: 'strategic',
        urgency: 'medium',
        complexity: 'moderate',
        estimated_time: '15min',
      };
    }

    return {
      statusCode: 200,
      body: classification,
    };

  } catch (error) {
    console.error('[intent-classifier] Error:', error);
    return {
      statusCode: 500,
      body: {
        error: error.message,
      }
    };
  }
};
