import { Component, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from '../../models/assignment.model';
import { AssignmentCardComponent } from '../assignment-card/assignment-card.component';
import { CreateAssignmentModalComponent } from '../create-assignment-modal/create-assignment-modal.component';
import { AssignmentDetailModalComponent } from '../assignment-detail-modal/assignment-detail-modal.component';

interface Section {
  key: string;
  label: string;
  assignments: Assignment[];
}

const SECTION_ORDER: { key: string; label: string }[] = [
  { key: 'route-assignments', label: 'Landing Pages' },
  { key: 'frontend',          label: 'Front End Projects' },
  { key: 'fullstack',         label: 'Full Stack Projects' },
];

@Component({
  selector: 'app-assignment-grid',
  standalone: true,
  imports: [
    CommonModule,
    AssignmentCardComponent,
    CreateAssignmentModalComponent,
    AssignmentDetailModalComponent,
  ],
  templateUrl: './assignment-grid.component.html',
  styleUrls: ['./assignment-grid.component.scss'],
})
export class AssignmentGridComponent {
  readonly SECTION_ORDER = SECTION_ORDER;

  showEditModal    = signal(false);
  assignmentToEdit = signal<Assignment | null>(null);
  detailAssignment = signal<Assignment | null>(null);
  activeCategory   = signal<string>('all');

  private readonly filtered = computed(() => {
    const cat = this.activeCategory();
    return this.assignmentService.assignments().filter(
      (a) => cat === 'all' || (a.category ?? 'route-assignments') === cat,
    );
  });

  readonly sections = computed<Section[]>(() => {
    const items = this.filtered();
    return SECTION_ORDER
      .map((s) => ({
        ...s,
        assignments: items.filter(
          (a) => (a.category ?? 'route-assignments') === s.key,
        ),
      }))
      .filter((s) => s.assignments.length > 0);
  });

  constructor(readonly assignmentService: AssignmentService) {}

  setCategory(key: string): void {
    this.activeCategory.set(key);
  }

  onEditRequested(assignment: Assignment): void {
    this.assignmentToEdit.set(assignment);
    this.showEditModal.set(true);
  }

  onEditModalClosed(): void {
    this.showEditModal.set(false);
    this.assignmentToEdit.set(null);
  }

  openDetail(assignment: Assignment): void {
    this.detailAssignment.set(assignment);
  }

  closeDetail(): void {
    this.detailAssignment.set(null);
  }

  @HostListener('window:keydown.escape')
  onEsc(): void {
    if (this.detailAssignment()) this.closeDetail();
  }
}
