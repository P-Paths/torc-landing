import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      return NextResponse.json({
        success: false,
        error: 'Missing required contact information'
      }, { status: 400 });
    }

    // Calculate bonus eligibility
    const age = new Date().getFullYear() - parseInt(formData.dobYear || '0');
    const hasXbox = formData.platforms?.includes('Xbox') || false;
    const enoughHours = formData.has1200Hours === 'Yes';
    const validGames = ['Call of Duty', 'Grand Theft Auto', 'Fortnite', 'Minecraft', 'Roblox'];
    const playedBonusGame = formData.games?.some((game: string) => validGames.includes(game)) || false;
    const isBonusEligible = age <= 22 && hasXbox && enoughHours && playedBonusGame;

    // Prepare lead data for Firestore
    const leadData = {
      ...formData,
      timestamp: new Date(),
      status: 'new',
      bonusEligible: isBonusEligible,
      age: age,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // In development, just return success
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully (development mode)',
        bonusEligible: isBonusEligible,
        environment: 'development',
        note: 'In production, this would be saved to Firestore'
      });
    }

    // Production: Save to Firestore
    const { adminDb } = await import('../../../../lib/firebase-admin');
    
    const docRef = await adminDb.collection('leads').add(leadData);

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      leadId: docRef.id,
      bonusEligible: isBonusEligible,
      environment: 'production'
    });

  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Failed to submit form data'
    }, { status: 500 });
  }
} 