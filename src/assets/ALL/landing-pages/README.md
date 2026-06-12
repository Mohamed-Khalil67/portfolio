# Landing Pages

Drop any landing-page project folder in here. The generator auto-tags
everything inside as the **Landing Pages** category (`route-assignments`).

Layout for each project:

```
landing-pages/
  MyProject/
    index.html      ← required
    style.css       ← optional
    meta.json       ← optional: { title, description, tags, color }
```

`meta.json` is optional — the generator falls back to title-cased folder
names and an HTML tag. Any `category` field inside meta.json is **ignored**
when the project lives in a category bucket (folder layout wins).
