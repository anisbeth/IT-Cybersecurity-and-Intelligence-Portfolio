# IT & Cybersecurity Portfolio (Next.js + Tailwind)

Modern, minimal portfolio with **Blog (MDX)**, **Videos (YouTube/Vimeo embeds)**, and **Certifications (badges/PDFs)**.

## Quick start
```bash
pnpm i   # or npm i / yarn
pnpm dev # http://localhost:3000
```

## Add a blog post
Create `content/blog/my-post.mdx` with frontmatter:
```md
---
title: "Post title"
date: "2025-11-08"
tags: ["tag1","tag2"]
summary: "One‑sentence summary."
---
Your MDX content here...
```

## Add videos
Edit `data/videos.json` with objects like:
```json
{ "title":"Splunk on Ubuntu", "platform":"youtube", "id":"<YouTubeID>", "description":"Guide" }
```

## Add certifications
- Put your PDF(s) in `/public` (e.g., `security-plus.pdf`)
- Edit `data/certifications.json` to include `name`, `issuer`, `issued`, `credentialUrl`, and `file`.

## Deploy
- **Vercel:** push to GitHub → “Import Project” on Vercel → set Framework "Next.js".
- **Netlify:** use Next.js build preset (`npm run build`).
- **GitHub Pages:** not recommended for SSR; use static export or a static site host.

## Customize
- Update site name in `components/Nav.tsx` and `app/layout.tsx` metadata.
- Replace example videos IDs and certificate links.
- Tweak styles in `app/globals.css` and Tailwind config.
