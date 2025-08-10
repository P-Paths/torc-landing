import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { agentId, userAgent, ipAddress, referrer } = await request.json();
    const supabase = createServerSupabaseClient();
    
    // Record the QR code scan
    const { data, error } = await supabase
      .from('qr_scans')
      .insert({
        agent_id: agentId,
        user_agent: userAgent,
        ip_address: ipAddress,
        referrer: referrer,
        scanned_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error recording QR scan:', error);
      return NextResponse.json({ error: 'Failed to record scan' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'QR scan recorded successfully',
      scanId: data?.[0]?.id 
    });
    
  } catch (error) {
    console.error('Error in QR scan API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const supabase = createServerSupabaseClient();
    
    let query = supabase
      .from('qr_scans')
      .select('*')
      .order('scanned_at', { ascending: false });
    
    if (agentId) {
      query = query.eq('agent_id', agentId);
    }
    
    const { data: scans, error } = await query;
    
    if (error) {
      console.error('Error fetching QR scans:', error);
      return NextResponse.json({ error: 'Failed to fetch scans' }, { status: 500 });
    }
    
    return NextResponse.json({ scans: scans || [] });
    
  } catch (error) {
    console.error('Error in QR scan API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
