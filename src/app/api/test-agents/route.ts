import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin-wif';

export async function GET() {
  try {
    console.log('Testing Firebase connection...');
    
    // Test basic Firestore operations
    const testDoc = await adminDb.collection('test').add({
      test: true,
      timestamp: new Date()
    });
    
    console.log('Test document created with ID:', testDoc.id);
    
    // Clean up test document
    await adminDb.collection('test').doc(testDoc.id).delete();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Firebase connection working',
      testDocId: testDoc.id
    });
  } catch (error) {
    console.error('Firebase test failed:', error);
    return NextResponse.json({ 
      error: 'Firebase connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Test agent creation with data:', body);
    
    const { name, agentId, password, email, phone } = body;
    
    if (!name || !agentId || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Test agent creation
    const newAgent = {
      name,
      agentId,
      password,
      email: email || '',
      phone: phone || '',
      createdAt: new Date(),
      isActive: true
    };
    
    console.log('Creating test agent:', newAgent);
    const docRef = await adminDb.collection('agents').add(newAgent);
    
    console.log('Agent created with ID:', docRef.id);
    
    return NextResponse.json({ 
      success: true,
      id: docRef.id,
      agent: newAgent
    });
  } catch (error) {
    console.error('Test agent creation failed:', error);
    return NextResponse.json({ 
      error: 'Test agent creation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
