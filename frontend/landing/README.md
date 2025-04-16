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

# Color Palette Documentation (OKLCH)

This document visualizes the CSS variables defined in your `:root` using OKLCH color space.

## Core Colors

| Variable        | Color Preview                                                                                     | OKLCH Value                 | Approx. HEX |
| --------------- | ------------------------------------------------------------------------------------------------- | --------------------------- | ----------- |
| `--background`  | <div style="background-color: #FFFFFF; width: 50px; height: 20px; border: 1px solid #ddd;"></div> | `oklch(1 0 0)`              | `#FFFFFF`   |
| `--foreground`  | <div style="background-color: #252525; width: 50px; height: 20px; border: 1px solid #ddd;"></div> | `oklch(0.145 0 0)`          | `#252525`   |
| `--primary`     | <div style="background-color: #8365F7; width: 50px; height: 20px; border: 1px solid #ddd;"></div> | `oklch(0.65 0.22 290.5)`    | `#8365F7`   |
| `--secondary`   | <div style="background-color: #2B5ABA; width: 50px; height: 20px; border: 1px solid #ddd;"></div> | `oklch(0.48 0.19 264.5)`    | `#2B5ABA`   |
| `--destructive` | <div style="background-color: #E74C3C; width: 50px; height: 20px; border: 1px solid #ddd;"></div> | `oklch(0.577 0.245 27.325)` | `#E74C3C`   |

## UI States

| Variable             | Color Preview                                                                                     | OKLCH Value        |
| -------------------- | ------------------------------------------------------------------------------------------------- | ------------------ |
| `--muted`            | <div style="background-color: #F7F7F7; width: 50px; height: 20px; border: 1px solid #ddd;"></div> | `oklch(0.97 0 0)`  |
| `--muted-foreground` | <div style="background-color: #8E8E8E; width: 50px; height: 20px; border: 1px solid #ddd;"></div> | `oklch(0.556 0 0)` |
| `--border`           | <div style="background-color: #EBEBEB; width: 50px; height: 20px; border: 1px solid #ddd;"></div> | `oklch(0.922 0 0)` |

## Chart Colors

| Variable    | Color Preview                                                                                     | OKLCH Value                 |
| ----------- | ------------------------------------------------------------------------------------------------- | --------------------------- |
| `--chart-1` | <div style="background-color: #A78BFA; width: 50px; height: 20px; border: 1px solid #ddd;"></div> | `oklch(0.646 0.222 41.116)` |
| `--chart-2` | <div style="background-color: #60A5FA; width: 50px; height: 20px; border: 1px solid #ddd;"></div> | `oklch(0.6 0.118 184.704)`  |
| `--chart-3` | <div style="background-color: #5B7CF7; width: 50px; height: 20px; border: 1px solid #ddd;"></div> | `oklch(0.398 0.07 227.392)` |

## Sidebar Colors

| Variable            | Color Preview                                                                                     | OKLCH Value              |
| ------------------- | ------------------------------------------------------------------------------------------------- | ------------------------ |
| `--sidebar`         | <div style="background-color: #FFFFFF; width: 50px; height: 20px; border: 1px solid #ddd;"></div> | `oklch(0.985 0 0)`       |
| `--sidebar-primary` | <div style="background-color: #8365F7; width: 50px; height: 20px; border: 1px solid #ddd;"></div> | `oklch(0.65 0.22 290.5)` |

## Key Notes

- **OKLCH** is a perceptually uniform color space (better than HSL/HEX for visual consistency).
- **Primary**: Purple (`#8365F7`), **Secondary**: Blue (`#2B5ABA`).
- HEX values are approximations for quick reference.
