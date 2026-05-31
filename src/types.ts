export interface ProCon {
  text: string;
  impact: "High" | "Medium" | "Low" | string;
}

export interface SwotMatrix {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface OptionAnalysis {
  name: string;
  description: string;
  score: number;
  pros: ProCon[];
  cons: ProCon[];
  swot: SwotMatrix;
}

export interface ComparisonRow {
  optionName: string;
  scores: number[];
  notes: string[];
}

export interface ComparisonGrid {
  criteriaList: string[];
  rows: ComparisonRow[];
}

export interface RecommendationDetails {
  bestOption: string;
  rationale: string;
  nextSteps: string[];
  risksToMitigate: string[];
}

export interface AnalysisResponse {
  decisionQuestion: string;
  summary: string;
  options: OptionAnalysis[];
  comparisonTable: ComparisonGrid;
  recommendation: RecommendationDetails;
}

export interface SavedDecision {
  id: string;
  question: string;
  timestamp: string;
  options: string[];
  preferredCriteria?: string;
  analysis: AnalysisResponse;
}
