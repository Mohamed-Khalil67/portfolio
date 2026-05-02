import { Component } from '@angular/core';
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
export class App {}
