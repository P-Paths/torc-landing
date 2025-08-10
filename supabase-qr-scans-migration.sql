-- Create qr_scans table for tracking QR code scans
CREATE TABLE IF NOT EXISTS qr_scans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id TEXT NOT NULL,
    user_agent TEXT,
    ip_address TEXT,
    referrer TEXT,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_qr_scans_agent_id ON qr_scans(agent_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_scanned_at ON qr_scans(scanned_at);

-- Add RLS policies
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all scans
CREATE POLICY "Allow authenticated users to read qr_scans" ON qr_scans
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert scans
CREATE POLICY "Allow authenticated users to insert qr_scans" ON qr_scans
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON qr_scans TO authenticated;
GRANT ALL ON qr_scans TO service_role;
