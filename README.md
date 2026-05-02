# 📚 Full Stack Course Portfolio

An Angular portfolio to showcase your course assignments with live previews and downloadable source code.

---

## 🚀 Getting Started

Open a terminal inside this folder and run:

```bash
# 1 — Install dependencies (only needed once)
npm install

# 2 — Start the development server (opens browser automatically)
npm start
```

The app runs at **http://localhost:4200**

---

## ✨ How to add assignments

### Option A — Through the app (easiest)
Click the **"New Assignment"** button on the portfolio page, paste your HTML / CSS / JS code into the form, and hit Save. The assignment is stored in your browser and appears immediately.

### Option B — As static files (for multi-file projects)

1. Create a folder: `src/assets/assignments/assignment-03/`
2. Drop your files in:
   ```
   assignment-03/
     index.html   ← required
     style.css    ← optional
     script.js    ← optional
   ```
3. Register it in `src/app/data/assignments.data.ts`:
   ```typescript
   {
     id: 'assignment-03',
     title: 'My Assignment Title',
     description: 'What this assignment demonstrates.',
     week: 3,
     tags: ['HTML', 'CSS', 'JavaScript'],
     previewUrl: 'assets/assignments/assignment-03/index.html',
     downloadFiles: [
       { name: 'index.html', url: 'assets/assignments/assignment-03/index.html' },
       { name: 'style.css',  url: 'assets/assignments/assignment-03/style.css'  },
       { name: 'script.js',  url: 'assets/assignments/assignment-03/script.js'  },
     ],
     color: '#43e97b, #38f9d7',
   },
   ```

---

## 📁 Project structure

```
portofolio/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── header/                 ← Hero header
│   │   │   ├── assignment-grid/        ← Card grid + "New Assignment" button
│   │   │   ├── assignment-card/        ← Card with preview thumbnail + download
│   │   │   └── create-assignment-modal/← New assignment form
│   │   ├── data/
│   │   │   └── assignments.data.ts     ← ✏️ Add static assignments here
│   │   ├── models/
│   │   │   └── assignment.model.ts
│   │   └── services/
│   │       └── assignment.service.ts   ← Manages static + localStorage assignments
│   └── assets/
│       └── assignments/                ← 📁 Drop your HTML/CSS/JS files here
├── dist/                               ← Production build output
├── angular.json
└── package.json
```

---

## 🎨 Gradient color options

Use any of these as the `color` field in `assignments.data.ts`:

| Name    | Value                    |
|---------|--------------------------|
| Pink    | `#f093fb, #f5576c`       |
| Blue    | `#4facfe, #00f2fe`       |
| Green   | `#43e97b, #38f9d7`       |
| Orange  | `#fa709a, #fee140`       |
| Purple  | `#a18cd1, #fbc2eb`       |
| Coral   | `#fd7043, #ff8a65`       |
| Sky     | `#a1c4fd, #c2e9fb`       |
| Gold    | `#f6d365, #fda085`       |
