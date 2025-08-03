# 🚀 Quick Setup Guide - TORC Landing Page

## ⚡ **5-Minute Setup**

### **Step 1: Firebase Console Setup**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `gaming-funnel`
3. Enable Firestore Database:
   - Click "Firestore Database"
   - Click "Create database"
   - Choose "Start in test mode"
   - Select region: `us-central1`

### **Step 2: Get Firebase Config**
1. In Firebase Console → Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Add app" → Web app
4. Copy the config values

### **Step 3: Environment Variables**
```bash
# Copy the template and fill in your values
cp env.template .env.local

# Edit .env.local with your Firebase config
nano .env.local
```

### **Step 4: Test Locally**
```bash
npm run dev
# Visit http://localhost:3000
```

### **Step 5: Deploy to Production**
```bash
./deploy.sh
```

---

## 🔧 **Environment Variables Needed**

Copy `env.template` to `.env.local` and fill in:

```bash
# FIREBASE CLIENT (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gaming-funnel.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gaming-funnel
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gaming-funnel.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# GAMING APIS (Optional for now)
OPENXBL_API_KEY=your_xbox_api_key
STEAM_API_KEY=your_steam_api_key
PSN_NPSSO_TOKEN=your_playstation_token
```

---

## 🧪 **Testing Checklist**

### **Local Testing**
- [ ] `npm run dev` starts successfully
- [ ] Visit `http://localhost:3000` - landing page loads
- [ ] Click "Start Gaming Addiction Assessment" - form loads
- [ ] Fill out form and submit - data saves to Firestore
- [ ] Visit `http://localhost:3000/admin` - admin dashboard loads

### **Production Testing**
- [ ] Deploy with `./deploy.sh`
- [ ] Visit production URL
- [ ] Test form submission
- [ ] Verify admin dashboard

---

## 📊 **What's Working**

✅ **Enhanced Intake Form** - Multi-step with Firestore submission  
✅ **Admin Dashboard** - Real-time lead management  
✅ **Gaming Profile Lookup** - Xbox/Steam/PlayStation APIs  
✅ **Agent Tracking** - Commission-based lead tracking  
✅ **Real-time Data** - Firestore integration complete  

---

## 🎯 **Next Steps**

1. **Complete Firebase Console setup**
2. **Add environment variables**
3. **Test locally**
4. **Deploy to production**
5. **Test form submissions**
6. **Verify admin dashboard**

---

**Status**: Ready for Firebase setup and deployment! 🚀 