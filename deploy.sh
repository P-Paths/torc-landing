#!/bin/bash

# TORC Landing Page Deployment Script
# This script deploys the application to Google Cloud Run

echo "🚀 Starting TORC Landing Page Deployment..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI not found. Please install it first."
    exit 1
fi

# Check if we're authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Not authenticated with Google Cloud. Please run: gcloud auth login"
    exit 1
fi

# Set the project
echo "📋 Setting project to gaming-funnel..."
gcloud config set project gaming-funnel

# Build the application
echo "🔨 Building the application..."
npm run build

# Deploy to Cloud Run
echo "🚀 Deploying to Google Cloud Run..."
gcloud run deploy torc-landing \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_FIREBASE_PROJECT_ID=gaming-funnel" \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10

echo "✅ Deployment complete!"
echo "🌐 Your application should be available at the URL shown above."
echo ""
echo "📋 Next steps:"
echo "1. Set up Firebase Console and enable Firestore"
echo "2. Configure environment variables in Cloud Run"
echo "3. Test the enhanced intake form"
echo "4. Verify admin dashboard functionality" 