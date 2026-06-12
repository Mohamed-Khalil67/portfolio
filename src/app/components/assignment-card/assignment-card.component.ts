import {
  Component, Input, Output, EventEmitter,
  OnInit, OnDestroy, AfterViewInit, AfterViewChecked,
  ViewChild, ElementRef, NgZone,
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
export class AssignmentCardComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  @Input() assignment!: Assignment;
  @Input() index = 0;
  @Output() editRequested = new EventEmitter<Assignment>();
  @Output() openDetail    = new EventEmitter<Assignment>();

  @ViewChild('codeBlock') codeBlock?: ElementRef<HTMLElement>;

  safePreviewUrl!: SafeResourceUrl;
  iframeLoaded     = false;
  iframeVisible    = false;
  viewMode: ViewMode = 'preview';

  private observer?: IntersectionObserver;

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
    private host: ElementRef<HTMLElement>,
    private zone: NgZone,
  ) {}

  ngOnInit(): void {
    this.safePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.assignment.previewUrl
    );
  }

  ngAfterViewInit(): void {
    // Lazy-load iframe only when the card enters the viewport
    if (typeof IntersectionObserver === 'undefined') {
      this.iframeVisible = true;
      return;
    }
    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        entries => {
          if (entries.some(e => e.isIntersecting)) {
            this.zone.run(() => (this.iframeVisible = true));
            this.observer?.disconnect();
          }
        },
        { rootMargin: '200px' },
      );
      this.observer.observe(this.host.nativeElement);
    });
  }

  ngOnDestroy(): void {
    if (this.thumbBlobUrl) URL.revokeObjectURL(this.thumbBlobUrl);
    this.observer?.disconnect();
  }

  ngAfterViewChecked(): void {
    if (this.needsHighlight && this.codeBlock?.nativeElement) {
      this.needsHighlight = false;
      try {
        if (typeof Prism !== 'undefined') Prism.highlightElement(this.codeBlock.nativeElement);
      } catch { /* Prism not loaded yet */ }
    }
  }

  private static readonly LANGUAGE_TAGS = new Set([
    'html', 'html5', 'css', 'css3', 'js', 'javascript', 'ts', 'typescript',
    'scss', 'sass', 'less', 'json', 'xml', 'svg', 'markup',
  ]);

  get visibleTags(): string[] {
    return (this.assignment.tags ?? []).filter(
      t => !AssignmentCardComponent.LANGUAGE_TAGS.has(t.trim().toLowerCase())
    );
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

  requestDetail(event: MouseEvent): void {
    event.stopPropagation();
    this.openDetail.emit(this.assignment);
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.editRequested.emit(this.assignment);
  }

  downloadAll(event: MouseEvent): void {
    event.stopPropagation();
    this.assignment.downloadFiles.forEach((file, i) => {
      // Stagger so the browser doesn't drop concurrent download requests
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = file.url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, i * 150);
    });
  }
}
