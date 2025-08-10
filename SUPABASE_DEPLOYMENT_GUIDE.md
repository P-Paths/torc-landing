# 🚀 RTS Funnel — Supabase Deployment Guide

## 📋 **Phase 1: Supabase Setup (Go Live Today)**

### **Step 1: Create Supabase Project**

1. **Go to [supabase.com](https://supabase.com)** and sign in
2. **Create New Project**
   - Project name: `rts-funnel`
   - Database password: Generate a strong password
   - Region: `us-east-1` (or closest to your users)
   - Pricing plan: Free tier (upgrade later if needed)

3. **Wait for project to be ready** (usually 2-3 minutes)

### **Step 2: Set Up Database Schema**

1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy and paste** the contents of `supabase-schema.sql`
3. **Run the SQL** to create all tables
4. **Verify tables created**:
   - `agents`
   - `leads` 
   - `bonus_flags`

### **Step 3: Configure Row Level Security (RLS)**

1. **Go to Authentication > Policies**
2. **Enable RLS** on all tables
3. **Create policies**:

#### **Leads Table Policies:**
```sql
-- Allow public inserts (form submissions)
CREATE POLICY "Allow public inserts" ON leads
FOR INSERT WITH CHECK (true);

-- Allow admins to read all leads
CREATE POLICY "Allow admin reads" ON leads
FOR SELECT USING (true);

-- Allow admins to update leads
CREATE POLICY "Allow admin updates" ON leads
FOR UPDATE USING (true);
```

#### **Agents Table Policies:**
```sql
-- Allow public reads (for agent lookups)
CREATE POLICY "Allow public reads" ON agents
FOR SELECT USING (true);

-- Allow admins to manage agents
CREATE POLICY "Allow admin management" ON agents
FOR ALL USING (true);
```

#### **Bonus Flags Table Policies:**
```sql
-- Allow admins to manage bonus flags
CREATE POLICY "Allow admin management" ON bonus_flags
FOR ALL USING (true);
```

### **Step 4: Get API Keys**

1. **Go to Settings > API**
2. **Copy these values**:
   - Project URL: `https://your-project-id.supabase.co`
   - Anon (public) key: `your-anon-key-here`
   - Service role key: `your-service-role-key-here`

### **Step 5: Update Environment Variables**

1. **Copy `env.supabase.template` to `.env.local`**
2. **Fill in your Supabase credentials**:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

3. **Update production environment** (Vercel):
   - Go to Vercel dashboard
   - Project settings > Environment Variables
   - Add the same variables

## 🚀 **Phase 2: Deploy to Production**

### **Step 1: Deploy to Vercel**

1. **Push your code** to GitHub:
   ```bash
   git add .
   git commit -m "Supabase migration complete"
   git push origin main
   ```

2. **Vercel will auto-deploy** (if connected)
3. **Or manually deploy**:
   ```bash
   vercel --prod
   ```

### **Step 2: Test Production Deployment**

1. **Test ATS Opt-in Form**:
   - Go to `/ats-form`
   - Submit test data
   - Verify row appears in Supabase `leads` table

2. **Test RTS VGA Form**:
   - Go to `/rts-test?agent=AHRPE5559`
   - Submit test data
   - Verify row appears with correct `agent_id`

3. **Test Admin Dashboard**:
   - Go to `/admin`
   - Verify leads appear in real-time
   - Check agent management

## 🎯 **Phase 3: Agent Onboarding**

### **Step 1: Test Agent Registration**

1. **Go to `/agent-register`**
2. **Register a test agent**:
   - Name: Test Agent
   - Email: test@example.com
   - Agent ID: TEST123
   - Phone: (555) 123-4567

3. **Verify agent appears** in Supabase `agents` table

### **Step 2: Test Agent Dashboard**

1. **Go to `/agent/TEST123`**
2. **Verify dashboard loads** with agent info
3. **Check stats calculation** (should be 0 initially)

### **Step 3: Test QR Code Tracking**

1. **Submit a lead** via `/rts-test?agent=TEST123`
2. **Verify lead appears** in agent dashboard
3. **Check commission calculation**

## 🔧 **Phase 4: ATS Integration Testing**

### **Step 1: Test Bonus Eligibility**

1. **Submit Xbox gamer lead** with gamertag
2. **Check console logs** for ATS tool calls
3. **Verify bonus flag creation** in Supabase

### **Step 2: Test Fallback Mode**

1. **Disconnect ATS tool** (temporarily)
2. **Submit Xbox gamer lead**
3. **Verify mock data fallback** works

## 📊 **Phase 5: Admin Dashboard Testing**

### **Step 1: Test Real-time Updates**

1. **Open admin dashboard** in one tab
2. **Submit lead** in another tab
3. **Verify lead appears** immediately

### **Step 2: Test Statistics**

1. **Submit multiple test leads**
2. **Check stats update** in real-time
3. **Verify commission calculations**

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **"Missing Supabase environment variables"**
- Check `.env.local` file exists
- Verify variable names match exactly
- Restart development server

#### **"RLS policy violation"**
- Check RLS is enabled on tables
- Verify policies are created correctly
- Check policy syntax in SQL editor

#### **"Connection refused"**
- Verify Supabase project is active
- Check region selection
- Verify API keys are correct

#### **"Table doesn't exist"**
- Run schema SQL again
- Check table names match exactly
- Verify in Supabase dashboard

### **Debug Commands:**

```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Test Supabase connection
curl -X GET "https://your-project-id.supabase.co/rest/v1/leads" \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer your-anon-key"

# Check Vercel deployment
vercel ls
vercel logs
```

## ✅ **Go-Live Checklist**

- [ ] Supabase project created and active
- [ ] Database schema deployed
- [ ] RLS policies configured
- [ ] Environment variables set
- [ ] Code deployed to production
- [ ] ATS form tested and working
- [ ] RTS form tested and working
- [ ] Admin dashboard functional
- [ ] Agent registration working
- [ ] Agent dashboard functional
- [ ] Bonus eligibility checking working
- [ ] Real-time updates working
- [ ] Commission calculations accurate

## 🎉 **Success Indicators**

- **Forms submit successfully** to Supabase
- **Admin dashboard shows real-time data**
- **Agent registration creates new agents**
- **Agent dashboards display correct stats**
- **Bonus eligibility checking works**
- **No Firebase errors in console**
- **All API routes return 200 status**

## 🔄 **Next Steps After Go-Live**

1. **Monitor performance** and error rates
2. **Set up alerts** for database issues
3. **Implement real ATS tool integration**
4. **Add CRM sync** (HubSpot)
5. **Set up Formstack automation**
6. **Add advanced analytics** and reporting

---

**🎯 Goal: Get RTS funnel live in production today with Supabase handling all lead storage, agent tracking, and dashboard data.**

**📞 Need Help?** Check the troubleshooting section or review the Supabase documentation.
