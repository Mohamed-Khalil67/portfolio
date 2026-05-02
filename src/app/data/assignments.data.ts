import { Assignment } from '../models/assignment.model';

/**
 * ─────────────────────────────────────────────────────────────────
 *  HOW TO ADD A NEW ASSIGNMENT
 * ─────────────────────────────────────────────────────────────────
 *  1. Create a folder under:  src/assets/assignments/assignment-XX/
 *  2. Place your index.html (and any style.css / script.js) there.
 *     The HTML file should be self-contained (or link to relative files).
 *  3. Copy one of the objects below, update the fields, and paste it
 *     into the ASSIGNMENTS array.
 *
 *  Fields:
 *    id           → matches the folder name (e.g. 'assignment-03')
 *    title        → shown on the card
 *    description  → short sentence about what the assignment does
 *    week         → optional week number for display
 *    tags         → technology badges ['HTML', 'CSS', 'JS', ...]
 *    previewUrl   → path to the entry HTML file
 *    downloadFiles→ list of files users can download
 *    color        → gradient accent (two hex/rgb colors separated by comma)
 * ─────────────────────────────────────────────────────────────────
 */

export const ASSIGNMENTS: Assignment[] = [
  {
    id: 'assignment-01',
    title: 'CSS Flexbox Layout',
    description: 'A responsive page layout built entirely with CSS Flexbox — navigation bar, hero section, and a card grid.',
    week: 1,
    tags: ['HTML', 'CSS', 'Flexbox'],
    previewUrl: 'assets/assignments/assignment-01/index.html',
    downloadFiles: [
      { name: 'index.html', url: 'assets/assignments/assignment-01/index.html' },
      { name: 'style.css', url: 'assets/assignments/assignment-01/style.css' },
    ],
    color: '#f093fb, #f5576c',
  },
  {
    id: 'assignment-02',
    title: 'JavaScript Todo App',
    description: 'A fully interactive to-do list with add, complete, and delete functionality using vanilla JavaScript and DOM manipulation.',
    week: 2,
    tags: ['HTML', 'CSS', 'JavaScript'],
    previewUrl: 'assets/assignments/assignment-02/index.html',
    downloadFiles: [
      { name: 'index.html', url: 'assets/assignments/assignment-02/index.html' },
      { name: 'style.css', url: 'assets/assignments/assignment-02/style.css' },
      { name: 'script.js', url: 'assets/assignments/assignment-02/script.js' },
    ],
    color: '#4facfe, #00f2fe',
  },
  // ── Add your next assignment below this line ──────────────────
  // {
  //   id: 'assignment-03',
  //   title: 'My Next Assignment',
  //   description: 'What this assignment demonstrates.',
  //   week: 3,
  //   tags: ['HTML', 'CSS', 'JavaScript'],
  //   previewUrl: 'assets/assignments/assignment-03/index.html',
  //   downloadFiles: [
  //     { name: 'index.html', url: 'assets/assignments/assignment-03/index.html' },
  //   ],
  //   color: '#43e97b, #38f9d7',
  // },
];
