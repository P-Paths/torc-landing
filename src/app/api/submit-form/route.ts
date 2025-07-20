import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create a new lead in the database
    const lead = await prisma.lead.create({
      data: {
        agentName: body.agentName,
        relation: body.relation,
        isMinor: body.isMinor,
        firstName: body.firstName,
        middleName: body.middleName,
        lastName: body.lastName,
        suffix: body.suffix,
        gender: body.gender,
        email: body.email,
        phone: body.phone,
        secondaryPhone: body.secondaryPhone,
        address1: body.address1,
        address2: body.address2,
        city: body.city,
        state: body.state,
        zip: body.zip,
        dob: body.dob,
        ssn: body.ssn,
        signedWithAttorney: body.signedWithAttorney,
        legalFullName: body.legalFullName,
        inSchool: body.inSchool,
        education: body.education,
        startDate: body.startDate,
        avgHours: body.avgHours,
        platforms: body.platforms,
        games: body.games,
        firstGame: body.firstGame,
        gameHistory: body.gameHistory,
        subscriptions: body.subscriptions,
        cloudSub: body.cloudSub,
        vrAccessories: body.vrAccessories,
        receipts: body.receipts,
        monthlySpend: body.monthlySpend,
        proof: body.proof,
        triedToStop: body.triedToStop,
        watchedInfluencers: body.watchedInfluencers,
        paidForItems: body.paidForItems,
        soldContent: body.soldContent,
        energyDrink: body.energyDrink,
        symptoms: body.symptoms,
        injuries: body.injuries,
        lifeEffects: body.lifeEffects,
        treatments: body.treatments,
        diagnosedByProvider: body.diagnosedByProvider,
        medication: body.medication,
        otherConditions: body.otherConditions,
        filedLawsuit: body.filedLawsuit,
        convicted: body.convicted,
        ssdi: body.ssdi,
        ssi: body.ssi,
        emergencyName: body.emergencyName,
        emergencyPhone: body.emergencyPhone,
        emergencyRelation: body.emergencyRelation,
        notes: body.notes,
        consent: body.consent,
        status: 'PENDING',
      },
    });

    // Log the submission
    await prisma.submissionLog.create({
      data: {
        leadId: lead.id,
        target: 'internal',
        status: 'SUCCESS',
        response: 'Lead created successfully',
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Form submitted successfully',
      leadId: lead.id 
    });

  } catch (error) {
    console.error('Error submitting form:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to submit form',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 