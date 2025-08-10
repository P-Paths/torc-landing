import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await params;
    console.log(`🗑️ Attempting to delete lead: ${leadId}`);

    const supabase = createServerSupabaseClient();

    // Delete the lead from the database
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId);

    if (error) {
      console.error('❌ Error deleting lead:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to delete lead from database',
        details: error.message
      }, { status: 500 });
    }

    console.log(`✅ Lead ${leadId} deleted successfully`);
    
    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully',
      leadId: leadId
    });

  } catch (error) {
    console.error('❌ Unexpected error deleting lead:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
