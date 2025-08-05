// Script to help get Firebase configuration
const { execSync } = require('child_process');

console.log('🔧 Getting Firebase Configuration...\n');

try {
  // Get project info
  const projectId = execSync('gcloud config get-value project', { encoding: 'utf8' }).trim();
  console.log(`✅ Project ID: ${projectId}`);
  
  // Get project number
  const projectNumber = execSync(`gcloud projects describe ${projectId} --format="value(projectNumber)"`, { encoding: 'utf8' }).trim();
  console.log(`✅ Project Number: ${projectNumber}`);
  
  console.log('\n📋 Next Steps:');
  console.log('1. Go to https://console.firebase.google.com/');
  console.log(`2. Select project: ${projectId}`);
  console.log('3. Click "Add app" → Web app');
  console.log('4. Copy the config values');
  console.log('5. Update env.production with real values');
  
  console.log('\n🔑 Required Firebase Config Values:');
  console.log(`- apiKey: (get from Firebase Console)`);
  console.log(`- authDomain: ${projectId}.firebaseapp.com`);
  console.log(`- projectId: ${projectId}`);
  console.log(`- storageBucket: ${projectId}.appspot.com`);
  console.log(`- messagingSenderId: ${projectNumber}`);
  console.log(`- appId: (get from Firebase Console)`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
} 