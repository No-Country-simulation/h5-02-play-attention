This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Architecture

```
└── 📁src
    └── 📁app
        └── favicon.ico
        └── globals.css
        └── layout.js
        └── not-found.js
        └── page.js
    └── 📁features
        └── 📁audience-segmentation
        └── 📁contact
        └── 📁demo-videos
        └── 📁hero
        └── 📁pricing-plans
        └── 📁testimonials
    └── 📁lib
        └── utils.js
    └── 📁shared
        └── 📁components
        └── 📁providers
        └── 📁ui
```

## Color Pallete

### 🎨 Design Tokens - Custom Theme

This document describes the color and radius tokens used in your Tailwind + ShadCN-based theme. All colors are defined using OKLCH values and exposed as CSS variables.

#### 🌈 Colors

| Token                    | Sample                                                                                                               | OKLCH Value                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `--background`           | <span style="background:oklch(1 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>              | `oklch(1 0 0)`              |
| `--foreground`           | <span style="background:oklch(0.145 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>          | `oklch(0.145 0 0)`          |
| `--primary`              | <span style="background:oklch(0.45 0.22 290);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>      | `oklch(0.65 0.22 290.5)`    |
| `--primary-foreground`   | <span style="background:oklch(0.985 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>          | `oklch(0.985 0 0)`          |
| `--secondary`            | <span style="background:oklch(0.48 0.19 264.5);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>    | `oklch(0.48 0.19 264.5)`    |
| `--secondary-foreground` | <span style="background:oklch(0.985 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>          | `oklch(0.985 0 0)`          |
| `--destructive`          | <span style="background:oklch(0.577 0.245 27.325);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.577 0.245 27.325)` |
| `--border`               | <span style="background:oklch(0.922 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>          | `oklch(0.922 0 0)`          |
| `--accent`               | <span style="background:oklch(0.97 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>           | `oklch(0.97 0 0)`           |
| `--accent-foreground`    | <span style="background:oklch(0.205 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>          | `oklch(0.205 0 0)`          |
| `--muted`                | <span style="background:oklch(0.97 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>           | `oklch(0.97 0 0)`           |
| `--muted-foreground`     | <span style="background:oklch(0.556 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>          | `oklch(0.556 0 0)`          |
| `--ring`                 | <span style="background:oklch(0.708 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>          | `oklch(0.708 0 0)`          |
| `--input`                | <span style="background:oklch(0.922 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>          | `oklch(0.922 0 0)`          |

---

## 🌈 Primary Color Shades

| Token           | Sample                                                                                                          | OKLCH Value            |
| --------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `--primary-50`  | <span style="background:oklch(0.93 0.04 296);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.93 0.04 296)` |
| `--primary-100` | <span style="background:oklch(0.82 0.08 292);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.82 0.08 292)` |
| `--primary-200` | <span style="background:oklch(0.74 0.12 290);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.74 0.12 290)` |
| `--primary-300` | <span style="background:oklch(0.65 0.16 288);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.65 0.16 288)` |
| `--primary-400` | <span style="background:oklch(0.58 0.19 286);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.58 0.19 286)` |
| `--primary-500` | <span style="background:oklch(0.45 0.22 290);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.45 0.22 290)` |
| `--primary-600` | <span style="background:oklch(0.42 0.21 291);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.42 0.21 291)` |
| `--primary-700` | <span style="background:oklch(0.36 0.2 292);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>  | `oklch(0.36 0.2 292)`  |
| `--primary-800` | <span style="background:oklch(0.3 0.18 293);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>  | `oklch(0.3 0.18 293)`  |
| `--primary-900` | <span style="background:oklch(0.25 0.16 294);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.25 0.16 294)` |
