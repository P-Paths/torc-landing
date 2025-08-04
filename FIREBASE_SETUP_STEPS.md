# Firebase Setup with Application Default Credentials (ADC)

## Problem
Your application is getting the error: "Unable to detect a Project Id in the current environment" because the Firebase Admin SDK isn't properly configured with Application Default Credentials.

## Solution
We've updated your Firebase Admin SDK configuration to use Application Default Credentials (ADC) instead of service account keys. This is the preferred approach for Google Cloud Workload Identity Federation.

## Setup Steps

### 1. Install Google Cloud CLI (if not already installed)
```bash
# macOS
brew install google-cloud-sdk

# Or download from: https://cloud.google.com/sdk/docs/install
```

### 2. Authenticate with Google Cloud
```bash
# Login to your Google Cloud account
gcloud auth login

# Set up Application Default Credentials
gcloud auth application-default login
```

### 3. Set your project ID
```bash
# Replace 'your-project-id' with your actual Firebase project ID
gcloud config set project your-project-id
```

### 4. Verify your environment variables
Make sure your `.env.local` file has the correct Firebase project ID:

```env
# FIREBASE CLIENT (Required for frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 5. Test the connection
After setting up ADC, test your Firebase connection:

```bash
# Test the API endpoint
curl http://localhost:3000/api/test-firebase
```

## What Changed

### Before (Service Account Keys)
- Required service account JSON file
- Manual credential management
- Security risks with key storage

### After (Application Default Credentials)
- Automatic credential detection
- Uses `gcloud auth application-default login`
- More secure and easier to manage
- Works with Google Cloud Workload Identity Federation

## Code Changes Made

1. **Updated Firebase Admin SDK initialization** in all API routes:
   - Added `applicationDefault()` import
   - Uses ADC as the primary authentication method
   - Falls back to service account keys only if needed
   - Better error handling and fallback strategies

2. **Files updated**:
   - `src/lib/firebase-admin.ts`
   - `src/lib/firebase-admin-new.ts`
   - `src/app/api/submit-enhanced-lead/route.ts`
   - `src/app/api/submit-form/route.ts`
   - `src/app/api/admin/stats/route.ts`
   - `src/app/api/admin/agents/route.ts`
   - `src/app/api/admin/leads/route.ts`

## Troubleshooting

### If you still get authentication errors:

1. **Check if ADC is set up correctly**:
   ```bash
   gcloud auth application-default print-access-token
   ```

2. **Verify your project ID**:
   ```bash
   gcloud config get-value project
   ```

3. **Check environment variables**:
   ```bash
   echo $NEXT_PUBLIC_FIREBASE_PROJECT_ID
   ```

4. **Test with a simple API call**:
   ```bash
   curl http://localhost:3000/api/test-firebase-simple
   ```

### For Production Deployment

If deploying to Vercel or other platforms:

1. **Set environment variables** in your deployment platform
2. **Use service account keys** for production (the code will fall back to this)
3. **Or set up Workload Identity Federation** for more secure authentication

## Benefits of This Approach

- ✅ **More secure**: No need to store service account keys
- ✅ **Easier management**: Automatic credential rotation
- ✅ **Better for development**: Uses local gcloud credentials
- ✅ **Production ready**: Works with Google Cloud Workload Identity Federation
- ✅ **Backward compatible**: Still supports service account keys if needed

## Next Steps

1. Run `gcloud auth application-default login`
2. Set your project ID: `gcloud config set project your-project-id`
3. Restart your development server
4. Test the form submission again

The authentication errors should now be resolved! 