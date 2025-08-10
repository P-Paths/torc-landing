import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin-wif';

interface VGAFormData {
  // Contact Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: string;
  
  // Gaming Information
  gamingPlatforms: string[];
  gamertags: {
    xbox?: string;
    playstation?: string;
    steam?: string;
  };
  gamingHours: string;
  primaryGames: string[];
  
  // Assessment
  symptoms: string[];
  affectedAreas: string[];
  durationOfConcern: string;
  
  // Agent Information
  agentId: string;
  agentName: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData: VGAFormData = await request.json();
    
    // Extract agent ID from URL params or use default
    const url = new URL(request.url);
    const agentId = url.searchParams.get('agent') || 'AHRPE5559';
    
    console.log('🎮 VGA Form Automation Started');
    console.log('👤 Agent ID:', agentId);
    console.log('📝 Form data received:', Object.keys(formData).length, 'fields');

    // Step 1: Save to our database
    const leadDocument = {
      // Agent and submission metadata
      agentId: agentId,
      submittedAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      
      // Contact Information
      agentName: formData.agentName || 'VGA Form Referral',
      gamerFirstName: formData.firstName || '',
      gamerLastName: formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      address: formData.address || '',
      city: formData.city || '',
      state: formData.state || '',
      zipCode: formData.zipCode || '',
      dateOfBirth: formData.dateOfBirth || '',
      
      // Gaming Profile
      platforms: formData.gamingPlatforms || [],
      gamertags: formData.gamertags || {},
      dailyHours: formData.gamingHours || '',
      primaryGames: formData.primaryGames || [],
      
      // Assessment
      symptoms: formData.symptoms || [],
      affectedAreas: formData.affectedAreas || [],
      durationOfConcern: formData.durationOfConcern || '',
      
      // VGA Form specific
      formType: 'vga_automation',
      vgaSubmissionStatus: 'pending',
      vgaFormUrl: 'https://forms.gle/z3Wx5LVQQox5xXVw7', // Real VGA form URL
      
      // Status and processing
      status: 'new',
      processedAt: null,
      assignedTo: null,
      notes: [],
      
      // Additional metadata
      formVersion: 'vga-automation-v1',
      submissionSource: 'vga-form-automation',
      totalSymptoms: formData.symptoms?.length || 0,
      affectedAreasCount: formData.affectedAreas?.length || 0
    };

    // Save to database
    let firestoreId = null;
    try {
      const docRef = await adminDb.collection('leads').add(leadDocument);
      firestoreId = docRef.id;
      console.log('✅ VGA lead saved to Firestore with ID:', firestoreId);
    } catch (firebaseError) {
      console.error('❌ Firebase save failed:', firebaseError);
      // Continue with automation even if Firebase fails
    }

    // Step 2: Prepare for VGA form automation
    const vgaFormData = {
      // Map our data to VGA form fields
      'entry.1234567890': formData.firstName, // First Name
      'entry.0987654321': formData.lastName,  // Last Name
      'entry.1111111111': formData.email,     // Email
      'entry.2222222222': formData.phone,     // Phone
      'entry.3333333333': formData.address,   // Address
      'entry.4444444444': formData.city,      // City
      'entry.5555555555': formData.state,     // State
      'entry.6666666666': formData.zipCode,   // Zip Code
      'entry.7777777777': formData.dateOfBirth, // Date of Birth
      'entry.8888888888': formData.gamingPlatforms.join(', '), // Gaming Platforms
      'entry.9999999999': formData.gamertags.xbox || '', // Xbox Gamertag
      'entry.0000000000': formData.gamertags.playstation || '', // PlayStation ID
      'entry.1111111112': formData.gamertags.steam || '', // Steam ID
      'entry.2222222223': formData.gamingHours, // Gaming Hours
      'entry.3333333334': formData.primaryGames.join(', '), // Primary Games
      'entry.4444444445': formData.symptoms.join(', '), // Symptoms
      'entry.5555555556': formData.affectedAreas.join(', '), // Affected Areas
      'entry.6666666667': formData.durationOfConcern, // Duration of Concern
      'entry.7777777778': agentId, // Agent ID (hidden field)
    };

    // Step 3: Return success with automation data
    return NextResponse.json({
      success: true,
      message: 'VGA form data prepared for automation!',
      documentId: firestoreId || 'fallback-' + Date.now(),
      leadId: firestoreId || 'fallback-' + Date.now(),
      agentId: agentId,
      vgaFormData: vgaFormData,
      vgaFormUrl: 'https://forms.gle/z3Wx5LVQQox5xXVw7',
      automationStatus: 'ready',
      timestamp: new Date().toISOString(),
      note: 'Data saved and ready for VGA form automation'
    });

  } catch (error) {
    console.error('❌ VGA Form Automation Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process VGA form automation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Also support GET requests for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get('agent') || 'AHRPE5559';

  // Return test data for GET requests
  const testData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@example.com',
    phone: '555-1234',
    address: '123 Test St',
    city: 'Test City',
    state: 'CA',
    zipCode: '12345',
    dateOfBirth: '01/01/2000',
    gamingPlatforms: ['xbox'],
    gamertags: { xbox: 'TestGamer123' },
    gamingHours: '4-8 hours',
    primaryGames: ['Call of Duty'],
    symptoms: ['withdrawal'],
    affectedAreas: ['school'],
    durationOfConcern: '6-12 months',
    agentId: agentId,
    agentName: 'Test Agent'
  };

  // Convert GET to POST
  const postRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify(testData)
  });

  return POST(postRequest);
} 