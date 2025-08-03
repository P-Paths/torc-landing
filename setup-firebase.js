#!/usr/bin/env node

// Firebase Setup Helper Script
// This script helps configure Firebase for the TORC Landing Page

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Setup for TORC Landing Page');
console.log('=====================================\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env.local file found');
} else {
  console.log('⚠️  .env.local file not found - will create template');
}

console.log('\n📋 Firebase Configuration Steps:');
console.log('1. Go to https://console.firebase.google.com/');
console.log('2. Select project: gaming-funnel');
console.log('3. Enable Firestore Database:');
console.log('   - Click "Firestore Database"');
console.log('   - Click "Create database"');
console.log('   - Choose "Start in test mode"');
console.log('   - Select region: us-central1');
console.log('\n4. Get Firebase Config:');
console.log('   - Go to Project Settings (gear icon)');
console.log('   - Scroll to "Your apps" section');
console.log('   - Click "Add app" → Web app');
console.log('   - Copy the config values below');

console.log('\n🔧 Environment Variables Template:');
console.log('Create a .env.local file with:');
console.log('');
console.log('# FIREBASE CLIENT');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here');
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gaming-funnel.firebaseapp.com');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID=gaming-funnel');
console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gaming-funnel.appspot.com');
console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789');
console.log('NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef');
console.log('');
console.log('# GAMING APIS (Optional for now)');
console.log('OPENXBL_API_KEY=your_xbox_api_key');
console.log('STEAM_API_KEY=your_steam_api_key');
console.log('PSN_NPSSO_TOKEN=your_playstation_token');

console.log('\n🚀 After Firebase Setup:');
console.log('1. Run: npm run dev (to test locally)');
console.log('2. Run: ./deploy.sh (to deploy to Cloud Run)');
console.log('3. Test the enhanced intake form');
console.log('4. Verify admin dashboard functionality');

console.log('\n📊 Current Project Status:');
console.log('✅ GitHub: https://github.com/P-Paths/torc-landing');
console.log('✅ Google Cloud Project: gaming-funnel');
console.log('✅ Workload Identity Federation: Working');
console.log('✅ Enhanced Intake Form: Ready');
console.log('✅ Admin Dashboard: Ready');
console.log('✅ Agent Tracking: Ready');

console.log('\n🎯 Next Steps:');
console.log('1. Complete Firebase Console setup');
console.log('2. Add environment variables');
console.log('3. Test locally');
console.log('4. Deploy to production'); 