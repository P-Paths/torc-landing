# 🚀 Vercel Deployment Guide

## 📋 **Pre-Deployment Checklist**

### **1. Update Production URLs**
Before deploying, update the QR code generator to use your production domain:

**File:** `components/QRCodeGenerator.js`
```javascript
const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://your-vercel-domain.vercel.app' // Update this with your actual Vercel domain
  : 'http://localhost:3000';
```

### **2. Environment Variables**
Set up these environment variables in Vercel:

**Firebase Configuration:**
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**Firebase Admin (for server-side):**
```bash
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PROJECT_ID=your-project-id
```

**Gaming APIs:**
```bash
OPENXBL_API_KEY=your_xbox_api_key
STEAM_API_KEY=your_steam_api_key
PSN_NPSSO_TOKEN=your_playstation_token
```

## 🚀 **Deploy to Vercel**

### **Step 1: Connect to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with your GitHub account
3. Click "New Project"
4. Import your repository

### **Step 2: Configure Project**
- **Framework Preset:** Next.js
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)

### **Step 3: Set Environment Variables**
1. In your Vercel project dashboard
2. Go to "Settings" → "Environment Variables"
3. Add all the environment variables listed above

### **Step 4: Deploy**
1. Click "Deploy"
2. Wait for build to complete
3. Your site will be live at `https://your-project.vercel.app`

## 🔧 **Post-Deployment Setup**

### **1. Update QR Code URLs**
After deployment, update the QR code generator with your actual Vercel domain:

**File:** `components/QRCodeGenerator.js`
```javascript
const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://your-project.vercel.app' // Your actual Vercel domain
  : 'http://localhost:3000';
```

### **2. Test QR Codes**
1. Go to your deployed site: `https://your-project.vercel.app/admin`
2. Login with agent credentials
3. Generate QR codes for different agents
4. Test scanning with your phone

### **3. Set Up Custom Domain (Optional)**
1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain (e.g., `yoursite.com`)
3. Update QR code URLs to use your custom domain

## 🔐 **Agent Authentication**

### **Demo Credentials:**
- **Agent ID:** AHRPE5559 | **Password:** agent123
- **Agent ID:** BHRPE6660 | **Password:** agent456  
- **Agent ID:** CHRPE7771 | **Password:** agent789

### **Access Points:**
- **Agent Login:** `https://your-domain.vercel.app/agent-login`
- **Admin Dashboard:** `https://your-domain.vercel.app/admin`
- **Public Site:** `https://your-domain.vercel.app/`

## 📱 **QR Code Testing**

### **Test the Complete Funnel:**
1. **Generate QR code** for agent AHRPE5559
2. **Scan with phone** - should land on agent page
3. **Click "See if you qualify"** - should go to enhanced intake form
4. **Fill out form** - should save to Firestore
5. **Check admin dashboard** - should see the lead

### **QR Code URLs:**
- Agent AHRPE5559: `https://your-domain.vercel.app/agent/AHRPE5559`
- Agent BHRPE6660: `https://your-domain.vercel.app/agent/BHRPE6660`
- Agent CHRPE7771: `https://your-domain.vercel.app/agent/CHRPE7771`

## 🎯 **Production Features**

### **✅ What Works:**
- Agent-specific landing pages
- QR code generation and scanning
- Enhanced intake form with Firestore
- Agent authentication system
- Admin dashboard with lead tracking
- Mobile-responsive design

### **🔧 What to Configure:**
- Firebase environment variables
- Gaming API keys
- Custom domain (optional)
- Production QR code URLs

## 🚨 **Troubleshooting**

### **QR Code Not Scanning:**
- Check that QR code points to production URL (not localhost)
- Ensure domain is accessible from mobile
- Test with different QR code scanner apps

### **Firebase Connection Issues:**
- Verify all Firebase environment variables are set
- Check Firebase project settings
- Ensure Firestore database is created

### **Agent Login Issues:**
- Clear browser cache and localStorage
- Check that agent credentials are correct
- Verify agent login page is accessible

## 📞 **Support**

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test QR codes with production URLs
4. Ensure Firebase is properly configured

**Your site will be live and ready for physical marketing!** 🎉 