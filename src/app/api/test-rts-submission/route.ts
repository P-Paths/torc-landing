import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Extract agent ID from URL params or use default
    const url = new URL(request.url);
    const agentId = url.searchParams.get('agent') || 'AHRPE5559';
    
    console.log('🧪 RTS Funnel Test Submission');
    console.log('👤 Agent ID:', agentId);
    console.log('📝 Form data received:', Object.keys(formData).length, 'fields');

    // Simulate bonus eligibility check
    const isBonusEligible = formData.age <= 22 && 
                           formData.platforms.includes('xbox') && 
                                                       formData.primaryGames.some((game: string) => ['Call of Duty', 'GTA5', 'Fortnite', 'Minecraft', 'Roblox'].includes(game));

    // Simulate random routing
    const random = Math.random();
    const endpoint = random <= 0.6 ? 'Priority 1 (60%)' : 'Priority 2 (40%)';
    
    // Simulate Formstack submission
    const formstackSuccess = Math.random() > 0.1; // 90% success rate

    console.log('🎯 Bonus Eligible:', isBonusEligible);
    console.log('🎲 Routing:', endpoint);
    console.log('📤 Formstack Success:', formstackSuccess);

    // Return test response
    return NextResponse.json({
      success: true,
      message: 'RTS Funnel Test - No actual submission made',
      testData: {
        agentId: agentId,
        isBonusEligible: isBonusEligible,
        routing: endpoint,
        formstackSuccess: formstackSuccess,
        formDataReceived: Object.keys(formData).length,
        timestamp: new Date().toISOString()
      },
      note: 'This is a test endpoint. Use /api/submit-to-formstack for real submissions.'
    });

  } catch (error) {
    console.error('Test submission error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 