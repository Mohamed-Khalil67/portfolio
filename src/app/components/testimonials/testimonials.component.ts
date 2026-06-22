import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  /** optional path to a photo, e.g. 'assets/testimonials/jane.jpg' */
  photo?: string;
}

export interface Stat {
  value: string;
  label: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
})
export class TestimonialsComponent {
  // ── EDIT ME ───────────────────────────────────────────────────────
  // Add real client testimonials here. While this array is empty, the
  // component renders the stats band below instead.
  readonly testimonials: Testimonial[] = [
    // {
    //   name: 'Jane Doe',
    //   role: 'Founder',
    //   company: 'Acme Store',
    //   quote: 'Mohamed rebuilt our store and sales jumped 30% in two months.',
    //   photo: 'assets/testimonials/jane.jpg',
    // },
  ];

  // ── Fallback stats band (shown when there are no testimonials) ─────
  // TODO: replace with your real numbers.
  readonly stats: Stat[] = [
    { value: '5+', label: 'Projects delivered' },
    { value: '5+', label: 'Happy clients' },
    { value: '100%', label: 'On-time delivery' },
    { value: '<24h', label: 'Reply time' },
  ];

  get hasTestimonials(): boolean {
    return this.testimonials.length > 0;
  }

  initials(name: string): string {
    return name
      .split(/\s+/)
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
