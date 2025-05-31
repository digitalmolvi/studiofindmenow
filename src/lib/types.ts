export interface Case {
  case_id: string;
  timestamp: string; // ISO date string
  region: string;
  priority_level: 'High' | 'Medium' | 'Low';
  full_name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other' | string; // Allow string for other user inputs
  last_known_location: string;
  date_last_seen: string; // Date string formatted as YYYY-MM-DD
  status: 'New' | 'Investigating' | 'Found';
  photoUrl?: string;
  clothing_description: string;
  appearance_description?: string;
  distinguishing_features?: string;
  generated_summary?: string;
  recommendations?: string;
}

export type CaseFormData = {
  full_name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other' | string;
  last_known_location: string;
  date_last_seen: Date;
  region: string;
  clothing_description: string;
  appearance_description?: string;
  photo?: FileList;
  distinguishing_features?: string;
  consent: boolean;
};

export interface GeneratedCaseReport {
  case_summary: string;
  priority_level: 'High' | 'Medium' | 'Low';
  recommendations: string;
}
