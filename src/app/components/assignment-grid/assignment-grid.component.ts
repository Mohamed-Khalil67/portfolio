import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from '../../models/assignment.model';
import { AssignmentCardComponent } from '../assignment-card/assignment-card.component';
import { CreateAssignmentModalComponent } from '../create-assignment-modal/create-assignment-modal.component';

interface Section {
  key: string;
  label: string;
  assignments: Assignment[];
}

const SECTION_ORDER: { key: string; label: string }[] = [
  { key: 'route-assignments', label: 'Route Assignments' },
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
  ],
  templateUrl: './assignment-grid.component.html',
  styleUrls: ['./assignment-grid.component.scss'],
})
export class AssignmentGridComponent {
  showEditModal    = signal(false);
  assignmentToEdit = signal<Assignment | null>(null);
  searchQuery      = signal('');

  private readonly filtered = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    return this.assignmentService.assignments().filter((a) =>
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q)),
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

  readonly totalCount = computed(() => this.filtered().length);

  constructor(readonly assignmentService: AssignmentService) {}

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onEditRequested(assignment: Assignment): void {
    this.assignmentToEdit.set(assignment);
    this.showEditModal.set(true);
  }

  onEditModalClosed(): void {
    this.showEditModal.set(false);
    this.assignmentToEdit.set(null);
  }
}
