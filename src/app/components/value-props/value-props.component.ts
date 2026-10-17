import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ValueProp {
  title: string;
  description: string;
  /** gradient accent, e.g. '#f093fb, #f5576c' */
  color: string;
  /** inline SVG path data (24x24 viewBox, stroked) */
  iconPaths: string[];
}

@Component({
  selector: 'app-value-props',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './value-props.component.html',
  styleUrls: ['./value-props.component.scss'],
})
export class ValuePropsComponent {
  readonly props: ValueProp[] = [
    {
      title: 'CSS architecture that scales',
      description:
        'One set of design tokens (custom properties) drives colour, type and spacing, so a re-theme is a one-file change. Component-scoped styles and clear naming keep thousands of lines of CSS readable, with no framework doing the work for me.',
      color: '#5eead4, #2dd4bf',
      iconPaths: ['m16 18 6-6-6-6', 'm8 6-6 6 6 6'],
    },
    {
      title: 'Layouts that adapt, not just shrink',
      description:
        'Grid and Flexbox for real layouts, clamp() for fluid type and spacing instead of breakpoint jumps, and right-to-left Arabic pages that mirror correctly. I test every page from phone to wide desktop.',
      color: '#7dd3fc, #38bdf8',
      iconPaths: ['M3 3h7v7H3Z', 'M14 3h7v7h-7Z', 'M14 14h7v7h-7Z', 'M3 14h7v7H3Z'],
    },
    {
      title: 'Motion and effects without JavaScript',
      description:
        'Keyframe tickers, scroll-snap carousels, mask and clip-path shapes, frosted glass with backdrop-filter, and CSS-only animated charts. Smooth, light on the browser, and nothing breaks if a script fails.',
      color: '#a5b4fc, #818cf8',
      iconPaths: ['M13 2 3 14h9l-1 8 10-12h-9l1-8Z'],
    },
  ];

  gradient(color: string): Record<string, string> {
    return { '--accent': `linear-gradient(135deg, ${color})` };
  }
}
