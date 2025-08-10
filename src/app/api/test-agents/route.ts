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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Test agent creation with data:', body);
    
    const { name, agentId, password, email, phone } = body;
    
    if (!name || !agentId || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Test agent creation
    const newAgent = {
      name,
      agentId,
      password,
      email: email || '',
      phone: phone || '',
      createdAt: new Date(),
      isActive: true
    };
    
    console.log('Creating test agent:', newAgent);
    const docRef = await adminDb.collection('agents').add(newAgent);
    
    console.log('Agent created with ID:', docRef.id);
    
    return NextResponse.json({ 
      success: true,
      id: docRef.id,
      agent: newAgent
    });
  } catch (error) {
    console.error('Test agent creation failed:', error);
    return NextResponse.json({ 
      error: 'Test agent creation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
