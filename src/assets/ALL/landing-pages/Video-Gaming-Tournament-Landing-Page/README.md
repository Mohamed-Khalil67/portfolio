# GameArena

A gaming & esports landing page built with **Bootstrap 5** and custom CSS — duplicated from a Tailwind-based reference design.

![GameArena Preview](assets/images/preview.png)

## Live Demo

[View Live Site](#) <!-- replace # with your GitHub Pages URL -->

---

## Sections

| Section | Description |
|---|---|
| Navbar | Fixed top nav with Bootstrap ScrollSpy active-link highlighting |
| Hero | Full-screen background with stat badges |
| Games | Carousel with custom arrow controls |
| Services | 8-card grid with clip-path triangle hover effects |
| Partners | Infinite auto-scrolling logo strip |
| Team | Cards with grayscale-wipe hover reveal |
| Contact | Info boxes, community CTA, and contact form |
| Footer | Multi-column links with social icons |

## Tech Stack

- [Bootstrap 5](https://getbootstrap.com/) — grid, utilities, components
- [Font Awesome](https://fontawesome.com/) — icons
- [Bootstrap Icons](https://icons.getbootstrap.com/) — icons
- **Chakra Petch** & **Days One** — custom fonts loaded via `@font-face` (offline)
- Vanilla CSS — animations, clip-path effects, backdrop-filter, scrollspy styling

## Project Structure

```
intro_fullStack/
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── fonts/
│   │   ├── Chakra_Petch/
│   │   └── Days_One/
│   ├── images/
│   └── vendor/
│       ├── bootstrap/
│       ├── fontawesome/
│       └── bootstrap-icons/
```

## Running Locally

No build step required — open `index.html` directly in your browser, or use a local server:

```bash
# VS Code — install Live Server extension, then right-click index.html → "Open with Live Server"

# Or with Node
npx serve .
```

## Key CSS Techniques

- **Clip-path triangles** — `polygon()` corner accents that scale in on card hover
- **Grayscale wipe** — `backdrop-filter: grayscale(1)` + `clip-path: inset()` animation on team cards
- **Infinite scroll** — `@keyframes` translateX loop for the partners strip
- **ScrollSpy** — Bootstrap's `data-bs-spy` on `<body>` with active link color override
