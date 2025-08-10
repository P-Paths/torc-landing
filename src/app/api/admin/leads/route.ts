import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get all leads with agent information
    const { data: leads, error } = await supabase
      .from('leads')
      .select(`
        *,
        agents:agent_id (
          name,
          email
        )
      `)
      .order('submitted_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
    
    // Transform the data to match frontend expectations
    const transformedLeads = (leads || []).map(lead => ({
      id: lead.id,
      agentId: lead.agent_id,
      agentName: lead.agents?.name || 'Unknown Agent',
      gamerFirstName: lead.first_name,
      gamerLastName: lead.last_name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status || 'new',
      submittedAt: lead.submitted_at,
      hasEmergencyIndicators: lead.has_emergency_indicators || false,
      totalSymptoms: lead.total_symptoms || 0,
      platforms: lead.platforms || [],
      gamertags: lead.gamertags || {},
      dailyHours: lead.daily_hours || 'N/A',
      primaryGames: lead.primary_games || []
    }));
    
    return NextResponse.json({ leads: transformedLeads });
    
  } catch (error) {
    console.error('Error in leads API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { leadId, updates } = await request.json();
    const supabase = createServerSupabaseClient();
    
    const { error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', leadId);
    
    if (error) {
      console.error('Error updating lead:', error);
      return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 