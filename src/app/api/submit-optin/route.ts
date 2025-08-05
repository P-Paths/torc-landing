import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Save the opt-in data to Firestore
    const optInData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      status: 'optin_completed',
      nextStep: 'vga_form_email_sent'
    };

    // TODO: Save to Firestore here
    console.log('Opt-in data received:', optInData);

    // Generate unique token for VGA form
    const vgaToken = Math.random().toString(36).substr(2, 15);
    
    // Create VGA form URL with pre-filled data
    const vgaFormUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/vga-form?token=${vgaToken}&email=${encodeURIComponent(formData.email)}`;
    
    // TODO: Send email with VGA form link
    // For now, we'll simulate the email sending
    console.log('VGA Form URL generated:', vgaFormUrl);
    
    // Store the token and form data for later retrieval
    // TODO: Save to Firestore with token as key
    
    return NextResponse.json({
      success: true,
      message: 'Opt-in form submitted successfully. Check your email for the VGA form.',
      vgaFormUrl: vgaFormUrl, // For testing - remove in production
      token: vgaToken
    });

  } catch (error) {
    console.error('Error processing opt-in form:', error);
    return NextResponse.json({
      success: false,
      message: 'Error processing form submission'
    }, { status: 500 });
  }
} 