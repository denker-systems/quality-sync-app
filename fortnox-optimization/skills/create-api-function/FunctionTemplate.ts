import { Handler } from '@netlify/functions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Adjust domain in production
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export const handler: Handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    // 1. Validation
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    const body = event.body ? JSON.parse(event.body) : {};
    
    // 2. Business Logic
    // Example: const data = await fetchExternalApi();

    // 3. Response
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Success', data: body }),
    };

  } catch (error) {
    console.error('Function error:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
