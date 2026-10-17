import { Component, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from '../../models/assignment.model';
import { AssignmentCardComponent } from '../assignment-card/assignment-card.component';
import { CreateAssignmentModalComponent } from '../create-assignment-modal/create-assignment-modal.component';
import { AssignmentDetailModalComponent } from '../assignment-detail-modal/assignment-detail-modal.component';

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
  showEditModal    = signal(false);
  assignmentToEdit = signal<Assignment | null>(null);
  detailAssignment = signal<Assignment | null>(null);

  readonly assignments = computed(() =>
    [...this.assignmentService.assignments()].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
  );

  constructor(readonly assignmentService: AssignmentService) {}

  open(assignment: Assignment): void {
    this.assignmentService.openInNewTab(assignment);
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
