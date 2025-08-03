const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Extract the path from the request
    let path = event.path.replace('/.netlify/functions/proxy', '');
    
    // Handle query parameters
    if (event.queryStringParameters) {
      const queryString = Object.keys(event.queryStringParameters)
        .map(key => `${key}=${encodeURIComponent(event.queryStringParameters[key])}`)
        .join('&');
      path += `?${queryString}`;
    }
    
    // Construct the target URL
    const targetUrl = `https://watchanimeworld.in${path}`;
    
    console.log(`Proxying request to: ${targetUrl}`);
    console.log(`Original path: ${event.path}`);
    console.log(`Extracted path: ${path}`);

    // Make the request to the target site
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Origin': 'https://watchanimeworld.in',
        'Referer': 'https://watchanimeworld.in/',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      timeout: 15000
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const body = await response.text();
    
    // Get response headers
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Set CORS headers
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    
    // Ensure content type is set
    if (!headers['content-type']) {
      headers['content-type'] = 'text/html; charset=utf-8';
    }

    console.log(`✅ Proxy successful - Status: ${response.status}, Content-Length: ${body.length}`);

    return {
      statusCode: response.status,
      headers: headers,
      body: body
    };

  } catch (error) {
    console.error('Proxy error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Proxy request failed',
        message: error.message
      })
    };
  }
}; 