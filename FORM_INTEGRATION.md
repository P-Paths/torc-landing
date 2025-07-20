# TORC Form Integration Guide

## 🔗 **Google Form Link**
The official Google Form is located at: **`https://forms.gle/z3Wx5LVQQox5xXVw7`**

## 📋 **How the Form Integration Works**

### **1. Custom Form (OptInForm.tsx)**
- **Purpose**: Provides a better user experience with conditional logic and validation
- **Features**: 
  - Progressive disclosure based on user selections
  - Dynamic labels that change based on context
  - Comprehensive validation
  - Visual organization with color-coded sections

### **2. Form Submission Flow**
1. **User fills out custom form** → Validation occurs
2. **Data is saved to database** → Via `/api/submit-form` endpoint
3. **User is redirected to Google Form** → Official intake form opens in new tab
4. **Data is stored locally** → In localStorage for convenience

### **3. Database Storage**
- **Schema**: Uses Prisma with PostgreSQL
- **Tables**: 
  - `leads` - Main form data
  - `submission_logs` - Track submission attempts
  - `agents` - Agent referral tracking

### **4. Admin Dashboard**
- **URL**: `/admin`
- **Features**: View all submitted leads with status tracking
- **API**: `/api/leads` - Fetches lead data

## 🛠 **Setup Instructions**

### **1. Database Setup**
```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push

# Set environment variables
DATABASE_URL="your_postgresql_connection_string"
```

### **2. Environment Variables**
Create a `.env.local` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/torc_db"
```

### **3. Running the Application**
```bash
npm run dev
```

## 📊 **Form Fields Mapping**

The custom form includes all fields from the original Google Form:

### **Basic Information**
- Agent Name
- Relation (Myself/Loved one)
- Minor status
- Personal details (name, DOB, gender, etc.)

### **Contact Information**
- Email, phone, address
- Emergency contact details

### **Gaming Information**
- Platforms used
- Games played
- Gaming history
- Subscriptions and spending

### **Medical Information**
- Symptoms experienced
- Injuries sustained
- Life effects
- Treatments received

### **Legal Information**
- Attorney involvement
- Legal history
- Benefits status

## 🔄 **Conditional Logic**

The form adapts based on user selections:

1. **Relation Selection** → Changes labels and context
2. **Minor Status** → Shows/hides personal information section
3. **Attorney Involvement** → Shows/hides legal name field
4. **Education Status** → Adapts questions based on school attendance

## 📱 **User Experience**

### **Progressive Disclosure**
- Users see only relevant fields
- Form sections appear as needed
- Clear visual organization with color coding

### **Validation**
- Real-time validation
- Clear error messages
- Required field indicators

### **Success Flow**
- Form validation
- Database storage
- Google Form redirect
- Success confirmation

## 🎯 **Benefits**

1. **Better UX**: Custom form provides superior experience
2. **Data Backup**: All submissions stored in database
3. **Admin Access**: View and manage leads
4. **Compliance**: Still uses official Google Form for final submission
5. **Analytics**: Track form completion rates and user behavior

## 🔧 **Customization**

### **Adding New Fields**
1. Update `FormData` interface in `OptInForm.tsx`
2. Add field to form JSX
3. Update validation logic
4. Update database schema
5. Update API routes

### **Modifying Conditional Logic**
1. Add new conditional helpers
2. Update JSX with new conditions
3. Test different user flows

### **Styling Changes**
- All styling uses Tailwind CSS
- Color-coded sections for easy identification
- Responsive design for mobile/desktop

## 🚀 **Deployment**

### **Vercel Deployment**
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### **Database Migration**
```bash
npx prisma migrate deploy
```

## 📞 **Support**

For technical issues or questions about the form integration, refer to:
- Prisma documentation
- Next.js API routes
- Google Forms API (if needed for advanced integration) 