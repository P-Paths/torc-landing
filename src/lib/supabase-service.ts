import { supabase, createServerSupabaseClient } from './supabase';

// Types for our database
export interface Agent {
  id: string;
  agent_id: string;
  name: string;
  email: string;
  phone?: string;
  commission_rate: number;
  bonus_rate: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  agent_id: string;
  source: string;
  gamer_first_name?: string;
  gamer_last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  best_time_to_call?: string;
  platforms?: string[];
  gamertags?: Record<string, string>;
  daily_hours?: string;
  schedule?: string[];
  primary_games?: string[];
  duration_of_concern?: string;
  affected_areas?: string[];
  symptoms?: string[];
  emergency_indicators?: string[];
  help_type?: string;
  previous_attempts?: string[];
  zoom_link?: string;
  status: string;
  assessment_score?: number;
  processed_at?: string;
  assigned_to?: string;
  notes?: string[];
  is_bonus_eligible: boolean;
  bonus_verified_at?: string;
  form_version?: string;
  submission_source?: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface BonusFlag {
  id: string;
  lead_id: string;
  agent_id: string;
  platform: string;
  gamertag: string;
  verified_at: string;
  age?: number;
  total_hours?: number;
  games_played?: string[];
  bonus_amount: number;
  bonus_reason?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Supabase Data Service
export class SupabaseService {
  
  // AGENTS
  static async createAgent(agentData: Omit<Agent, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const { data, error } = await supabase
      .from('agents')
      .insert(agentData)
      .select('id')
      .single();
    
    if (error) throw error;
    return data.id;
  }

  static async getAgent(agentId: string): Promise<Agent | null> {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('agent_id', agentId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async getAllAgents(): Promise<Agent[]> {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // LEADS
  static async createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const { data, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select('id')
      .single();
    
    if (error) throw error;
    return data.id;
  }

  static async getLead(leadId: string): Promise<Lead | null> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async getLeadsByAgent(agentId: string): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('agent_id', agentId)
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getAllLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async updateLead(leadId: string, updates: Partial<Lead>): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', leadId);
    
    if (error) throw error;
  }

  // BONUS FLAGS
  static async createBonusFlag(bonusData: Omit<BonusFlag, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const { data, error } = await supabase
      .from('bonus_flags')
      .insert(bonusData)
      .select('id')
      .single();
    
    if (error) throw error;
    return data.id;
  }

  static async getBonusFlagsByAgent(agentId: string): Promise<BonusFlag[]> {
    const { data, error } = await supabase
      .from('bonus_flags')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async updateBonusFlag(bonusId: string, updates: Partial<BonusFlag>): Promise<void> {
    const { error } = await supabase
      .from('bonus_flags')
      .update(updates)
      .eq('id', bonusId);
    
    if (error) throw error;
  }

  // STATISTICS
  static async getAgentStats(agentId: string) {
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('id, status, is_bonus_eligible')
      .eq('agent_id', agentId);
    
    if (leadsError) throw leadsError;

    const { data: bonuses, error: bonusesError } = await supabase
      .from('bonus_flags')
      .select('bonus_amount, status')
      .eq('agent_id', agentId);
    
    if (bonusesError) throw bonusesError;

    const totalLeads = leads?.length || 0;
    const validLeads = leads?.filter(lead => lead.status === 'qualified').length || 0;
    const bonusLeads = bonuses?.filter(bonus => bonus.status === 'approved').length || 0;
    
    const commissionTotal = (validLeads * 40) + (bonusLeads * 10);

    return {
      totalLeads,
      validLeads,
      bonusLeads,
      commissionTotal
    };
  }

  // REAL-TIME SUBSCRIPTIONS
  static subscribeToLeads(callback: (leads: Lead[]) => void) {
    return supabase
      .channel('leads')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'leads' },
        (payload) => {
          // Fetch updated leads and call callback
          this.getAllLeads().then(callback);
        }
      )
      .subscribe();
  }

  static subscribeToAgentLeads(agentId: string, callback: (leads: Lead[]) => void) {
    return supabase
      .channel(`agent-leads-${agentId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'leads', filter: `agent_id=eq.${agentId}` },
        (payload) => {
          // Fetch updated leads for this agent and call callback
          this.getLeadsByAgent(agentId).then(callback);
        }
      )
      .subscribe();
  }
}
