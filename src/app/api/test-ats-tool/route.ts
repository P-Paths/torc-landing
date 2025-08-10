import { NextRequest, NextResponse } from 'next/server';
import { ATSGamerCheckerService } from '../../../lib/ats-gamer-checker';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing ATS Tool integration...');
    
    // Test with a sample gamertag
    const testGamertag = 'TestGamer123';
    const testPlatform = 'xbox';
    
    console.log(`🔍 Testing lookup for ${testGamertag} on ${testPlatform}...`);
    
    const result = await ATSGamerCheckerService.checkBonusEligibility(
      testGamertag,
      testPlatform
    );
    
    console.log('✅ ATS Tool test completed:', result);
    
    return NextResponse.json({
      success: true,
      message: 'ATS Tool integration test completed',
      testData: {
        gamertag: testGamertag,
        platform: testPlatform,
        result: result
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ ATS Tool test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'ATS Tool integration test failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
