import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assignment } from '../../models/assignment.model';

@Component({
  selector: 'app-assignment-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assignment-card.component.html',
  styleUrls: ['./assignment-card.component.scss'],
})
export class AssignmentCardComponent {
  @Input() assignment!: Assignment;
  @Input() index = 0;
  @Output() editRequested = new EventEmitter<Assignment>();

  private readonly defaultColors = [
    '#f093fb, #f5576c',
    '#4facfe, #00f2fe',
    '#43e97b, #38f9d7',
    '#fa709a, #fee140',
    '#a18cd1, #fbc2eb',
    '#ffecd2, #fcb69f',
    '#a1c4fd, #c2e9fb',
    '#fd7043, #ff8a65',
  ];

  constructor() {}

  // ── Gradient helpers ──────────────────
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

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.editRequested.emit(this.assignment);
  }
}
