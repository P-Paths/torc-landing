# 🚀 Quick Reference Guide - TORC Landing

## 🔐 **LOGIN URLs & CREDENTIALS**

### **Agent/Staff Login**
- **URL**: `http://localhost:3000/agent-login`
- **Demo Credentials**:
  - Username: `john` | Password: `agent123`
  - Username: `sarah` | Password: `agent456`
  - Username: `mike` | Password: `agent789`

### **Agent Dashboard** (After Login)
- **URL**: `http://localhost:3000/agent-dashboard`
- **Access**: Login with agent credentials above
- **Features**: 
  - ✅ **Live Gaming Platform Tracking** (Xbox, PlayStation, Steam)
  - ✅ **Client Registration & Management**
  - ✅ **Address Verification**
  - ✅ **Zoom Meeting Tracking**
  - ✅ **Lead Status Management** (New → Contacted → Registered → Zoom Scheduled → Zoom Completed → Converted)
  - ✅ **Performance Metrics** (Conversion Rate, Emergency Cases)
  - ✅ **Gaming Profile Lookup Tool** (Beautiful interface with profile pictures, stats cards, and game breakdowns)

### **Admin Dashboard** (Separate Access)
- **URL**: `http://localhost:3000/admin`
- **Access**: Admin password required
- **Features**: 
  - ✅ **Everything from Agent Dashboard** (but for all agents)
  - ✅ **Agent Performance Comparison**
  - ✅ **Platform Analytics** (Xbox, PlayStation, Steam) with beautiful pie charts
  - ✅ **Horizontal Gaming Profiles** - Beautiful cards showing recent gaming profiles
  - ✅ **Agent Users Block** - Horizontal layout showing agents and their Zoom registrations
  - ✅ **Zoom Meetings Column** - Large dedicated section for meeting tracking
  - ✅ **Interactive Charts** - Line charts and geographical maps for analytics
  - ✅ **Advanced Reporting**
  - ✅ **Agent Management** (Add, Edit, Deactivate)
  - ✅ **Full Lead Management**
  - ✅ **Zoom Meeting Tracking**

---

## 👥 **USER ACCESS POINTS**

### **Main Landing Page**
- **URL**: `http://localhost:3000`
- **Purpose**: Public gaming addiction treatment landing page
- **Features**: Hero sections, treatment info, testimonials

### **Enhanced Intake Form**
- **URL**: `http://localhost:3000/enhanced-intake`
- **Purpose**: Multi-step gaming assessment form
- **Features**: Real-time Firebase submission, agent tracking

### **Agent-Specific Landing Pages**
- **URL Pattern**: `http://localhost:3000/agent/[AGENT_ID]`
- **Examples**:
  - `http://localhost:3000/agent/AHRPE5559`
  - `http://localhost:3000/agent/BHRPE6660`
  - `http://localhost:3000/agent/CHRPE7771`
- **Purpose**: Personalized pages for QR code marketing

---

## 🔄 **USER FLOWS**

### **For Staff/Agents**:
1. **Login**: `http://localhost:3000/agent-login`
2. **Dashboard**: `http://localhost:3000/agent-dashboard`
3. **Generate QR Codes**: Link to agent pages (e.g., `/agent/AHRPE5559`)

### **For Families/Users**:
1. **Landing Page**: `http://localhost:3000`
2. **Assessment Form**: `http://localhost:3000/enhanced-intake`
3. **Agent-Specific**: `http://localhost:3000/agent/AHRPE5559` (via QR code)

---

## 🎯 **KEY FEATURES BY URL**

| URL | Purpose | Key Features |
|-----|---------|--------------|
| `/` | Main landing page | Hero sections, treatment info |
| `/agent-login` | Staff authentication | Username/password login |
| `/agent-dashboard` | Agent dashboard | Personal leads, gaming lookup |
| `/admin` | Admin dashboard | All leads, full analytics |
| `/enhanced-intake` | Assessment form | Multi-step, Firebase integration |
| `/agent/[ID]` | Agent pages | Personalized, QR code ready |

---

## 🔥 **FIREBASE STATUS**
- **Connected**: ✅ Yes
- **Project**: `gaming-funnel-1fdf3`
- **Real-time**: ✅ Working
- **Form Submissions**: ✅ Saving to Firestore

---

## 🚀 **DEPLOYMENT READY**
- **Local**: `http://localhost:3000`
- **Production**: Ready for Cloud Run deployment
- **Environment**: `.env.local` configured

## 🔧 **API CONFIGURATION NEEDED**
To enable real gaming data lookup, add these API keys to `.env.local`:

```bash
# GAMING APIs
OPENXBL_API_KEY=your_xbox_api_key_here
STEAM_API_KEY=your_steam_api_key_here
PSN_NPSSO_TOKEN=your_playstation_token_here
```

**Current Status**:
- ✅ **Firebase**: Fully connected
- ✅ **Agent Dashboard**: Live with real data
- ✅ **Admin Dashboard**: Enhanced with pie charts and regional analytics
- ✅ **Steam API**: **WORKING PERFECTLY** - Getting real gaming data!
- ⚠️ **Xbox API**: Connected but needs valid gamertags
- ⚠️ **PlayStation API**: Ready for NPSSO token setup
- ✅ **Form Fields**: Fixed visibility issues

---

**📝 Quick Notes:**
- All agent logins redirect to admin dashboard
- Agent pages track submissions with agent ID
- Firebase stores all form data in real-time
- **Beautiful Gaming Profile Display**: Professional interface with profile pictures, formatted hours, qualification status, and top games
- **Real Gaming Data**: Steam API returning 3,815 hours, 24 games, detailed game breakdowns
- **User-Friendly Interface**: No more JSON code - clean, readable gaming profiles 