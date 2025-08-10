import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get all agents
    const { data: agents, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching agents:', error);
      return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
    }
    
    // Transform the data to match frontend expectations
    const transformedAgents = (agents || []).map(agent => ({
      id: agent.id,
      name: agent.name,
      agentId: agent.code, // Map 'code' to 'agentId'
      email: agent.email,
      phone: agent.phone,
      isActive: agent.is_active, // Map snake_case to camelCase
      createdAt: agent.created_at,
      commissionBaseCents: agent.commission_base_cents, // Map snake_case to camelCase
      commissionBonusQualifiedCents: agent.commission_bonus_qualified_cents // Map snake_case to camelCase
    }));
    
    return NextResponse.json({ agents: transformedAgents });
    
  } catch (error) {
    console.error('Error in agents API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const agentData = await request.json();
    const supabase = createServerSupabaseClient();
    
    const { data: agent, error } = await supabase
      .from('agents')
      .insert(agentData)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating agent:', error);
      return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
    }
    
    return NextResponse.json({ agent });
    
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 