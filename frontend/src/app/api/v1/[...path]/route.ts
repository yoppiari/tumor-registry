import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path);
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[]
) {
  const backendUrl = process.env.NODE_ENV === 'production'
    ? 'https://api.inamsos.id'
    : 'http://localhost:3001';

  const path = pathSegments.join('/');
  const url = `${backendUrl}/api/v1/${path}`;

  try {
    // Get the request body
    let body;
    if (['POST', 'PATCH', 'PUT'].includes(request.method)) {
      body = await request.text();
    }

    // Get headers from the original request
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      // Skip certain headers that shouldn't be forwarded
      if (!['host', 'connection', 'accept-encoding'].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    });

    // Make the request to the backend
    const response = await fetch(url, {
      method: request.method,
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/json',
        ...headers,
      },
      body,
    });

    // Get response data
    const responseText = await response.text();

    // Create response with appropriate status and headers
    const nextResponse = new NextResponse(responseText, {
      status: response.status,
      statusText: response.statusText,
    });

    // Copy response headers
    response.headers.forEach((value, key) => {
      if (!['connection', 'transfer-encoding'].includes(key.toLowerCase())) {
        nextResponse.headers.set(key, value);
      }
    });

    return nextResponse;
  } catch (error) {
    console.error('Proxy request error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to connect to backend API',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}