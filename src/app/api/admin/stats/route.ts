import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get total leads count
    const { count: totalLeads, error: leadsError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });
    
    if (leadsError) {
      console.error('Error counting leads:', leadsError);
      return NextResponse.json({ error: 'Failed to count leads' }, { status: 500 });
    }
    
    // Get total agents count
    const { count: totalAgents, error: agentsError } = await supabase
      .from('agents')
      .select('*', { count: 'exact', head: true });
    
    if (agentsError) {
      console.error('Error counting agents:', agentsError);
      return NextResponse.json({ error: 'Failed to count agents' }, { status: 500 });
    }
    
    // Get leads by source
    const { data: leadsBySource, error: sourceError } = await supabase
      .from('leads')
      .select('source')
      .order('source');
    
    if (sourceError) {
      console.error('Error getting leads by source:', sourceError);
      return NextResponse.json({ error: 'Failed to get leads by source' }, { status: 500 });
    }
    
    // Count leads by source
    const sourceCounts = leadsBySource?.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};
    
    // Get leads by status
    const { data: leadsByStatus, error: statusError } = await supabase
      .from('leads')
      .select('status')
      .order('status');
    
    if (statusError) {
      console.error('Error getting leads by status:', statusError);
      return NextResponse.json({ error: 'Failed to get leads by status' }, { status: 500 });
    }
    
    // Count leads by status
    const statusCounts = leadsByStatus?.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};
    
    // Get bonus eligible leads count
    const { count: bonusEligibleLeads, error: bonusError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('is_bonus_eligible', true);
    
    if (bonusError) {
      console.error('Error counting bonus eligible leads:', bonusError);
      return NextResponse.json({ error: 'Failed to count bonus eligible leads' }, { status: 500 });
    }
    
    // Get recent leads (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { count: recentLeads, error: recentError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('submitted_at', sevenDaysAgo.toISOString());
    
    if (recentError) {
      console.error('Error counting recent leads:', recentError);
      return NextResponse.json({ error: 'Failed to count recent leads' }, { status: 500 });
    }
    
    const stats = {
      totalLeads: totalLeads || 0,
      totalAgents: totalAgents || 0,
      bonusEligibleLeads: bonusEligibleLeads || 0,
      recentLeads: recentLeads || 0,
      leadsBySource: sourceCounts,
      leadsByStatus: statusCounts,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json({ stats });
    
  } catch (error) {
    console.error('Error in stats API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 