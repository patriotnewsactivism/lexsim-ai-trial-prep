
export enum CaseStatus {
  PRE_TRIAL = 'Pre-Trial',
  DISCOVERY = 'Discovery',
  TRIAL = 'Trial',
  APPEAL = 'Appeal',
  CLOSED = 'Closed'
}

export enum DocumentType {
  DEPOSITION = 'Deposition',
  MOTION = 'Motion',
  EVIDENCE = 'Evidence',
  CONTRACT = 'Contract',
  OTHER = 'Other'
}

export type TrialPhase = 
  | 'pre-trial-motions'
  | 'voir-dire' 
  | 'opening-statement' 
  | 'direct-examination' 
  | 'cross-examination' 
  | 'defendant-testimony'
  | 'closing-argument' 
  | 'sentencing';

export type SimulationMode = 'learn' | 'practice' | 'trial';

export interface Case {
  id: string;
  title: string;
  client: string;
  status: CaseStatus;
  opposingCounsel: string;
  judge: string;
  nextCourtDate: string;
  summary: string;
  winProbability: number;
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  date: string;
  content: string;
  summary?: string;
  keyEntities?: string[];
}

export interface Witness {
  id: string;
  name: string;
  role: string;
  personality: string; // e.g., "Hostile", "Nervous", "Cooperative"
  credibilityScore: number; // 0-100
  avatarUrl: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'witness' | 'system' | 'opponent' | 'coach';
  text: string;
  timestamp: number;
  sentiment?: string;
}

export interface StrategyInsight {
  title: string;
  description: string;
  confidence: number;
  type: 'risk' | 'opportunity' | 'prediction';
}

export interface OpposingProfile {
  name: string;
  firm: string;
  aggressiveness: number; // 0-100
  settlementTendency: number; // 0-100
  commonTactics: string[];
}

export interface CoachingAnalysis {
  critique: string;
  suggestion: string;
  sampleResponse: string;
  fallaciesIdentified: string[]; // List of logical fallacies detected
  rhetoricalEffectiveness: number; // 0-100 score
  rhetoricalFeedback: string; // Brief comment on tone/persuasion
  teleprompterScript?: string; // New field for providing text to read/reference
}

export interface TrialSession {
  id: string;
  caseId: string;
  caseTitle: string;
  phase: TrialPhase;
  mode: SimulationMode;
  date: string;
  duration: number; // seconds
  transcript: Message[];
  audioUrl?: string; // blob URL or base64
  score?: number; // 0-100 overall performance
  metrics?: {
    objectionsReceived: number;
    fallaciesCommitted: number;
    avgRhetoricalScore: number;
    wordCount: number;
    fillerWordsCount: number;
  };
  feedback?: string;
}

export interface Juror {
  id: string;
  name: string;
  age: number;
  occupation: string;
  education: string;
  background: string;
  biases?: string[];
  leaningScore: number; // -100 (defense) to +100 (prosecution)
  avatar: string;
}

export interface JuryDeliberation {
  jurорId: string;
  statement: string;
  timestamp: number;
  leaningChange?: number; // How much this statement affected others
}

export interface JuryVerdict {
  verdict: 'guilty' | 'not guilty' | 'hung';
  confidence: number; // 0-100
  voteTally: {
    guilty: number;
    notGuilty: number;
  };
  reasoning: string;
  dissenting?: string[]; // Juror IDs who dissented
  weakness: string[]; // Weaknesses in your case identified by jury
  strengths: string[]; // Strengths in your case
}

export interface TimelineEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  description: string;
  type: 'incident' | 'evidence' | 'witness' | 'filing' | 'hearing' | 'other';
  linkedEvidence?: string[]; // IDs of related evidence/documents
  linkedWitnesses?: string[]; // IDs of related witnesses
  importance: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
}

export interface Evidence {
  id: string;
  exhibitNumber?: string; // e.g., "Plaintiff Ex. 1" or "Defense Ex. A"
  name: string;
  type: DocumentType;
  description: string;
  dateObtained: string;
  source?: string;
  linkedTo?: string[]; // IDs of timeline events or witnesses
  tags?: string[];
  status: 'pending' | 'admitted' | 'excluded' | 'challenged';
  notes?: string;
}