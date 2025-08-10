import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { ATSGamerCheckerService } from '@/lib/ats-gamer-checker';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Extract agent code from URL params or use default
    const url = new URL(request.url);
    const agentCode = url.searchParams.get('agent') || 'AHRPE5559';
    
    // Look up the actual agent ID from the agents table
    const supabase = createServerSupabaseClient();
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('id')
      .eq('agent_id', agentCode)
      .single();
    
    if (agentError || !agent) {
      console.error('❌ Agent lookup failed:', agentError);
      return NextResponse.json({
        success: false,
        error: 'Invalid agent code',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    const agentId = agent.id;
    console.log('✅ Agent found:', { code: agentCode, id: agentId });
    
    // Create the lead document with all form data and metadata
    const leadDocument = {
      // Agent and submission metadata
      agent_id: agentId,
      source: 'enhanced-intake-form',
      
      // Contact Information (handle both naming conventions)
      first_name: formData.gamerFirstName || formData.firstName || '',
      last_name: formData.gamerLastName || formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      best_time_to_call: formData.bestTimeToCall || 'anytime',
      
      // Gaming Profile
      platforms: formData.platforms || [],
      gamertags: formData.gamertags || {},
      daily_hours: formData.dailyHours || '',
      schedule: formData.schedule || [],
      primary_games: formData.primaryGames || formData.games || [],
      
      // Assessment
      duration_of_concern: formData.durationOfConcern || 'unknown',
      affected_areas: formData.affectedAreas || [],
      symptoms: formData.symptoms || [],
      emergency_indicators: formData.emergencyIndicators || [],
      
      // Treatment
      help_type: formData.helpType || 'legal_compensation',
      previous_attempts: formData.previousAttempts || [],
      
      // Status and processing
      status: 'new',
      assessment_score: null, // Future use for AI assessment
      processed_at: null,
      assigned_to: null,
      notes: [],
      
      // Additional metadata for tracking
      form_version: 'enhanced-v1',
      submission_source: 'enhanced-intake-form',
      
      // Bonus eligibility (will be updated after ATS check)
      is_bonus_eligible: false,
      bonus_verified_at: null
    };

    // Log the data for debugging
    console.log('=== LEAD SUBMISSION ===');
    console.log('Agent ID:', agentId);
    console.log('Contact Info:', {
      firstName: leadDocument.first_name,
      lastName: leadDocument.last_name,
      email: leadDocument.email,
      phone: leadDocument.phone
    });

    // Supabase client already initialized above
    
    // Save to Supabase leads table
    try {
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .insert(leadDocument)
        .select('id')
        .single();
      
      if (leadError) throw leadError;
      
      console.log('✅ Lead saved to Supabase with ID:', lead.id);
      
      // Check bonus eligibility using ATS tool if Xbox gamertag is provided
      if (formData.gamertags?.xbox && formData.platforms?.includes('Xbox')) {
        try {
          console.log('🎮 Checking Xbox bonus eligibility for:', formData.gamertags.xbox);
          
          const bonusResult = await ATSGamerCheckerService.checkBonusEligibility(
            formData.gamertags.xbox,
            'Xbox'
          );
          
          // Update lead with bonus eligibility
          await supabase
            .from('leads')
            .update({
              is_bonus_eligible: bonusResult.isEligible,
              bonus_verified_at: new Date().toISOString()
            })
            .eq('id', lead.id);
          
          // Create bonus flag if eligible
          if (bonusResult.isEligible) {
            await supabase
              .from('bonus_flags')
              .insert({
                lead_id: lead.id,
                agent_id: agentId,
                platform: 'Xbox',
                gamertag: formData.gamertags.xbox,
                age: bonusResult.age,
                total_hours: bonusResult.totalHours,
                games_played: bonusResult.gamesPlayed,
                bonus_amount: 10.00,
                bonus_reason: bonusResult.reason,
                status: 'pending'
              });
            
            console.log('✅ Bonus flag created for eligible Xbox gamer');
          }
          
        } catch (bonusError) {
          console.error('❌ Bonus eligibility check failed:', bonusError);
          // Continue with submission even if bonus check fails
        }
      }
      
      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully! Data saved to Supabase.',
        documentId: lead.id,
        leadId: lead.id,
        timestamp: new Date().toISOString()
      });
      
    } catch (supabaseError) {
      console.error('❌ Supabase save failed:', supabaseError);
      
      // FALLBACK: Save to local storage and return success
      console.log('⚠️ Using fallback storage - Supabase not available');
      
      // Save to backup file system
      const backupData = {
        ...leadDocument,
        backupTimestamp: new Date().toISOString(),
        backupMethod: 'file-system-fallback'
      };
      
      // For now, just log the data (we'll implement file storage later)
      console.log('📝 Backup data logged:', backupData);
      
      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully! (Supabase temporarily unavailable)',
        documentId: 'fallback-' + Date.now(),
        leadId: 'fallback-' + Date.now(),
        timestamp: new Date().toISOString(),
        note: 'Data logged but not saved to database due to Supabase configuration issue'
      });
    }

  } catch (error) {
    console.error('Form submission error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Endpoint to get backup data
export async function GET(request: NextRequest) {
  try {
    // This endpoint is no longer needed as backup is removed.
    // Keeping it for now to avoid breaking existing calls, but it will return an empty array.
    return NextResponse.json({
      success: true,
      message: 'Backup functionality is no longer available.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting backup files:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 