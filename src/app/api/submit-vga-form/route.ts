import { NextRequest, NextResponse } from 'next/server';
import { formstackAutomation, VGAFormData } from '../../../lib/formstack-automation';

export async function POST(request: NextRequest) {
  try {
    const formData: VGAFormData = await request.json();

    // Validate required fields based on relationship
    const baseRequiredFields = [
      'agentId', 'relationshipWithIndividual', 'fullNameSigning',
      'isCurrentlyInSchool', 'highestEducationLevel', 'firstStartedPlayingDate',
      'averageGamesPerDay', 'firstVideoGame', 'gameDetails'
    ];

    let requiredFields = [...baseRequiredFields];

    // Add conditional required fields based on relationship
    if (formData.relationshipWithIndividual === 'myself') {
      requiredFields.push('isPersonMinor', 'injuredPartyName', 'injuredPartyGender',
        'injuredPartyAddress', 'injuredPartyPhone', 'callerPhone', 'injuredPartyDateOfBirth',
        'injuredPartySSN');
    }

    // Add conditional required fields for school
    if (formData.isCurrentlyInSchool === 'Yes') {
      requiredFields.push('schoolName', 'schoolAddress');
    }

    const missingFields = requiredFields.filter(field => !formData[field as keyof VGAFormData]);

    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Initialize and run automation
    await formstackAutomation.initialize();
    const result = await formstackAutomation.fillFormstackForm(formData);
    await formstackAutomation.close();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully to Formstack',
        agentId: formData.agentId,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `Failed to submit form: ${result.message}`
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error submitting VGA form:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
} 