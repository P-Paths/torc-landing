import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Extract agent ID from URL params or use default
    const url = new URL(request.url);
    const agentId = url.searchParams.get('agent') || 'AHRPE5559';
    
    // Create a simple response without Firebase
    const response = {
      success: true,
      message: 'Form submitted successfully (test mode)',
      data: {
        agentId: agentId,
        submittedAt: new Date().toISOString(),
        formData: formData
      },
      timestamp: new Date().toISOString()
    };

    console.log('Test form submission:', response);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Test form submission error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 