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
  highlights?: string[];       // short notes on the hard CSS techniques used
  color?: string;              // gradient accent, e.g. '#f093fb, #f5576c'
  category?: string;           // section key: 'route-assignments' | 'frontend' | 'fullstack'
  isLocal?: boolean;           // true = stored in localStorage
  sourceCode?: AssignmentSourceCode;

  // ── Case-study fields (optional) ──────────────────────────────────
  // Fill these in per project via the project's meta.json. All optional,
  // so existing projects keep working until you add the content.
  challenge?: string;          // the problem / brief the client had
  solution?: string;           // what you built and the approach you took
  result?: string;             // measurable outcome, e.g. "+32% conversion"
  liveUrl?: string;            // public live site URL (external)
  detailsUrl?: string;         // case-study / write-up URL (external)
}
