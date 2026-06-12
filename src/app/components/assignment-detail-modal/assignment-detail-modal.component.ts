import { Component, Input, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Assignment } from '../../models/assignment.model';
import { AssignmentService } from '../../services/assignment.service';

@Component({
  selector: 'app-assignment-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assignment-detail-modal.component.html',
  styleUrls: ['./assignment-detail-modal.component.scss'],
})
export class AssignmentDetailModalComponent implements OnInit, OnDestroy {
  @Input({ required: true }) assignment!: Assignment;
  @Output() closed = new EventEmitter<void>();

  private prevOverflow = '';

  constructor(
    private sanitizer: DomSanitizer,
    private assignmentService: AssignmentService,
  ) {}

  ngOnInit(): void {
    this.prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = this.prevOverflow;
  }

  get safePreviewUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.assignment.previewUrl);
  }

  get accentStyle(): Record<string, string> {
    return {
      '--accent': `linear-gradient(135deg, ${this.assignment.color ?? '#f093fb, #f5576c'})`,
    };
  }

  close(): void { this.closed.emit(); }

  openInNewTab(): void { this.assignmentService.openInNewTab(this.assignment); }

  download(file: { name: string; url: string }): void {
    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.name;
    a.click();
  }

  copyLink(): void {
    const url = new URL(this.assignment.previewUrl, location.origin).toString();
    navigator.clipboard?.writeText(url);
  }

  onBackdrop(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('detail-backdrop')) this.close();
  }

  @HostListener('document:keydown.escape')
  onEsc(): void { this.close(); }

  getFileIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const icons: Record<string, string> = {
      html: '🌐', css: '🎨', js: '⚡', ts: '🔷',
      json: '📋', png: '🖼', jpg: '🖼', svg: '🖼',
    };
    return icons[ext ?? ''] ?? '📄';
  }
}
