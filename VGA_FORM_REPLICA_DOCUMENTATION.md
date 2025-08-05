# VGA Form Replica - Complete Documentation

## Overview
This document details the complete Real-Time Solutions (RTS) intake form that serves as an exact replica of the VGA form for lead qualification. The form is designed to be scraped by Playwright/Puppeteer and auto-populate the actual VGA form for law firm submission.

## Form Structure

### Page Layout
- **Background**: White (`bg-white`)
- **Header**: Blue background (`bg-blue-600`) with "Real-Time Solutions" title
- **Container**: White background with shadow (`bg-white p-8 rounded-lg shadow-2xl border border-gray-200`)
- **Test Mode Banner**: Yellow banner indicating test mode

### Progress Bar
- **Steps**: Basic Info, Gaming Profile, Assessment, Review
- **Active Step**: Blue text (`text-blue-600`)
- **Inactive Step**: Gray text (`text-gray-400`)
- **Progress Bar**: Gray track (`bg-gray-200`) with blue fill (`bg-blue-600`)

## Step 1: Basic Information

### Date/Time Information Section
**Background**: Gray (`bg-gray-50 p-4 rounded-lg`)

#### Date Field
- **Label**: "Date *" (required)
- **Type**: Text input
- **Behavior**: Auto-populates with current date when clicked
- **Format**: MM/DD/YYYY
- **Classes**: `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white`

#### Time Field
- **Label**: "Time *" (required)
- **Type**: Text input
- **Behavior**: Auto-populates with current time when clicked
- **Format**: HH:MM:SS (24-hour)
- **Classes**: Same as Date field

### Agent Information Section
**Background**: Blue (`bg-blue-50 p-4 rounded-lg`)

#### Agent ID Field
- **Label**: "Agent ID *" (required)
- **Type**: Text input
- **Behavior**: Auto-populated from URL parameter `?agent=`
- **Classes**: `w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-blue-400 bg-white`

#### Agent Name Field
- **Label**: "Agent Name *" (required)
- **Type**: Text input
- **Classes**: Same as Agent ID field

### Relationship & Status Section
**Background**: Gray (`bg-gray-50 p-4 rounded-lg`)

#### Relationship Field
- **Label**: "What is your relation to the individual that played the video games? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Myself" (value: "myself")
  - "Loved one" (value: "loved_one")
- **Classes**: `text-blue-600 focus:ring-blue-500`

#### Minor Status Field
- **Label**: "Is the person who played video games a minor (under age of 18)? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Yes" (value: "yes")
  - "No" (value: "no")
- **Classes**: Same as Relationship field

### Caller Information Section (Conditional)
**Condition**: Only shows when `relationship === 'loved_one'`
**Background**: Gray (`bg-gray-50 p-4 rounded-lg`)

#### Caller Name Field
- **Label**: "Caller Name"
- **Type**: Text input
- **Required**: No
- **Placeholder**: "Enter caller name"
- **Classes**: Standard input classes

#### Caller Email Field
- **Label**: "Caller Email Address"
- **Type**: Email input
- **Required**: No
- **Placeholder**: "Enter caller email"
- **Classes**: Standard input classes

#### Caller Address Fields
- **Label**: "Caller Address"
- **Fields**:
  - Address Line 1 (placeholder: "Address Line 1")
  - Address Line 2 (placeholder: "Address Line 2")
  - City (placeholder: "City")
  - State (placeholder: "State")
  - ZIP Code (placeholder: "ZIP Code")
- **Layout**: 2-column grid
- **Classes**: Standard input classes

#### Legal Authorization Field
- **Label**: "Do you have legal authorization to pursue claims on behalf of the individual that played the video games? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Yes" (value: "yes")
  - "No" (value: "no")
  - "No but I would be willing to gain legal authorization" (value: "willing")
- **Classes**: Standard radio classes

#### Claimant Deceased Field
- **Label**: "Is the claimant Deceased? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Yes" (value: "yes")
  - "No" (value: "no")
- **Classes**: Standard radio classes

### Injured Party Information Section
**Background**: Gray (`bg-gray-50 p-4 rounded-lg`)

#### Injured Party Name Fields
- **Label**: "Injured Party Name *" (required)
- **Fields**:
  - First Name * (required)
  - Middle Name (optional)
  - Last Name * (required)
  - Suffix (optional, placeholder: "Jr., Sr., III, etc.")
- **Layout**: 4-column grid
- **Classes**: Standard input classes

#### Gender Field
- **Label**: "Gender *" (required)
- **Type**: Dropdown select
- **Options**:
  - "Select gender" (empty value)
  - "Male" (value: "male")
  - "Female" (value: "female")
  - "Other" (value: "other")
  - "Prefer not to say" (value: "prefer_not_to_say")
- **Classes**: Standard select classes

#### Injured Party Email Field
- **Label**: "Injured Party Email Address *" (required)
- **Type**: Email input
- **Classes**: Standard input classes

#### Injured Party DOB Field
- **Label**: "Injured Party DOB *" (required)
- **Type**: Date input
- **Format**: MM/DD/YYYY
- **Classes**: Standard input classes

#### Injured Party SSN Field
- **Label**: "Injured Party SSN *" (required)
- **Type**: Text input
- **Placeholder**: "XXX-XX-XXXX"
- **Classes**: Standard input classes

### Injured Party Address Section
**Background**: Gray (`bg-gray-50 p-4 rounded-lg`)

#### Address Fields
- **Label**: "Injured Party Address *" (required)
- **Fields**:
  - Address Line 1 * (required)
  - Address Line 2 (optional, placeholder: "Apartment, suite, unit, etc.")
  - City * (required)
  - State * (required, dropdown with all US states)
  - ZIP Code * (required)
- **Layout**: 2-column grid for city/state/zip
- **Classes**: Standard input classes

### Contact Information Section
**Background**: Gray (`bg-gray-50 p-4 rounded-lg`)

#### Phone Number Fields
- **Primary Phone**: "Phone Number *" (required)
- **Secondary Phone**: "Secondary Phone Number" (optional)
- **Type**: Tel inputs
- **Classes**: Standard input classes

#### Caller Number Type Field
- **Label**: "Caller Number Provided" (required)
- **Type**: Radio buttons
- **Options**:
  - "Home" (value: "home")
  - "Cell Phone" (value: "cell")
- **Classes**: Standard radio classes

### Legal Information Section
**Background**: Gray (`bg-gray-50 p-4 rounded-lg`)

#### Previous Attorney Documents Field
- **Label**: "Have you previously signed documents with an attorney for this claim? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Yes" (value: "yes")
  - "No" (value: "no")
  - "DQ-If yes" (value: "dq_if_yes")
- **Classes**: Standard radio classes

#### Legal Full Name Field
- **Label**: "Legal Full Name of person signing" (required)
- **Type**: Text input
- **Classes**: Standard input classes

#### Currently In School Field
- **Label**: "Is Injured Party currently going to school? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Yes" (value: "yes")
  - "No" (value: "no")
- **Classes**: Standard radio classes

#### Highest Education Level Field
- **Label**: "Highest Level of Education for Gamer? *" (required)
- **Type**: Dropdown select
- **Options**:
  - "Select education level" (empty value)
  - "Elementary School" (value: "elementary")
  - "Middle School" (value: "middle")
  - "High School" (value: "high_school")
  - "Some College" (value: "some_college")
  - "Associate's Degree" (value: "associates")
  - "Bachelor's Degree" (value: "bachelors")
  - "Master's Degree" (value: "masters")
  - "Doctorate" (value: "doctorate")
  - "Other" (value: "other")
- **Classes**: Standard select classes

### Gaming History Section
**Background**: Gray (`bg-gray-50 p-4 rounded-lg`)

#### Gaming Start Date Field
- **Label**: "Estimate the date that injured party first started playing video games? *" (required)
- **Type**: Date input
- **Format**: MM/DD/YYYY
- **Classes**: Standard input classes

#### Hours Per Day Field
- **Label**: "On average how many hours a day do you play video games? *" (required)
- **Type**: Number input
- **Attributes**: `min="0" max="24" step="0.5"`
- **Classes**: Standard input classes

#### Gaming Platforms Field
- **Label**: "Select gaming platforms that have been used. *" (required)
- **Type**: Checkboxes
- **Options**:
  - "Playstation"
  - "Xbox"
  - "Nintendo Switch"
- **Classes**: `rounded border-gray-300 text-blue-600 focus:ring-blue-500`

### Enhanced Gaming Platforms Section
**Background**: Gray (`bg-gray-50 p-4 rounded-lg`)

#### Gaming Platforms Field
- **Label**: "Select gaming platforms that have been used. *" (required)
- **Type**: Checkboxes
- **Options**:
  - "Playstation"
  - "Xbox"
  - "Nintendo Switch"
  - "Gaming Computer or Laptop"
  - "Steam"
  - "Apple iPhone"
  - "Android Phone"
  - "Oculus VR"
  - "Meta Quest"
  - "Other Gaming Device"
- **Classes**: Standard checkbox classes

#### Conditional Gamer Tag Fields
**Behavior**: When a platform is selected, corresponding gamer tag field appears

##### PlayStation Gamer Tag
- **Condition**: `gamingPlatforms.includes('playstation')`
- **Label**: "Playstation Gamer Tag"
- **Type**: Text input
- **Placeholder**: "Enter Playstation Gamer Tag"
- **Classes**: Standard input classes

##### Xbox Gamer Tag
- **Condition**: `gamingPlatforms.includes('xbox')`
- **Label**: "Xbox Gamer Tag"
- **Type**: Text input
- **Placeholder**: "Enter Xbox Gamer Tag"
- **Classes**: Standard input classes

##### Nintendo Switch Gamer Tag
- **Condition**: `gamingPlatforms.includes('nintendoSwitch')`
- **Label**: "Nintendo Switch Gamer Tag"
- **Type**: Text input
- **Placeholder**: "Enter Nintendo Switch Gamer Tag"
- **Classes**: Standard input classes

##### Gaming Computer/Laptop Fields
- **Condition**: `gamingPlatforms.includes('gamingComputer')`
- **Fields**:
  - **Laptop/Desktop Name**: Text input with placeholder "Enter laptop/desktop name"
  - **Laptop Brands**: Checkboxes for "Dell", "Lenova", "HP", "Mac", "iPad"
- **Classes**: Standard input/checkbox classes

##### Steam Gamer Tag
- **Condition**: `gamingPlatforms.includes('steam')`
- **Label**: "Steam Gamer Tag"
- **Type**: Text input
- **Placeholder**: "Enter Steam Gamer Tag"
- **Classes**: Standard input classes

##### Apple iPhone Gamer Tag
- **Condition**: `gamingPlatforms.includes('appleIphone')`
- **Label**: "Apple iPhone Gamer Tag"
- **Type**: Text input
- **Placeholder**: "Enter Apple iPhone Gamer Tag"
- **Classes**: Standard input classes

##### Android Phone Gamer Tag
- **Condition**: `gamingPlatforms.includes('androidPhone')`
- **Label**: "Android Phone Gamer Tag"
- **Type**: Text input
- **Placeholder**: "Enter Android Phone Gamer Tag"
- **Classes**: Standard input classes

##### Oculus VR Gamer Tag
- **Condition**: `gamingPlatforms.includes('oculusVr')`
- **Label**: "Oculus VR Gamer Tag"
- **Type**: Text input
- **Placeholder**: "Enter Oculus VR Gamer Tag"
- **Classes**: Standard input classes

##### Meta Quest Gamer Tag
- **Condition**: `gamingPlatforms.includes('metaQuest')`
- **Label**: "Meta Quest Gamer Tag"
- **Type**: Text input
- **Placeholder**: "Enter Meta Quest Gamer Tag"
- **Classes**: Standard input classes

##### Other Gaming Device Gamer Tag
- **Condition**: `gamingPlatforms.includes('otherGamingDevice')`
- **Label**: "Other Gaming Device Gamer Tag"
- **Type**: Text input
- **Placeholder**: "Enter Other Gaming Device Gamer Tag"
- **Classes**: Standard input classes

### Video Games Played Section
**Background**: Gray (`bg-gray-50 p-4 rounded-lg`)

#### Video Games Field
- **Label**: "Select all video games that have been played. *" (required)
- **Type**: Checkboxes
- **Options**:
  - "Apex Legends"
  - "Call of Duty"
  - "Fortnite"
  - "Minecraft"
  - "Roblox"
  - "League of Legends"
  - "Valorant"
  - "Overwatch"
  - "World of Warcraft"
  - "GTA V"
  - "Red Dead Redemption"
  - "FIFA"
  - "Madden NFL"
  - "NBA 2K"
  - "Rocket League"
  - "Among Us"
  - "Fall Guys"
  - "PUBG"
  - "CS:GO"
  - "Dota 2"
  - "Hearthstone"
  - "Pokemon GO"
  - "Clash of Clans"
  - "Clash Royale"
  - "Candy Crush"
  - "Mobile Legends"
  - "Free Fire"
  - "PUBG Mobile"
  - "Other Game"
- **Classes**: Standard checkbox classes

### First Game Played Section
**Background**: Gray (`bg-gray-50 p-4 rounded-lg`)

#### First Game Field
- **Label**: "What video game that was played first? *" (required)
- **Type**: Text input
- **Placeholder**: "Enter the first video game played"
- **Classes**: Standard input classes

### Detailed Gaming History Section
**Background**: Gray (`bg-gray-50 p-4 rounded-lg`)

#### Detailed History Field
- **Label**: "Please list the game names including the version, dates, and estimated hours spent playing each of the above game. *" (required)
- **Type**: Textarea
- **Rows**: 4
- **Placeholder**: "Please provide detailed gaming history..."
- **Classes**: Standard textarea classes with `resize-vertical`

### Gaming Subscriptions & Accessories Section
**Background**: Gray (`bg-gray-50 p-4 rounded-lg`)

#### Monthly Subscriptions Field
- **Label**: "Which monthly subscription(s) did you purchase? *" (required)
- **Type**: Checkboxes
- **Options**:
  - "Game Pass Ultimate"
  - "Game Pass Core"
  - "XBox Live Gold"
  - "Playstation Premium"
  - "Playstation Extra"
  - "Playstation Essential"
  - "EA Play"
  - "EA Play Pro"
  - "Apple Arcade"
  - "Google Play Pass"
  - "Amazon Prime Gaming"
  - "NVIDIA GeForce NOW"
  - "Amazon Luna"
  - "Roblox Premim"
  - "Ubisoft Classics"
  - "Ubisoft Premium"
  - "Fortnite Battlepass"
  - "Fortnite Crew Subscription"
  - "Other Subscription"
  - "No Monthly Subscription"
- **Layout**: Scrollable container with max-height
- **Classes**: Standard checkbox classes

#### Cloud Gaming Subscriptions Field
- **Label**: "Do you subscribe to any cloud/internet gaming subscription(s) (online gaming subscriptions)? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Yes" (value: "yes")
  - "No" (value: "no")
  - "Unsure" (value: "unsure")
- **Classes**: Standard radio classes

#### Virtual Reality Accessories Field
- **Label**: "Do you use virtual reality headsets, gloves, or other video game accessories? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Yes" (value: "yes")
  - "No" (value: "no")
- **Classes**: Standard radio classes

#### Game Purchase Receipts Field
- **Label**: "Do you have receipts for any video games related purchased? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Yes" (value: "yes")
  - "No" (value: "no")
- **Classes**: Standard radio classes

### Gaming Habits & Financial Section
**Background**: Gray (`bg-gray-50 p-4 rounded-lg`)
**Layout**: 2-column grid

#### Left Column

##### Monthly Gaming Spend Field
- **Label**: "On average how much money per month was spent on video gaming? *" (required)
- **Type**: Text input
- **Placeholder**: "Enter amount spent per month"
- **Classes**: Standard input classes

##### Tried to Stop Gaming Field
- **Label**: "Have you tried to stop or give up gaming? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Yes" (value: "yes")
  - "No" (value: "no")
- **Classes**: Standard radio classes

##### Paid for Additional Items Field
- **Label**: "Did you pay for additional items in the video games, such as loot, level up options, rewards, badges, or additional game content? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Yes" (value: "yes")
  - "No" (value: "no")
  - "Unsure" (value: "unsure")
- **Classes**: Standard radio classes

##### Energy Drink Rewards Field
- **Label**: "Did you receive a reward of an energy drink or powder with Battle Pass or other video games? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Yes" (value: "yes")
  - "No" (value: "no")
  - "Do not know" (value: "do_not_know")
- **Classes**: Standard radio classes

#### Right Column

##### Gaming Proof Field
- **Label**: "Do you have photos, witnesses, or any proof that video games were played/used? *" (required)
- **Type**: Checkboxes
- **Options**:
  - "Photos"
  - "Witnesses"
  - "Other Proof"
- **Classes**: Standard checkbox classes

##### Watched Gaming Influencers Field
- **Label**: "Have you ever watched social media gaming influencers on YouTube, TikTok, or any other websites? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Yes" (value: "yes")
  - "No" (value: "no")
- **Classes**: Standard radio classes

##### Sold Video Game Content Field
- **Label**: "Did you sell in video game content or loot (level, persons, badges, etc.) for money? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Yes" (value: "yes")
  - "No" (value: "no")
- **Classes**: Standard radio classes

### Gaming Disorder Symptoms & Injuries Section
**Background**: Gray (`bg-gray-50 p-4 rounded-lg`)

#### Gaming Disorder Symptoms Field
- **Label**: "Select all internet gaming disorder symptoms that the individual has experienced or has been witnessed since playing video games *" (required)
- **Type**: Checkboxes
- **Layout**: 2-column grid
- **Options**:
  - "Poor school or work performance due to playing video games"
  - "Withdrawal symptoms when games are taken away such as Sadness, Anxiety or Restlessness, Gamers Rage"
  - "Loss of interest in sports, hobbies or spending time with family"
  - "Gamer recognizes they have a problem with excessive gaming"
  - "Deceives family about gameplay time or steals money to play games"
  - "Needs to play more hours on video games to the detriment of education or work"
  - "Decline in personal hygiene due to gaming"
  - "Failed attempts to stop playing video games"
  - "Uses video games to relieve negative moods such as guilt or depression"
  - "None of the above"
- **Classes**: Standard checkbox classes with `mt-1` for alignment

#### Gaming Injuries Field
- **Label**: "Have you had any of the following injuries or diagnoses due to video games? *" (required)
- **Type**: Checkboxes
- **Layout**: 2-column grid
- **Options**:
  - "Diagnosed gaming disorder or addiction"
  - "Opposition defiant disorder (ODD)"
  - "Suicide attempt"
  - "Depression"
  - "ADD/ ADHD (Attention deficit hyperactivity disorder)"
  - "Gamer's rage"
  - "Gamer's thumb"
  - "Seizures"
  - "Computer vision syndrome"
  - "Carpal tunnel syndrome"
  - "Orthopedic injury"
  - "Sleep Deprivation Psychosis"
  - "Other injury"
  - "No injury"
- **Classes**: Standard checkbox classes with `mt-1` for alignment

### Life Impact & Medical Treatment Section
**Background**: Gray (`bg-gray-50 p-4 rounded-lg`)

#### Life Impact from Gaming Field
- **Label**: "Have video games affected your life in any of the following ways? *" (required)
- **Type**: Checkboxes
- **Layout**: 2-column grid
- **Options**:
  - "Drop in grades"
  - "Dropout of school"
  - "Hiding or lying about game playing time"
  - "Inability to stop playing games"
  - "Poor Hygiene due to excessive video gaming"
  - "Received an individualized Education Plan (IEP)"
  - "Social isolation"
  - "Stealing money for gaming"
  - "Withdrawal symptoms"
  - "Other Affects"
  - "No affects from video games"
- **Classes**: Standard checkbox classes with `mt-1` for alignment

#### Medical Treatments Received Field
- **Label**: "Have you received any of the following medical treatments due to playing video games? *" (required)
- **Type**: Checkboxes
- **Layout**: 2-column grid
- **Options**:
  - "Counseling"
  - "Doctor visits"
  - "Hospitalization"
  - "In person gaming addiction program"
  - "Online gaming addiction program"
  - "Therapy"
  - "Other treatment"
  - "No treatment"
- **Classes**: Standard checkbox classes with `mt-1` for alignment

#### Medical Provider Diagnosis Field
- **Label**: "Did a medical provider diagnosis and/or treat you for any of the gaming related injuries? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Yes" (value: "yes")
  - "No" (value: "no")
- **Classes**: Standard radio classes

#### Medication Taken Field
- **Label**: "Was any medication taken to treat you for any of the gaming related injuries? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Yes" (value: "yes")
  - "No" (value: "no")
- **Classes**: Standard radio classes

### Medical, Legal & Contact Information Section
**Background**: Gray (`bg-gray-50 p-4 rounded-lg`)

#### Other Medical Conditions Field
- **Label**: "List any other medical conditions you have been diagnosed with in the past ten years? *" (required)
- **Type**: Textarea
- **Rows**: 4
- **Placeholder**: "Please list any medical conditions..."
- **Classes**: Standard textarea classes with `resize-vertical`

#### Legal History Fields
**Layout**: 2-column grid

##### Filed Lawsuit Field
- **Label**: "Have you filed a lawsuit or been a defendant in a lawsuit? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Yes" (value: "yes")
  - "No" (value: "no")
- **Classes**: Standard radio classes

##### Convicted Crime Field
- **Label**: "Have you ever been convicted of a misdemeanor or felony? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Yes" (value: "yes")
  - "No" (value: "no")
- **Classes**: Standard radio classes

#### SSDI & SSI Benefits Fields
**Layout**: 2-column grid

##### Receive SSDI Field
- **Label**: "Do you receive SSDI (Social Security Disability Insurance) benefits? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Yes" (value: "yes")
  - "No" (value: "no")
- **Classes**: Standard radio classes

##### Receive SSI Field
- **Label**: "Do you receive SSI (Supplemental Security Income) benefits? *" (required)
- **Type**: Radio buttons
- **Options**:
  - "Yes" (value: "yes")
  - "No" (value: "no")
- **Classes**: Standard radio classes

#### Driver's License Upload Field
- **Label**: "Upload Drivers License"
- **Type**: File upload
- **Accept**: `image/*,.pdf`
- **Max Size**: 10 MB
- **UI**: Drag and drop area with cloud upload icon
- **Text**: "Drag and drop here or Browse files"
- **Classes**: `border-2 border-dashed border-gray-300 rounded-lg p-6 text-center`

#### Emergency Contact Information Fields
**Layout**: 3-column grid

##### Emergency Contact Name Field
- **Label**: "Emergency Contact Name"
- **Type**: Text input
- **Placeholder**: "Enter emergency contact name"
- **Required**: No
- **Classes**: Standard input classes

##### Emergency Contact Phone Field
- **Label**: "Emergency Contact Phone #"
- **Type**: Tel input
- **Placeholder**: "Enter phone number"
- **Required**: No
- **Classes**: Standard input classes

##### Emergency Contact Relationship Field
- **Label**: "Emergency Contact Relationship to client"
- **Type**: Text input
- **Placeholder**: "e.g., Parent, Spouse, Friend"
- **Required**: No
- **Classes**: Standard input classes

#### Notes Field
- **Label**: "Notes"
- **Type**: Textarea
- **Rows**: 4
- **Placeholder**: "Additional notes or comments..."
- **Required**: No
- **Classes**: Standard textarea classes with `resize-vertical`

## Form Data Interface

```typescript
interface FormData {
  // Agent Information
  agentId: string;
  agentName: string;
  
  // Date/Time Information
  submissionDate: string;
  submissionTime: string;
  
  // Relationship & Status
  relationship: string;
  isMinor: string;
  
  // Caller Information (for "Loved one" relationship)
  callerName: string;
  callerEmail: string;
  callerAddressLine1: string;
  callerAddressLine2: string;
  callerCity: string;
  callerState: string;
  callerZipCode: string;
  legalAuthorization: string;
  isClaimantDeceased: string;
  
  // Injured Party Information
  injuredPartyFirstName: string;
  injuredPartyMiddleName: string;
  injuredPartyLastName: string;
  injuredPartySuffix: string;
  gender: string;
  injuredPartyEmail: string;
  injuredPartyDOB: string;
  injuredPartySSN: string;
  
  // Address Information
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Contact Information
  phoneNumber: string;
  secondaryPhoneNumber: string;
  callerNumberType: string;
  
  // Legal Information
  previousAttorneyDocuments: string;
  legalFullName: string;
  currentlyInSchool: string;
  highestEducationLevel: string;
  
  // Gaming History
  gamingStartDate: string;
  hoursPerDayGaming: string;
  gamingPlatforms: string[];
  firstGamePlayed: string;
  detailedGamingHistory: string;
  
  // Gamer Tags for Platforms
  playstationGamerTag: string;
  xboxGamerTag: string;
  nintendoSwitchGamerTag: string;
  laptopDesktopName: string;
  laptopBrands: string[];
  steamGamerTag: string;
  appleIphoneGamerTag: string;
  androidPhoneGamerTag: string;
  oculusVrGamerTag: string;
  metaQuestGamerTag: string;
  otherGamingDeviceGamerTag: string;
  
  // Gaming Subscriptions & Accessories
  monthlySubscriptions: string[];
  cloudGamingSubscriptions: string;
  virtualRealityAccessories: string;
  gamePurchaseReceipts: string;
  
  // Gaming Habits & Financial
  monthlyGamingSpend: string;
  triedToStopGaming: string;
  paidForAdditionalItems: string;
  receivedEnergyDrinkRewards: string;
  gamingProof: string[];
  watchedGamingInfluencers: string;
  soldVideoGameContent: string;
  
  // Gaming Disorder Symptoms & Injuries
  gamingDisorderSymptoms: string[];
  gamingInjuries: string[];
  
  // Life Impact & Medical Treatment
  lifeImpactFromGaming: string[];
  medicalTreatmentsReceived: string[];
  medicalProviderDiagnosis: string;
  medicationTaken: string;
  
  // Final Section - Medical, Legal, & Contact Info
  otherMedicalConditions: string;
  filedLawsuit: string;
  convictedCrime: string;
  receiveSSDI: string;
  receiveSSI: string;
  driversLicense: File | null;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  notes: string;
  
  // Gaming Profile (for other steps)
  platforms: string[];
  gamertags: {
    xbox?: string;
    playstation?: string;
    steam?: string;
  };
  dailyHours: string;
  primaryGames: string[];
  
  // Assessment (for other steps)
  durationOfConcern: string;
  affectedAreas: string[];
  symptoms: string[];
  emergencyIndicators: string[];
  
  // Treatment (for other steps)
  helpType: string;
  previousAttempts: string[];
  zoomLink: string;
}
```

## Conditional Rendering Logic

### Relationship-Based Conditional Rendering

#### When `relationship === 'myself'`:
- Shows only Injured Party fields
- No Caller Information section
- Injured Party fields are the same as the person filling out the form

#### When `relationship === 'loved_one'`:
- Shows Caller Information section
- Shows separate Injured Party Information section
- Caller fields are for the person filling out the form
- Injured Party fields are for the person who played video games

### Platform-Based Conditional Rendering

#### Gamer Tag Fields:
- PlayStation Gamer Tag: Shows when `gamingPlatforms.includes('playstation')`
- Xbox Gamer Tag: Shows when `gamingPlatforms.includes('xbox')`
- Nintendo Switch Gamer Tag: Shows when `gamingPlatforms.includes('nintendoSwitch')`
- Steam Gamer Tag: Shows when `gamingPlatforms.includes('steam')`
- Apple iPhone Gamer Tag: Shows when `gamingPlatforms.includes('appleIphone')`
- Android Phone Gamer Tag: Shows when `gamingPlatforms.includes('androidPhone')`
- Oculus VR Gamer Tag: Shows when `gamingPlatforms.includes('oculusVr')`
- Meta Quest Gamer Tag: Shows when `gamingPlatforms.includes('metaQuest')`
- Other Gaming Device Gamer Tag: Shows when `gamingPlatforms.includes('otherGamingDevice')`

#### Gaming Computer/Laptop Fields:
- Laptop/Desktop Name: Shows when `gamingPlatforms.includes('gamingComputer')`
- Laptop Brands: Shows when `gamingPlatforms.includes('gamingComputer')`

## Form Validation

### Required Fields (marked with *)
- All fields marked with asterisk (*) are required
- Form submission is blocked if required fields are empty
- Visual indicators show required vs optional fields

### Field Validation
- Email fields: HTML5 email validation
- Date fields: HTML5 date validation
- Number fields: HTML5 number validation with min/max constraints
- File upload: Size limit of 10 MB, accepts images and PDFs

## Styling Classes

### Standard Input Classes
```css
w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white
```

### Standard Radio Classes
```css
text-blue-600 focus:ring-blue-500
```

### Standard Checkbox Classes
```css
rounded border-gray-300 text-blue-600 focus:ring-blue-500
```

### Standard Select Classes
```css
w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white
```

### Standard Textarea Classes
```css
w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500 bg-white resize-vertical
```

## Form Submission

### Test Mode
- Form submits to `/api/test-rts-submission?agent=${agentId}`
- Shows test mode banner
- No actual data sent to law firms
- Simulates routing and bonus eligibility logic

### Production Mode (Future)
- Will submit to actual VGA form via Playwright/Puppeteer
- Data will be scraped and auto-populated
- Law firms will receive properly formatted submissions

## URL Parameters

### Agent ID
- Extracted from URL parameter `?agent=`
- Auto-populates Agent ID field
- Used for tracking leads and commissions
- Example: `http://localhost:3000/rts-test?agent=AHRPE5559`

## File Structure

### Component Location
- File: `components/RTSIntakeFormTest.tsx`
- Route: `/rts-test`
- Page: `src/app/rts-test/page.tsx`

### Related Files
- `components/RTSIntakeForm.tsx` (production form)
- `components/VGAWhiteBackgroundForm.tsx` (reference)
- API endpoints for form submission

## Browser Compatibility

### Supported Features
- HTML5 form validation
- File upload with drag and drop
- CSS Grid and Flexbox layouts
- Modern JavaScript features
- Tailwind CSS styling

### Minimum Requirements
- Modern browser with ES6+ support
- CSS Grid support
- File API support for uploads
- Local storage for form persistence

## Performance Considerations

### Form Optimization
- Conditional rendering reduces DOM size
- Lazy loading of conditional sections
- Efficient state management with React hooks
- Minimal re-renders with proper dependency arrays

### Data Handling
- Form data stored in React state
- No unnecessary API calls during form filling
- Efficient array field updates
- Proper TypeScript typing for data integrity

## Accessibility Features

### ARIA Labels
- All form fields have proper labels
- Radio buttons and checkboxes have associated labels
- Error messages are properly announced
- Focus management for keyboard navigation

### Keyboard Navigation
- Tab order follows logical form flow
- Enter key submits forms
- Escape key can cancel operations
- Arrow keys work for radio button selection

## Security Considerations

### Data Protection
- No sensitive data stored in localStorage
- Form data only sent over HTTPS
- File uploads validated for type and size
- XSS protection through proper input sanitization

### Validation
- Client-side validation for user experience
- Server-side validation for security
- File type and size restrictions
- Input sanitization and encoding

## Future Enhancements

### Planned Features
- Form auto-save functionality
- Progress tracking and resume capability
- Enhanced file upload with preview
- Real-time validation feedback
- Mobile-optimized responsive design

### Integration Points
- Playwright/Puppeteer scraping setup
- Firestore database integration
- Admin dashboard development
- Agent performance tracking
- Commission calculation system

---

**This documentation serves as the complete specification for the VGA form replica. Every field, validation rule, conditional behavior, and styling detail has been documented to ensure perfect replication of the original VGA form for automated data transfer.** 