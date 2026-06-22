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
      title: 'E-commerce that converts',
      description:
        'Stores built around the buyer journey - clear product pages, frictionless checkout, and persuasive copy that turns browsers into buyers.',
      color: '#5eead4, #2dd4bf',
      iconPaths: [
        'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z',
        'M3 6h18',
        'M16 10a4 4 0 0 1-8 0',
      ],
    },
    {
      title: 'Performance-first builds',
      description:
        'Fast-loading, SEO-ready sites that score high on Core Web Vitals. Speed keeps visitors engaged and lifts your search rankings and sales.',
      color: '#7dd3fc, #38bdf8',
      iconPaths: ['M13 2 3 14h9l-1 8 10-12h-9l1-8Z'],
    },
    {
      title: 'Built for growth',
      description:
        'Clean, maintainable code that scales with your business - easy to extend with new products, integrations, and marketing as you grow.',
      color: '#a5b4fc, #818cf8',
      iconPaths: [
        'M3 3v18h18',
        'm19 9-5 5-4-4-3 3',
      ],
    },
  ];

  gradient(color: string): Record<string, string> {
    return { '--accent': `linear-gradient(135deg, ${color})` };
  }
}
