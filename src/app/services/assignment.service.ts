import { Injectable, signal } from '@angular/core';
import { Assignment } from '../models/assignment.model';
import { ASSIGNMENTS } from '../data/assignments.data';

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private readonly STORAGE_KEY = 'portfolio_local_assignments';

  /** Reactive list — combines static data file assignments + localStorage ones */
  readonly assignments = signal<Assignment[]>(this.loadAll());

  // ── Read ────────────────────────────────────────────────────────
  private loadAll(): Assignment[] {
    return [...ASSIGNMENTS, ...this.getLocal()];
  }

  private getLocal(): Assignment[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Assignment[]) : [];
    } catch {
      return [];
    }
  }

  // ── Write ───────────────────────────────────────────────────────
  add(assignment: Assignment): void {
    const locals = this.getLocal();
    locals.push(assignment);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(locals));
    this.assignments.set(this.loadAll());
  }

  remove(id: string): void {
    const locals = this.getLocal().filter(a => a.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(locals));
    this.assignments.set(this.loadAll());
  }

  update(id: string, changes: Partial<Omit<Assignment, 'id' | 'isLocal'>>): void {
    const locals = this.getLocal().map(a =>
      a.id === id ? { ...a, ...changes } : a
    );
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(locals));
    this.assignments.set(this.loadAll());
  }

  // ── HTML generation ─────────────────────────────────────────────
  buildHtml(html = '', css = '', js = ''): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
${css}
  </style>
</head>
<body>
${html}${js ? `\n<script>\n${js}\n</script>` : ''}
</body>
</html>`;
  }

  /** Creates a temporary blob URL — call URL.revokeObjectURL() when done */
  createBlobUrl(html = '', css = '', js = ''): string {
    const content = this.buildHtml(html, css, js);
    const blob = new Blob([content], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }

  /** Open assignment preview in a new browser tab */
  openInNewTab(assignment: Assignment): void {
    if (assignment.isLocal && assignment.sourceCode) {
      const url = this.createBlobUrl(
        assignment.sourceCode.html,
        assignment.sourceCode.css,
        assignment.sourceCode.js
      );
      const tab = window.open(url, '_blank');
      // Revoke blob URL after the new tab has had time to load
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
      if (!tab) alert('Pop-up blocked — please allow pop-ups for this site.');
    } else {
      window.open(assignment.previewUrl, '_blank');
    }
  }

  /** Generate a unique ID for new local assignments */
  generateId(): string {
    return `local-${Date.now()}`;
  }
}
