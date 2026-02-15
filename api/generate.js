// Vercel Serverless Function for AI API Proxy
// This handles CORS and securely calls AI APIs server-side

import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

export default async function handler(req, res) {
  // Enable CORS with specific origin for security
  const allowedOrigins = [
    'https://ai-bod.vercel.app',
    'https://ai-bod-one.vercel.app',
    'https://ai-bod-ochre.vercel.app',
    'https://bearable-ai-advisors.vercel.app',
    'https://elite-ai-advisory.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Request-ID, X-Client-Version, Authorization, X-API-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Basic request validation
    const { service, model, messages, options } = req.body;

    // Debug logging
    console.log('API Request received:', {
      service,
      model,
      messagesCount: messages?.length,
      hasOptions: !!options,
      timestamp: new Date().toISOString()
    });

    if (!service || !model || !messages) {
      console.error('Missing required fields:', { service, model, hasMessages: !!messages });
      return res.status(400).json({ error: 'Missing required fields: service, model, messages' });
    }

    // Environment check for production
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.CLAUDE_API_KEY && !process.env.OPENAI_API_KEY && !process.env.AWS_ACCESS_KEY_ID) {
        return res.status(500).json({ error: 'No AI service API keys configured' });
      }
    }

    let apiResponse;

    if (service === 'claude') {
      apiResponse = await callClaudeAPI(model, messages, options);
    } else if (service === 'chatgpt') {
      apiResponse = await callOpenAIAPI(model, messages, options);
    } else if (service === 'bedrock') {
      apiResponse = await callBedrockAPI(model, messages, options);
    } else {
      return res.status(400).json({ error: `Unsupported AI service: ${service}` });
    }

    res.status(200).json(apiResponse);
  } catch (error) {
    console.error('AI API call failed:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      error: 'AI service temporarily unavailable',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

async function callClaudeAPI(model, messages, options = {}) {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    console.error('Claude API key not found in environment');
    throw new Error('Claude API key not configured');
  }

  console.log('Calling Claude API with:', {
    model,
    messageCount: messages.length,
    maxTokens: options.maxTokens || 2000,
    temperature: options.temperature || 0.7
  });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: options.maxTokens || 2000,
      temperature: options.temperature || 0.7,
      messages: messages.filter(m => m.role !== 'system').map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      system: messages.find(m => m.role === 'system')?.content
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
    console.error('Claude API error response:', {
      status: response.status,
      statusText: response.statusText,
      error: error
    });
    throw new Error(`Claude API Error ${response.status}: ${error.error?.message || 'Request failed'}`);
  }

  const data = await response.json();
  return {
    content: data.content[0].text,
    usage: {
      prompt_tokens: data.usage.input_tokens,
      completion_tokens: data.usage.output_tokens,
      total_tokens: data.usage.input_tokens + data.usage.output_tokens
    },
    metadata: {
      model: data.model,
      service: 'claude',
      timestamp: new Date().toISOString()
    }
  };
}

async function callOpenAIAPI(model, messages, options = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  // SECURITY: Never log API keys or their prefixes in production
  if (!apiKey) {
    console.error('OpenAI API key not configured');
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      max_tokens: options.maxTokens || 2000,
      temperature: options.temperature || 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
    throw new Error(`OpenAI API Error ${response.status}: ${error.error?.message || 'Request failed'}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    usage: {
      prompt_tokens: data.usage.prompt_tokens,
      completion_tokens: data.usage.completion_tokens,
      total_tokens: data.usage.total_tokens
    },
    metadata: {
      model: data.model,
      service: 'openai',
      timestamp: new Date().toISOString()
    }
  };
}

async function callBedrockAPI(model, messages, options = {}) {
  // Verify AWS credentials are configured
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || 'us-east-1';

  if (!accessKeyId || !secretAccessKey) {
    console.error('AWS credentials not configured');
    throw new Error('AWS Bedrock credentials not configured');
  }

  // Supported Bedrock model IDs
  const supportedModels = [
    'amazon.nova-pro-v1:0',
    'amazon.nova-lite-v1:0',
    'amazon.nova-micro-v1:0',
    'meta.llama3-3-70b-instruct-v1:0',
    'meta.llama3-2-90b-instruct-v1:0',
    'mistral.mistral-large-2407-v1:0',
    'anthropic.claude-sonnet-4-20250514',
    'anthropic.claude-haiku-4-5-20251001-v1:0'
  ];

  if (!supportedModels.includes(model)) {
    console.warn(`Model ${model} not in supported list, attempting anyway`);
  }

  console.log('Calling Bedrock API with:', {
    model,
    messageCount: messages.length,
    region,
    maxTokens: options.maxTokens || 2000,
    temperature: options.temperature || 0.7
  });

  try {
    // Initialize Bedrock client
    const client = new BedrockRuntimeClient({
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
      }
    });

    // Separate system messages from conversation messages
    const systemMessages = messages.filter(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');

    // Format messages for Bedrock Converse API
    const bedrockMessages = conversationMessages.map(msg => ({
      role: msg.role,
      content: [{ text: msg.content }]
    }));

    // Prepare the Converse command
    const command = new ConverseCommand({
      modelId: model,
      messages: bedrockMessages,
      system: systemMessages.length > 0 ? [{ text: systemMessages[0].content }] : undefined,
      inferenceConfig: {
        maxTokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7
      }
    });

    // Execute the API call
    const response = await client.send(command);

    // Extract response content
    const content = response.output?.message?.content?.[0]?.text || '';

    // Extract usage statistics
    const usage = {
      prompt_tokens: response.usage?.inputTokens || 0,
      completion_tokens: response.usage?.outputTokens || 0,
      total_tokens: (response.usage?.inputTokens || 0) + (response.usage?.outputTokens || 0)
    };

    return {
      content: content,
      usage: usage,
      metadata: {
        model: model,
        service: 'bedrock',
        timestamp: new Date().toISOString(),
        stopReason: response.stopReason
      }
    };
  } catch (error) {
    console.error('Bedrock API error:', {
      message: error.message,
      name: error.name,
      model: model
    });

    // Provide helpful error messages for common issues
    if (error.name === 'ValidationException') {
      throw new Error(`Bedrock validation error: ${error.message}. Check that model ${model} is available in region ${region}`);
    } else if (error.name === 'AccessDeniedException') {
      throw new Error('AWS credentials lack permission to invoke Bedrock models. Check IAM permissions.');
    } else if (error.name === 'ResourceNotFoundException') {
      throw new Error(`Model ${model} not found in region ${region}. Verify model ID and region.`);
    } else {
      throw new Error(`Bedrock API Error: ${error.message}`);
    }
  }
}