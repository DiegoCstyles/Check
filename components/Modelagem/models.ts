// models.ts
export interface RiskItem {
  id: number;
  title: string;
  description: string;
  planDescription: string;
  planFiles: Buffer | string;
  planFilesName: string;
  planApproval: string;
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
  dateApplied: string; // You can use Date type if preferred
  // Add other properties relevant to applied checklists
}

export interface ActionPlan {
  description: string;
  count: number;
}
