import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing field mapping...');
    
    const supabase = createServerSupabaseClient();
    
    // Test with minimal data first
    console.log('1️⃣ Testing minimal insert...');
    const minimalLead = {
      agent_id: null, // Will be null for now
      source: 'test-endpoint',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '555-000-0000',
      status: 'new'
    };
    
    const { data: minimalData, error: minimalError } = await supabase
      .from('leads')
      .insert(minimalLead)
      .select('id')
      .single();
    
    if (minimalError) {
      console.error('❌ Minimal insert error:', minimalError);
      return NextResponse.json({
        success: false,
        error: 'Minimal insert failed',
        details: minimalError,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('✅ Minimal insert successful, ID:', minimalData.id);
    
    // Clean up
    await supabase.from('leads').delete().eq('id', minimalData.id);
    
    // Test with the exact data structure from the form
    console.log('2️⃣ Testing form data structure...');
    const formLead = {
      agent_id: null,
      source: 'enhanced-intake-form',
      first_name: 'Michael',
      last_name: 'Thompson',
      email: 'michael.thompson.test@example.com',
      phone: '555-123-4567',
      best_time_to_call: 'afternoon',
      platforms: ['xbox', 'playstation'],
      gamertags: {xbox: 'GamingPro2024', playstation: 'PS4Player'},
      daily_hours: '6-8',
      schedule: ['weekends', 'evenings'],
      primary_games: ['Call of Duty', 'Fortnite', 'Grand Theft Auto V'],
      duration_of_concern: '6-12 months',
      affected_areas: ['school', 'social'],
      symptoms: ['mood changes', 'sleep issues'],
      emergency_indicators: [],
      help_type: 'legal_compensation',
      previous_attempts: ['parental controls'],
      status: 'new',
      form_version: 'enhanced-v1',
      submission_source: 'enhanced-intake-form'
    };
    
    const { data: formData, error: formError } = await supabase
      .from('leads')
      .insert(formLead)
      .select('id')
      .single();
    
    if (formError) {
      console.error('❌ Form data insert error:', formError);
      return NextResponse.json({
        success: false,
        error: 'Form data insert failed',
        details: formError,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('✅ Form data insert successful, ID:', formData.id);
    
    // Clean up
    await supabase.from('leads').delete().eq('id', formData.id);
    
    return NextResponse.json({
      success: true,
      message: 'Field mapping test successful!',
      tests: {
        minimal: '✅ Passed',
        formData: '✅ Passed'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Field mapping test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
