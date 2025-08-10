import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing leads table...');
    
    const supabase = createServerSupabaseClient();
    
    // Test 1: Check if table exists and can be queried
    console.log('1️⃣ Testing table query...');
    const { data: queryData, error: queryError } = await supabase
      .from('leads')
      .select('*')
      .limit(1);
    
    if (queryError) {
      console.error('❌ Table query error:', queryError);
      return NextResponse.json({
        success: false,
        error: 'Table query failed',
        details: queryError,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('✅ Table query successful, found', queryData?.length || 0, 'records');
    
    // Test 2: Try to insert a test record
    console.log('2️⃣ Testing table insert...');
    const testLead = {
      agent_id: 'TEST-AGENT-001',
      source: 'test-endpoint',
      gamer_first_name: 'Test',
      gamer_last_name: 'User',
      email: 'test@example.com',
      phone: '555-000-0000',
      status: 'new',
      form_version: 'test-v1'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('leads')
      .insert(testLead)
      .select('id')
      .single();
    
    if (insertError) {
      console.error('❌ Table insert error:', insertError);
      return NextResponse.json({
        success: false,
        error: 'Table insert failed',
        details: insertError,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('✅ Table insert successful, new ID:', insertData.id);
    
    // Test 3: Clean up test record
    console.log('3️⃣ Cleaning up test record...');
    const { error: deleteError } = await supabase
      .from('leads')
      .delete()
      .eq('id', insertData.id);
    
    if (deleteError) {
      console.error('⚠️ Test cleanup failed:', deleteError);
    } else {
      console.log('✅ Test cleanup successful');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Leads table test successful!',
      tests: {
        query: '✅ Passed',
        insert: '✅ Passed',
        cleanup: deleteError ? '⚠️ Partial' : '✅ Passed'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Leads table test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
