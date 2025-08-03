// Firestore Data Service
import { adminDb } from './firebase-admin';
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  Timestamp 
} from 'firebase/firestore';

// Enhanced Lead Interface (matches your enhanced intake form structure)
export interface EnhancedLead {
  id?: string;
  timestamp: Date;
  contactInfo: {
    agentName: string;
    relationship: string;
    gamerFirstName: string;
    gamerLastName: string;
    email: string;
    phone: string;
    bestTimeToCall?: string;
  };
  gamingProfile?: {
    platforms: string[];
    gamertags: {
      xbox?: string;
      playstation?: string;
      steam?: string;
    };
    dailyHours?: string;
    schedule?: string[];
    primaryGames?: string;
    profileAnalysis?: {
      totalHours: number;
      topGames: any[];
      lastActive?: Date;
    };
  };
  severityAssessment?: {
    durationOfConcern?: string;
    affectedAreas?: string[];
    symptoms?: string[];
    emergencyIndicators?: string[];
  };
  treatmentPreferences?: {
    helpType?: string;
    previousAttempts?: string[];
    insurance?: string;
  };
  aiAssessment?: {
    riskLevel?: number; // 1-10
    severityCategory?: 'Mild' | 'Moderate' | 'High' | 'Crisis';
    primaryConcerns?: string[];
    recommendedTreatment?: string;
    urgencyLevel?: '24_hours' | '1_week' | '1_month';
    confidence?: number;
  };
  status: 'new' | 'contacted' | 'qualified' | 'enrolled' | 'declined';
  assignedTo?: string;
  notes?: string[];
}

// Zoom Signup Interface
export interface ZoomSignup {
  id?: string;
  name: string;
  phone: string;
  email: string;
  day: string;
  attended: boolean;
  timestamp: string;
}

// LEADS OPERATIONS
export class LeadsService {
  
  // Create new lead
  static async createLead(leadData: Omit<EnhancedLead, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'leads'), {
        ...leadData,
        timestamp: Timestamp.fromDate(leadData.timestamp)
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  }

  // Get all leads
  static async getAllLeads(): Promise<EnhancedLead[]> {
    try {
      const q = query(collection(db, 'leads'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as EnhancedLead[];
    } catch (error) {
      console.error('Error getting leads:', error);
      throw error;
    }
  }

  // Real-time leads listener
  static subscribeToLeads(callback: (leads: EnhancedLead[]) => void) {
    const q = query(collection(db, 'leads'), orderBy('timestamp', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const leads = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as EnhancedLead[];
      
      callback(leads);
    });
  }

  // Update lead status
  static async updateLeadStatus(leadId: string, status: EnhancedLead['status']): Promise<void> {
    try {
      const leadRef = doc(db, 'leads', leadId);
      await updateDoc(leadRef, { status });
    } catch (error) {
      console.error('Error updating lead status:', error);
      throw error;
    }
  }

  // Add note to lead
  static async addNoteToLead(leadId: string, note: string): Promise<void> {
    try {
      const leadRef = doc(db, 'leads', leadId);
      const leadDoc = await getDoc(leadRef);
      const currentNotes = leadDoc.data()?.notes || [];
      
      await updateDoc(leadRef, {
        notes: [...currentNotes, `${new Date().toISOString()}: ${note}`]
      });
    } catch (error) {
      console.error('Error adding note to lead:', error);
      throw error;
    }
  }
}

// ZOOM SIGNUPS OPERATIONS
export class ZoomService {
  
  // Create zoom signup
  static async createZoomSignup(signupData: Omit<ZoomSignup, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'zoom_signups'), signupData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating zoom signup:', error);
      throw error;
    }
  }

  // Get all zoom signups
  static async getAllZoomSignups(): Promise<ZoomSignup[]> {
    try {
      const q = query(collection(db, 'zoom_signups'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ZoomSignup[];
    } catch (error) {
      console.error('Error getting zoom signups:', error);
      throw error;
    }
  }

  // Real-time zoom signups listener
  static subscribeToZoomSignups(callback: (signups: ZoomSignup[]) => void) {
    const q = query(collection(db, 'zoom_signups'), orderBy('timestamp', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const signups = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ZoomSignup[];
      
      callback(signups);
    });
  }

  // Toggle attendance
  static async toggleAttendance(signupId: string, attended: boolean): Promise<void> {
    try {
      const signupRef = doc(db, 'zoom_signups', signupId);
      await updateDoc(signupRef, { attended });
    } catch (error) {
      console.error('Error toggling attendance:', error);
      throw error;
    }
  }
}

// MIGRATION UTILITIES
export class MigrationService {
  
  // Migrate localStorage leads to Firestore
  static async migrateLeadsFromLocalStorage(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      const localLeads = localStorage.getItem('torcDemoLeads');
      if (!localLeads) return;
      
      const leads = JSON.parse(localLeads);
      
      for (const lead of leads) {
        // Convert old lead format to new enhanced format
        const enhancedLead: Omit<EnhancedLead, 'id'> = {
          timestamp: new Date(lead.createdAt || Date.now()),
          contactInfo: {
            agentName: lead.agentName || '',
            relationship: lead.relation || '',
            gamerFirstName: lead.firstName || '',
            gamerLastName: lead.lastName || '',
            email: lead.email || '',
            phone: lead.phone || ''
          },
          status: lead.status?.toLowerCase() || 'new',
          notes: []
        };
        
        await LeadsService.createLead(enhancedLead);
      }
      
      console.log('Successfully migrated leads from localStorage to Firestore');
    } catch (error) {
      console.error('Error migrating leads:', error);
    }
  }

  // Migrate localStorage zoom signups to Firestore
  static async migrateZoomSignupsFromLocalStorage(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      const localSignups = localStorage.getItem('torcZoomSignups');
      if (!localSignups) return;
      
      const signups = JSON.parse(localSignups);
      
      for (const signup of signups) {
        await ZoomService.createZoomSignup(signup);
      }
      
      console.log('Successfully migrated zoom signups from localStorage to Firestore');
    } catch (error) {
      console.error('Error migrating zoom signups:', error);
    }
  }
} 