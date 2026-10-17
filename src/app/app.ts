import {
  Component,
  HostListener,
  signal,
  inject,
  AfterViewInit,
  OnDestroy,
  NgZone,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { HeaderComponent } from './components/header/header.component';
import { ValuePropsComponent } from './components/value-props/value-props.component';
import { AssignmentGridComponent } from './components/assignment-grid/assignment-grid.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { ContactComponent } from './components/contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ValuePropsComponent,
    AssignmentGridComponent,
    TestimonialsComponent,
    ContactComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit, OnDestroy {
  showScrollTop = signal(false);
  activeSection = signal<string>('about');

  private title = inject(Title);
  private meta = inject(Meta);
  private zone = inject(NgZone);
  private host = inject(ElementRef<HTMLElement>);

  private observer?: IntersectionObserver;
  private glowEl: HTMLElement | null = null;
  private onMove = (e: MouseEvent) => {
    if (!this.glowEl) return;
    this.glowEl.style.setProperty('--mx', `${e.clientX}px`);
    this.glowEl.style.setProperty('--my', `${e.clientY}px`);
  };

  constructor() {
    this.title.setTitle(
      'Mohamed Khalil - Front-End Developer (Angular, TypeScript, CSS)',
    );
    this.meta.updateTag({
      name: 'description',
      content:
        'Front-end developer focused on the hard parts: scalable CSS, fluid ' +
        'responsive layouts, and motion without JavaScript. Angular, TypeScript ' +
        'and full-stack with NestJS.',
    });
    this.meta.updateTag({
      property: 'og:title',
      content: 'Mohamed Khalil - Front-End Developer (Angular, TypeScript, CSS)',
    });
    this.meta.updateTag({
      property: 'og:description',
      content:
        'Hand-written CSS, responsive layouts and Angular apps, built to hold up on every screen.',
    });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }

  ngAfterViewInit(): void {
    const root = this.host.nativeElement as HTMLElement;
    this.glowEl = root.querySelector('.cursor-glow');

    // ── Cursor glow (desktop only, runs outside Angular) ──────────────
    if (window.matchMedia('(pointer: fine)').matches) {
      this.zone.runOutsideAngular(() => {
        window.addEventListener('mousemove', this.onMove, { passive: true });
      });
    }

    // ── Scroll-spy: highlight the section currently in view ───────────
    const sections = Array.from(
      root.querySelectorAll('section[id]'),
    ) as HTMLElement[];
    if ('IntersectionObserver' in window && sections.length) {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              this.zone.run(() => this.activeSection.set(entry.target.id));
            }
          }
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
      );
      sections.forEach((s) => this.observer!.observe(s));
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('mousemove', this.onMove);
    this.observer?.disconnect();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const visible = window.scrollY > 600;
    if (visible !== this.showScrollTop()) this.showScrollTop.set(visible);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
