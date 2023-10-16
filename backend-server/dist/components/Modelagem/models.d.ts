/// <reference types="node" />
export interface RiskItem {
    id: number;
    title: string;
    description: string;
    planDescription: string;
    planFiles: Blob | string;
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
    dateApplied: string;
}
export interface ActionPlan {
    description: string;
    count: number;
}
