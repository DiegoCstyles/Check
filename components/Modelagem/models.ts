// models.ts
export interface RiskItem {
  id: number;
  title: string;
  description: string;
  plandescription: string;
  planFiles: Buffer | string;
  planFilesName: string;
  planapproval: string;
  likelihood: string;
  impact: string;
  date: string;
  responsiblechecklist: string;
  responsibleplan: string;
  completed: boolean;
}

export interface AppliedChecklist {
  id: number;
  dateapplied: string;
  score: number;
  risk_id: number;
}

export interface ActionPlan {
  description: string;
  count: number;
}
