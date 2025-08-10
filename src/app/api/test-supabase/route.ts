import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Supabase connection...');
    
    // Test environment variables
    console.log('Environment check:');
    console.log('- SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
    
    // Test Supabase client creation
    const supabase = createServerSupabaseClient();
    console.log('✅ Supabase client created successfully');
    
    // Test simple query
    const { data, error } = await supabase
      .from('leads')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase query error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('✅ Supabase query successful:', data);
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      data: data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Supabase test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
