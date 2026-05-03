import {
  Component, Input, Output, EventEmitter,
  OnInit, OnDestroy, AfterViewChecked,
  ViewChild, ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Assignment } from '../../models/assignment.model';
import { AssignmentService } from '../../services/assignment.service';

declare const Prism: any;

type ViewMode = 'preview' | 'code';

@Component({
  selector: 'app-assignment-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assignment-card.component.html',
  styleUrls: ['./assignment-card.component.scss'],
})
export class AssignmentCardComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() assignment!: Assignment;
  @Input() index = 0;
  @Output() editRequested = new EventEmitter<Assignment>();

  @ViewChild('codeBlock') codeBlock?: ElementRef<HTMLElement>;

  safePreviewUrl!: SafeResourceUrl;
  iframeLoaded     = false;
  showDownloadMenu = false;
  viewMode: ViewMode = 'preview';

  codeContent  = '';
  codeLanguage = 'markup';
  codeLoading  = false;
  codeError    = false;
  private needsHighlight = false;
  private thumbBlobUrl: string | null = null;

  private readonly defaultColors = [
    '#f093fb, #f5576c', '#4facfe, #00f2fe', '#43e97b, #38f9d7',
    '#fa709a, #fee140', '#a18cd1, #fbc2eb', '#ffecd2, #fcb69f',
    '#a1c4fd, #c2e9fb', '#fd7043, #ff8a65',
  ];

  constructor(
    private sanitizer: DomSanitizer,
    private assignmentService: AssignmentService,
  ) {}

  ngOnInit(): void {
    this.safePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.assignment.previewUrl
    );
  }

  ngOnDestroy(): void {
    if (this.thumbBlobUrl) URL.revokeObjectURL(this.thumbBlobUrl);
  }

  ngAfterViewChecked(): void {
    if (this.needsHighlight && this.codeBlock?.nativeElement) {
      this.needsHighlight = false;
      try {
        if (typeof Prism !== 'undefined') Prism.highlightElement(this.codeBlock.nativeElement);
      } catch { /* Prism not loaded yet */ }
    }
  }

  get accentGradient(): string {
    if (this.assignment.color) return this.assignment.color;
    const i = parseInt(this.assignment.id.replace(/\D/g, ''), 10) || 0;
    return this.defaultColors[i % this.defaultColors.length];
  }

  get cardStyle(): Record<string, string> {
    return {
      '--accent': `linear-gradient(135deg, ${this.accentGradient})`,
      '--i': String(this.index),
    };
  }

  setView(mode: ViewMode): void {
    this.viewMode = mode;
    if (mode === 'code' && !this.codeContent && !this.codeLoading) {
      this.loadCode();
    }
  }

  private async loadCode(): Promise<void> {
    this.codeLoading = true;
    this.codeError   = false;
    try {
      if (this.assignment.isLocal && this.assignment.sourceCode) {
        this.codeContent = this.assignmentService.buildHtml(
          this.assignment.sourceCode.html,
          this.assignment.sourceCode.css,
          this.assignment.sourceCode.js,
        );
      } else {
        const resp = await fetch(this.assignment.previewUrl);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        this.codeContent = await resp.text();
      }
      this.codeLanguage = 'markup';
    } catch {
      this.codeError   = true;
      this.codeContent = '<!-- Could not load source code -->';
    }
    this.codeLoading    = false;
    this.needsHighlight = true;
  }

  openInNewTab(event: MouseEvent): void {
    event.stopPropagation();
    this.assignmentService.openInNewTab(this.assignment);
  }

  onIframeLoad(): void { this.iframeLoaded = true; }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.editRequested.emit(this.assignment);
  }

  toggleDownloadMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.showDownloadMenu = !this.showDownloadMenu;
  }

  downloadFile(file: { name: string; url: string }, event: MouseEvent): void {
    event.stopPropagation();
    this.showDownloadMenu = false;
    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.name;
    a.click();
  }

  getFileIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const icons: Record<string, string> = {
      html: '🌐', css: '🎨', js: '⚡', ts: '🔷',
      json: '📋', png: '🖼', jpg: '🖼', svg: '🖼',
    };
    return icons[ext ?? ''] ?? '📄';
  }
}
