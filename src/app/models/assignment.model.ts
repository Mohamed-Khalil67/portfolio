export interface AssignmentFile {
  name: string;
  url: string;
}

export interface AssignmentSourceCode {
  html?: string;
  css?: string;
  js?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  week?: number;
  tags: string[];
  previewUrl: string;          // path for static assets, '__local__' for dynamic
  downloadFiles: AssignmentFile[];
  color?: string;              // gradient accent, e.g. '#f093fb, #f5576c'
  isLocal?: boolean;           // true = stored in localStorage
  sourceCode?: AssignmentSourceCode;
}
