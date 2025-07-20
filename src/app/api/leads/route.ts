import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        agentName: true,
        relation: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      leads 
    });

  } catch (error) {
    console.error('Error fetching leads:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch leads',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 