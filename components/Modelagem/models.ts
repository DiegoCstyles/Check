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
  responsibleChecklist: string;
  responsiblePlan: string;
  completed: boolean;
}

export interface AppliedChecklist {
  id: number;
  title: string;
  dateApplied: string;
  // Add other properties relevant to applied checklists
}

export interface ActionPlan {
  description: string;
  count: number;
}
