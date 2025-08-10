import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get all agents from the database
    const { data: agents, error } = await supabase
      .from('agents')
      .select('*');
    
    if (error) {
      console.error('Error fetching agents:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch agents',
        details: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      agents: agents || [],
      count: agents?.length || 0
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
