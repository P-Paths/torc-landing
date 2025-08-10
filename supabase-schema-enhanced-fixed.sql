-- RTS Funnel Enhanced Supabase Database Schema (FIXED)
-- Run this in your Supabase SQL Editor to support the enhanced commission system

-- Create agents table (enhanced for commission tracking)
CREATE TABLE IF NOT EXISTS agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL, -- e.g., AHRPE5559
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  commission_base_cents INTEGER DEFAULT 4000, -- $40.00 in cents
  commission_bonus_qualified_cents INTEGER DEFAULT 1000, -- $10.00 bonus in cents
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table (enhanced with attribution and commission fields)
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES agents(id), -- FK to agents.id
  agent_code_supplied TEXT, -- Raw query param from URL
  
  -- Attribution and Commission Fields
  attribution_method TEXT CHECK (attribution_method IN ('organic', 'qrl', 'link', 'fallback')) DEFAULT 'organic',
  commission_model TEXT CHECK (commission_model IN ('default_full', 'agent_split')) DEFAULT 'default_full',
  commission_total_cents INTEGER DEFAULT 4000, -- Total commission in cents
  commission_breakdown JSONB DEFAULT '{}'::jsonb, -- Detailed breakdown
  
  -- Contact Information
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  best_time_to_call VARCHAR(100),
  
  -- Gaming Profile
  platforms TEXT[], -- ['Xbox', 'PlayStation', 'Steam']
  gamertags JSONB, -- {"xbox": "gamertag", "playstation": "psn", "steam": "steamid"}
  daily_hours VARCHAR(50),
  schedule TEXT[],
  primary_games TEXT[],
  
  -- Assessment
  duration_of_concern VARCHAR(100),
  affected_areas TEXT[],
  symptoms TEXT[],
  emergency_indicators TEXT[],
  
  -- Treatment
  help_type VARCHAR(100),
  previous_attempts TEXT[],
  zoom_link TEXT,
  
  -- Status and Processing
  status VARCHAR(50) DEFAULT 'new',
  source VARCHAR(50) DEFAULT 'website', -- 'website', 'qr', 'tiktok', etc.
  assessment_score INTEGER,
  processed_at TIMESTAMP WITH TIME ZONE,
  assigned_to VARCHAR(100),
  notes TEXT[],
  
  -- Bonus Eligibility
  is_bonus_eligible BOOLEAN DEFAULT FALSE,
  bonus_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  form_version VARCHAR(50),
  submission_source VARCHAR(100),
  meta JSONB DEFAULT '{}'::jsonb, -- Additional metadata for AI training
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create qr_codes table for agent QR management
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  code TEXT NOT NULL, -- The agent code (e.g., AHRPE5559)
  destination TEXT NOT NULL, -- Canonical route e.g., /apply?agent=AHRPE5559
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bonus_flags table (enhanced)
CREATE TABLE IF NOT EXISTS bonus_flags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id),
  
  -- Gaming Data Verification
  platform VARCHAR(50) NOT NULL, -- 'Xbox', 'Steam', 'PlayStation'
  gamertag VARCHAR(255) NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Eligibility Criteria
  age INTEGER,
  total_hours INTEGER,
  games_played TEXT[],
  
  -- Bonus Details
  bonus_amount_cents INTEGER DEFAULT 1000, -- $10.00 in cents
  bonus_reason TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_agent_id ON leads(agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_agent_code_supplied ON leads(agent_code_supplied);
CREATE INDEX IF NOT EXISTS idx_leads_attribution_method ON leads(attribution_method);
CREATE INDEX IF NOT EXISTS idx_leads_commission_model ON leads(commission_model);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_submitted_at ON leads(submitted_at);
CREATE INDEX IF NOT EXISTS idx_qr_codes_agent_id ON qr_codes(agent_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_code ON qr_codes(code);
CREATE INDEX IF NOT EXISTS idx_bonus_flags_lead_id ON bonus_flags(lead_id);
CREATE INDEX IF NOT EXISTS idx_bonus_flags_agent_id ON bonus_flags(agent_id);

-- Insert default agent (AHRPE5559)
INSERT INTO agents (code, name, email, commission_base_cents, commission_bonus_qualified_cents)
VALUES ('AHRPE5559', 'Preston Eaton', 'preston@rtsfunnel.com', 4000, 1000)
ON CONFLICT (code) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qr_codes_updated_at BEFORE UPDATE ON qr_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bonus_flags_updated_at BEFORE UPDATE ON bonus_flags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate commission breakdown
CREATE OR REPLACE FUNCTION calculate_commission_breakdown(
  p_agent_code TEXT,
  p_is_default_agent BOOLEAN DEFAULT FALSE
)
RETURNS JSONB AS $$
DECLARE
  v_breakdown JSONB;
BEGIN
  IF p_is_default_agent OR p_agent_code = 'AHRPE5559' THEN
    -- Default agent gets full commission
    v_breakdown := jsonb_build_object(
      'admin_cents', 4000,
      'agent_cents', 0,
      'agent_code', 'AHRPE5559'
    );
  ELSE
    -- Agent gets split commission
    v_breakdown := jsonb_build_object(
      'admin_cents', 2000,
      'agent_cents', 2000,
      'agent_code', p_agent_code
    );
  END IF;
  
  RETURN v_breakdown;
END;
$$ LANGUAGE plpgsql;
