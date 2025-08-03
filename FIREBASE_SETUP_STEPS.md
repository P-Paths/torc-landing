# 🔥 Firebase Console Setup - Step by Step

## 🎯 **Goal: Enable Firestore Database and Get Config**

### **Step 1: Access Firebase Console**
- ✅ Firebase Console should now be open in your browser
- If not, go to: https://console.firebase.google.com/

### **Step 2: Select Project**
1. Look for project dropdown (top left)
2. Select: **`gaming-funnel`**
3. If you don't see it, click "Add project" and select existing project

### **Step 3: Enable Firestore Database**
1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"** button
3. Choose **"Start in test mode"** (we can add security rules later)
4. Select region: **`us-central1`** (recommended)
5. Click **"Enable"**

### **Step 4: Get Firebase Config**
1. Click the **gear icon** (⚙️) next to "Project Overview" in left sidebar
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click **"Add app"** button
5. Choose **"Web"** (</> icon)
6. Give it a nickname: **"torc-landing"**
7. Click **"Register app"**
8. **Copy the config values** - you'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "gaming-funnel.firebaseapp.com",
  projectId: "gaming-funnel",
  storageBucket: "gaming-funnel.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### **Step 5: Update Environment Variables**
1. Copy the values from the config above
2. Update your `.env.local` file:

```bash
# Replace these with your actual values from Firebase Console
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC... (your actual apiKey)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gaming-funnel.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gaming-funnel
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gaming-funnel.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789 (your actual senderId)
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef (your actual appId)
```

### **Step 6: Test the Setup**
1. Save the `.env.local` file
2. The dev server should automatically reload
3. Visit: http://localhost:3001
4. Click "Start Gaming Addiction Assessment"
5. Fill out the form and submit
6. Check Firebase Console → Firestore Database to see the data

---

## 🧪 **Testing Checklist**

### **✅ What Should Work After Setup:**
- [ ] Form submission saves to Firestore
- [ ] Admin dashboard shows real-time data
- [ ] No console errors in browser
- [ ] Data appears in Firebase Console

### **❌ Common Issues:**
- **"Firebase not initialized"** → Check API key in .env.local
- **"Permission denied"** → Firestore not in test mode
- **"Project not found"** → Wrong project ID

---

## 🚀 **Next Steps After Firebase Setup**

### **1. Test Locally**
```bash
# The dev server should already be running
# Visit http://localhost:3001 and test the form
```

### **2. Deploy to Production**
```bash
./deploy.sh
```

### **3. Set Production Environment Variables**
```bash
gcloud run services update torc-landing \
  --region us-central1 \
  --update-env-vars="NEXT_PUBLIC_FIREBASE_API_KEY=your_key,NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gaming-funnel.firebaseapp.com"
```

---

## 📊 **What You'll Have After Setup**

✅ **Real-time Form Submissions** - Data saves to Firestore instantly  
✅ **Admin Dashboard** - View all leads in real-time  
✅ **Agent Tracking** - Every lead tied to specific agent  
✅ **Gaming Profile Analysis** - Real API data integration  
✅ **Commission System** - Ready for payment processing  

---

**Status**: Ready for Firebase Console configuration! 🔥 