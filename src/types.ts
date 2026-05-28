export interface DiagnosticOption {
  label: string;
  icon?: string;
  next: DiagnosticNode;
}

export interface QuestionNode {
  question: string;
  description?: string;
  badge?: string;
  isGrid?: boolean;
  options: DiagnosticOption[];
}

export interface ResultNode {
  diagnosis: string;
  explanation: string;
  steps: string[];
  tip: string;
  videoSearch?: string;
}

export type DiagnosticNode = QuestionNode | ResultNode;

export function isResult(node: DiagnosticNode): node is ResultNode {
  return 'diagnosis' in node;
}
