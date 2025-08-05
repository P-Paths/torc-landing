import { chromium, Browser, Page } from 'playwright';

export interface VGAFormData {
  // Agent Information
  agentId: string;
  
  // Relationship & Minor Status
  relationshipWithIndividual: string;
  isPersonMinor: string;
  
  // Injured Party Information (when "myself" is selected)
  injuredPartyName: string;
  injuredPartyGender: string;
  injuredPartyAddress: string;
  injuredPartyPhone: string;
  injuredPartySecondaryPhone: string;
  callerPhone: string;
  injuredPartyDateOfBirth: string;
  injuredPartySSN: string;
  ssnLastFour: string;
  
  // Legal Information
  previouslySignedDocuments: string;
  fullNameSigning: string;
  isCurrentlyInSchool: string;
  
  // School Information (conditional)
  schoolName: string;
  schoolAddress: string;
  
  // Education
  highestEducationLevel: string;
  
  // Gaming History
  firstStartedPlayingDate: string;
  averageGamesPerDay: string;
  
  // Gaming Platforms & Games
  gamingPlatforms: string[];
  videoGames: string[];
  
  // Gaming Details
  firstVideoGame: string;
  gameDetails: string;
}

export class FormstackAutomation {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async initialize() {
    this.browser = await chromium.launch({
      headless: false, // Set to true in production
      slowMo: 100 // Slow down actions to mimic human behavior
    });
    this.page = await this.browser.newPage();
  }

  async fillFormstackForm(formData: VGAFormData) {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    try {
      await this.page.goto('https://intakes.formstack.com/forms/vga_agents_spbmcc');
      await this.page.waitForSelector('form', { timeout: 10000 });

      await this.fillAgentInformation(formData);
      await this.fillRelationshipAndStatus(formData);
      
      if (formData.relationshipWithIndividual === 'myself') {
        await this.fillInjuredPartyInformation(formData);
      }
      
      await this.fillLegalInformation(formData);
      await this.fillGamingHistory(formData);
      await this.fillGamingPlatforms(formData);
      await this.fillGamingDetails(formData);

      await this.submitForm();
      return { success: true, message: 'Form submitted successfully' };
    } catch (error) {
      console.error('Error filling Formstack form:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private async fillAgentInformation(formData: VGAFormData) {
    if (!this.page) return;
    
    // Fill Agent ID
    await this.page.fill('#field184472350', formData.agentId);
  }

  private async fillRelationshipAndStatus(formData: VGAFormData) {
    if (!this.page) return;

    // Fill relationship with individual
    if (formData.relationshipWithIndividual === 'myself') {
      await this.page.click('#field184472351_1'); // Myself
    } else if (formData.relationshipWithIndividual === 'loved_one') {
      await this.page.click('#field184472351_2'); // A Loved One
    }

    // Fill minor status (only if "myself" is selected)
    if (formData.relationshipWithIndividual === 'myself' && formData.isPersonMinor) {
      if (formData.isPersonMinor === 'Yes') {
        await this.page.click('#field184472352_1');
      } else if (formData.isPersonMinor === 'No') {
        await this.page.click('#field184472352_2');
      }
    }
  }

  private async fillInjuredPartyInformation(formData: VGAFormData) {
    if (!this.page) return;

    // Fill injured party name
    await this.page.fill('#field184472353', formData.injuredPartyName);
    
    // Fill gender
    if (formData.injuredPartyGender) {
      const genderMapping = {
        'Male': '#field184472354_1',
        'Female': '#field184472354_2',
        'Other': '#field184472354_3'
      };
      const selector = genderMapping[formData.injuredPartyGender as keyof typeof genderMapping];
      if (selector) {
        await this.page.click(selector);
      }
    }

    // Fill address
    await this.page.fill('#field184472355', formData.injuredPartyAddress);
    
    // Fill phone numbers
    await this.page.fill('#field184472356', formData.injuredPartyPhone);
    if (formData.injuredPartySecondaryPhone) {
      await this.page.fill('#field184472357', formData.injuredPartySecondaryPhone);
    }
    await this.page.fill('#field184472358', formData.callerPhone);
    
    // Fill date of birth
    await this.page.fill('#field184472359', formData.injuredPartyDateOfBirth);
    
    // Fill SSN
    await this.page.fill('#field184472360', formData.injuredPartySSN);
    if (formData.ssnLastFour) {
      await this.page.fill('#field184472361', formData.ssnLastFour);
    }
  }

  private async fillLegalInformation(formData: VGAFormData) {
    if (!this.page) return;

    // Fill previously signed documents
    if (formData.previouslySignedDocuments === 'Yes') {
      await this.page.click('#field184472362_1');
    } else if (formData.previouslySignedDocuments === 'No') {
      await this.page.click('#field184472362_2');
    }

    // Fill full name signing
    await this.page.fill('#field184472363', formData.fullNameSigning);

    // Fill currently in school
    if (formData.isCurrentlyInSchool === 'Yes') {
      await this.page.click('#field184472364_1');
      
      // Fill school information if "Yes"
      if (formData.schoolName) {
        await this.page.fill('#field184472365', formData.schoolName);
      }
      if (formData.schoolAddress) {
        await this.page.fill('#field184472366', formData.schoolAddress);
      }
    } else if (formData.isCurrentlyInSchool === 'No') {
      await this.page.click('#field184472364_2');
    }

    // Fill highest education level
    if (formData.highestEducationLevel) {
      const educationMapping = {
        'Elementary School': '#field184472367_1',
        'High School': '#field184472367_2',
        'Vocational School': '#field184472367_3',
        'College': '#field184472367_4',
        'University': '#field184472367_5',
        'Graduate School': '#field184472367_6'
      };
      const selector = educationMapping[formData.highestEducationLevel as keyof typeof educationMapping];
      if (selector) {
        await this.page.click(selector);
      }
    }
  }

  private async fillGamingHistory(formData: VGAFormData) {
    if (!this.page) return;

    // Fill first started playing date
    await this.page.fill('#field184472368', formData.firstStartedPlayingDate);
    
    // Fill average games per day
    await this.page.fill('#field184472369', formData.averageGamesPerDay);
  }

  private async fillGamingPlatforms(formData: VGAFormData) {
    if (!this.page) return;

    const platformMapping = {
      'Playstation': '#field184472370_1',
      'Xbox': '#field184472370_2',
      'Nintendo Switch': '#field184472370_3',
      'Gaming Computer or Laptop': '#field184472370_4',
      'Steam': '#field184472370_5',
      'Apple iPhone': '#field184472370_6',
      'Android Phone': '#field184472370_7',
      'Oculus VR': '#field184472370_8',
      'Meta Quest': '#field184472370_9',
      'Other Gaming Device': '#field184472370_10'
    };

    for (const platform of formData.gamingPlatforms) {
      const selector = platformMapping[platform as keyof typeof platformMapping];
      if (selector) {
        await this.page.click(selector);
      }
    }

    // Fill video games
    const gameMapping = {
      'Apex Legends': '#field184472371_1',
      'Call of Duty': '#field184472371_2',
      'Counter-Strike': '#field184472371_3',
      'Fortnite': '#field184472371_4',
      'GTA 5': '#field184472371_5',
      'League of Legends': '#field184472371_6',
      'Minecraft': '#field184472371_7',
      'Overwatch': '#field184472371_8',
      'Rainbow Six: Siege': '#field184472371_9',
      'Roblox': '#field184472371_10',
      'Rocket League': '#field184472371_11',
      'Teamfight Tactics': '#field184472371_12',
      'Valorant': '#field184472371_13',
      'World of Warcraft': '#field184472371_14',
      'Other Game': '#field184472371_15'
    };

    for (const game of formData.videoGames) {
      const selector = gameMapping[game as keyof typeof gameMapping];
      if (selector) {
        await this.page.click(selector);
      }
    }
  }

  private async fillGamingDetails(formData: VGAFormData) {
    if (!this.page) return;

    // Fill first video game
    await this.page.fill('#field184472372', formData.firstVideoGame);
    
    // Fill game details
    await this.page.fill('#field184472373', formData.gameDetails);
  }

  private async submitForm() {
    if (!this.page) return;
    await this.page.click('input[type="submit"]');
    await this.page.waitForTimeout(3000);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

export const formstackAutomation = new FormstackAutomation(); 