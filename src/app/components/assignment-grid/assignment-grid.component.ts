import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from '../../models/assignment.model';
import { AssignmentCardComponent } from '../assignment-card/assignment-card.component';
import { CreateAssignmentModalComponent } from '../create-assignment-modal/create-assignment-modal.component';

@Component({
  selector: 'app-assignment-grid',
  standalone: true,
  imports: [CommonModule, AssignmentCardComponent, CreateAssignmentModalComponent],
  templateUrl: './assignment-grid.component.html',
  styleUrls: ['./assignment-grid.component.scss'],
})
export class AssignmentGridComponent {
  showCreateModal  = signal(false);
  assignmentToEdit = signal<Assignment | null>(null);
  searchQuery     = signal('');
  selectedTags    = signal<Set<string>>(new Set());

  readonly allTags = computed(() => {
    const tags = new Set<string>();
    this.assignmentService.assignments().forEach(a => a.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  });

  readonly filteredAssignments = computed(() => {
    const q    = this.searchQuery().toLowerCase().trim();
    const tags = this.selectedTags();
    return this.assignmentService.assignments().filter(a => {
      const matchesSearch = !q ||
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q));
      const matchesTags = tags.size === 0 || a.tags.some(t => tags.has(t));
      return matchesSearch && matchesTags;
    });
  });

  constructor(readonly assignmentService: AssignmentService) {}

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  toggleTag(tag: string): void {
    const next = new Set(this.selectedTags());
    next.has(tag) ? next.delete(tag) : next.add(tag);
    this.selectedTags.set(next);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedTags.set(new Set());
  }

  onEditRequested(assignment: Assignment): void {
    this.assignmentToEdit.set(assignment);
    this.showCreateModal.set(true);
  }

  onModalClosed(): void {
    this.showCreateModal.set(false);
    this.assignmentToEdit.set(null);
  }

  get hasActiveFilters(): boolean {
    return this.searchQuery().trim().length > 0 || this.selectedTags().size > 0;
  }
}
