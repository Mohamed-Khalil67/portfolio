import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  HostListener,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from '../../models/assignment.model';

type CodeTab = 'html' | 'css' | 'js';

const COLOR_PRESETS = [
  { label: 'Pink / Red', value: '#f093fb, #f5576c' },
  { label: 'Blue', value: '#4facfe, #00f2fe' },
  { label: 'Green', value: '#43e97b, #38f9d7' },
  { label: 'Orange', value: '#fa709a, #fee140' },
  { label: 'Purple', value: '#a18cd1, #fbc2eb' },
  { label: 'Coral', value: '#fd7043, #ff8a65' },
  { label: 'Sky', value: '#a1c4fd, #c2e9fb' },
  { label: 'Gold', value: '#f6d365, #fda085' },
];

@Component({
  selector: 'app-create-assignment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-assignment-modal.component.html',
  styleUrls: ['./create-assignment-modal.component.scss'],
})
export class CreateAssignmentModalComponent implements OnChanges {
  @Input() assignmentToEdit: Assignment | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<Assignment>();
  @Output() updated = new EventEmitter<Assignment>();

  readonly colorPresets = COLOR_PRESETS;
  activeTab = signal<CodeTab>('html');
  saving = false;

  form = {
    title: '',
    description: '',
    week: '' as string | number,
    tagsRaw: '',
    color: COLOR_PRESETS[0].value,
    html: `<!-- Write your HTML here -->
<h1>Hello World</h1>
<p>Your assignment content goes here.</p>`,
    css: `/* Write your CSS here */
body {
  font-family: system-ui, sans-serif;
  padding: 24px;
}`,
    js: `// Write your JavaScript here
console.log('Assignment loaded!');`,
  };

  get parsedTags(): string[] {
    return this.form.tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  get isValid(): boolean {
    return (
      this.form.title.trim().length > 0 && this.form.html.trim().length > 0
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['assignmentToEdit'] && this.assignmentToEdit) {
      const a = this.assignmentToEdit;
      this.form.title = a.title;
      this.form.description = a.description;
      this.form.week = a.week ?? '';
      this.form.tagsRaw = a.tags.join(', ');
      this.form.color = a.color ?? COLOR_PRESETS[0].value;
      this.form.html = a.sourceCode?.html ?? '';
      this.form.css = a.sourceCode?.css ?? '';
      this.form.js = a.sourceCode?.js ?? '';
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  constructor(private assignmentService: AssignmentService) {}

  close(): void {
    this.closed.emit();
  }

  setTab(tab: CodeTab): void {
    this.activeTab.set(tab);
  }

  setColor(value: string): void {
    this.form.color = value;
  }

  save(): void {
    if (!this.isValid || this.saving) return;
    this.saving = true;

    const tags = this.parsedTags.length ? this.parsedTags : ['HTML'];
    const weekNum = this.form.week ? Number(this.form.week) : undefined;
    const downloadFiles = [
      { name: 'index.html', url: '__local_html__' },
      ...(this.form.css.trim()
        ? [{ name: 'style.css', url: '__local_css__' }]
        : []),
      ...(this.form.js.trim()
        ? [{ name: 'script.js', url: '__local_js__' }]
        : []),
    ];

    if (this.assignmentToEdit) {
      const changes: Partial<Assignment> = {
        title: this.form.title.trim(),
        description: this.form.description.trim(),
        week: weekNum,
        tags,
        color: this.form.color,
        sourceCode: this.assignmentToEdit.isLocal
          ? { html: this.form.html, css: this.form.css, js: this.form.js }
          : undefined,
        downloadFiles: this.assignmentToEdit.isLocal
          ? downloadFiles
          : undefined,
      };

      if (this.assignmentToEdit.isLocal) {
        this.assignmentService.update(this.assignmentToEdit.id, changes);
      } else {
        this.assignmentService.setOverride(this.assignmentToEdit.id, changes);
      }
      this.updated.emit({ ...this.assignmentToEdit, ...changes });
    } else {
      const newAssignment: Assignment = {
        id: this.assignmentService.generateId(),
        title: this.form.title.trim(),
        description: this.form.description.trim(),
        week: weekNum,
        tags,
        previewUrl: '__local__',
        color: this.form.color,
        isLocal: true,
        sourceCode: {
          html: this.form.html,
          css: this.form.css,
          js: this.form.js,
        },
        downloadFiles,
      };
      this.assignmentService.add(newAssignment);
      this.created.emit(newAssignment);
    }

    this.saving = false;
    this.close();
  }
}
