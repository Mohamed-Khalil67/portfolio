import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { AssignmentGridComponent } from './components/assignment-grid/assignment-grid.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, AssignmentGridComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  showScrollTop = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    const visible = window.scrollY > 600;
    if (visible !== this.showScrollTop()) this.showScrollTop.set(visible);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
