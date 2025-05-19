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

# Design System Tokens (OKLCH)

## 🌈 Base Colors

# Color Palette Documentation

## 🌈 Primary Colors

| CSS Variable          | Sample | OKLCH Value |
|-----------------------|--------|-------------|
| `--primary` | <span style="background:oklch(0.28 0.142 296.71);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.28 0.142 296.71)` |
| `--primary-foreground` | <span style="background:oklch(0.985 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.985 0 0)` |
| `--primary-50` | <span style="background:oklch(0.93 0.02 287);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.93 0.02 287)` |
| `--primary-100` | <span style="background:oklch(0.78 0.0433 307.12);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.78 0.0433 307.12)` |
| `--primary-200` | <span style="background:oklch(0.68 0.0661 305.84);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.68 0.0661 305.84)` |
| `--primary-300` | <span style="background:oklch(0.52 0.1 304.7);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.52 0.1 304.7)` |
| `--primary-400` | <span style="background:oklch(0.42 0.1217 303.43);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.42 0.1217 303.43)` |
| `--primary-500` | <span style="background:oklch(0.28 0.142 296.71);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.28 0.142 296.71)` |
| `--primary-600` | <span style="background:oklch(0.26 0.1328 296.78);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.26 0.1328 296.78)` |
| `--primary-700` | <span style="background:oklch(0.23 0.1105 297.88);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.23 0.1105 297.88)` |
| `--primary-800` | <span style="background:oklch(0.19 0.092 299.25);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.19 0.092 299.25)` |
| `--primary-900` | <span style="background:oklch(0.17 0.0767 300.28);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.17 0.0767 300.28)` |

## 🌈 Secondary Colors

| CSS Variable            | Sample | OKLCH Value |
|-------------------------|--------|-------------|
| `--secondary` | <span style="background:oklch(0.79 0.0352 285.57);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.79 0.0352 285.57)` |
| `--secondary-foreground` | <span style="background:oklch(0.985 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.985 0 0)` |
| `--secondary-50` | <span style="background:oklch(0.98 0.0026 286.35);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.98 0.0026 286.35)` |
| `--secondary-100` | <span style="background:oklch(0.94 0.0107 286.19);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.94 0.0107 286.19)` |
| `--secondary-200` | <span style="background:oklch(0.9 0.0162 286.07);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.9 0.0162 286.07)` |
| `--secondary-300` | <span style="background:oklch(0.86 0.0234 285.9);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.86 0.0234 285.9)` |
| `--secondary-400` | <span style="background:oklch(0.83 0.0277 285.78);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.83 0.0277 285.78)` |
| `--secondary-500` | <span style="background:oklch(0.79 0.0352 285.57);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.79 0.0352 285.57)` |
| `--secondary-600` | <span style="background:oklch(0.74 0.0329 285.56);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.74 0.0329 285.56)` |
| `--secondary-700` | <span style="background:oklch(0.62 0.0254 285.63);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.62 0.0254 285.63)` |
| `--secondary-800` | <span style="background:oklch(0.51 0.022 285.6);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.51 0.022 285.6)` |
| `--secondary-900` | <span style="background:oklch(0.42 0.0181 285.6);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.42 0.0181 285.6)` |

## 🌈 Neutral Blacks

| CSS Variable              | Sample | OKLCH Value |
|---------------------------|--------|-------------|
| `--neutral-black-50` | <span style="background:oklch(0.93 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.93 0 0)` |
| `--neutral-black-100` | <span style="background:oklch(0.78 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.78 0 0)` |
| `--neutral-black-200` | <span style="background:oklch(0.66 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.66 0 0)` |
| `--neutral-black-300` | <span style="background:oklch(0.49 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.49 0 0)` |
| `--neutral-black-400` | <span style="background:oklch(0.38 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.38 0 0)` |
| `--neutral-black-500` | <span style="background:oklch(0.19 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.19 0 0)` |
| `--neutral-black-600` | <span style="background:oklch(0.18 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.18 0 0)` |
| `--neutral-black-700` | <span style="background:oklch(0.16 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.16 0 0)` |
| `--neutral-black-800` | <span style="background:oklch(0.14 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.14 0 0)` |
| `--neutral-black-900` | <span style="background:oklch(0.13 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.13 0 0)` |

## 🌈 Neutral Whites

| CSS Variable              | Sample | OKLCH Value |
|---------------------------|--------|-------------|
| `--neutral-white-50` | <span style="background:oklch(1 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(1 0 0)` |
| `--neutral-white-100` | <span style="background:oklch(0.99 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.99 0 0)` |
| `--neutral-white-200` | <span style="background:oklch(0.99 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.99 0 0)` |
| `--neutral-white-300` | <span style="background:oklch(0.98 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.98 0 0)` |
| `--neutral-white-400` | <span style="background:oklch(0.98 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.98 0 0)` |
| `--neutral-white-500` | <span style="background:oklch(0.97 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.97 0 0)` |
| `--neutral-white-600` | <span style="background:oklch(0.9 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.9 0 0)` |
| `--neutral-white-700` | <span style="background:oklch(0.75 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.75 0 0)` |
| `--neutral-white-800` | <span style="background:oklch(0.62 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.62 0 0)` |
| `--neutral-white-900` | <span style="background:oklch(0.51 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.51 0 0)` |

## 🌈 Hyperlink Colors

| CSS Variable            | Sample | OKLCH Value |
|-------------------------|--------|-------------|
| `--hyperlink-50` | <span style="background:oklch(0.95 0.0132 262.38);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.95 0.0132 262.38)` |
| `--hyperlink-100` | <span style="background:oklch(0.84 0.0451 264.3);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.84 0.0451 264.3)` |
| `--hyperlink-200` | <span style="background:oklch(0.77 0.068 264.05);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.77 0.068 264.05)` |
| `--hyperlink-300` | <span style="background:oklch(0.66 0.1037 264.25);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.66 0.1037 264.25)` |
| `--hyperlink-400` | <span style="background:oklch(0.59 0.126 263.2);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.59 0.126 263.2)` |
| `--hyperlink-500` | <span style="background:oklch(0.49 0.1604 262.48);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.49 0.1604 262.48)` |
| `--hyperlink-600` | <span style="background:oklch(0.46 0.1481 262.39);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.46 0.1481 262.39)` |
| `--hyperlink-700` | <span style="background:oklch(0.39 0.1209 262.66);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.39 0.1209 262.66)` |
| `--hyperlink-800` | <span style="background:oklch(0.33 0.0971 262.4);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.33 0.0971 262.4)` |
| `--hyperlink-900` | <span style="background:oklch(0.28 0.0782 262.48);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.28 0.0782 262.48)` |

## 🌈 Error Colors

| CSS Variable      | Sample | OKLCH Value |
|-------------------|--------|-------------|
| `--error-50` | <span style="background:oklch(0.95 0.0241 14.43);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.95 0.0241 14.43)` |
| `--error-100` | <span style="background:oklch(0.84 0.077 15.82);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.84 0.077 15.82)` |
| `--error-200` | <span style="background:oklch(0.76 0.1197 17.02);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.76 0.1197 17.02)` |
| `--error-300` | <span style="background:oklch(0.68 0.1764 20.23);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.68 0.1764 20.23)` |
| `--error-400` | <span style="background:oklch(0.63 0.207 23.05);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.63 0.207 23.05)` |
| `--error-500` | <span style="background:oklch(0.59 0.2351 27.38);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.59 0.2351 27.38)` |
| `--error-600` | <span style="background:oklch(0.55 0.2187 27.33);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.55 0.2187 27.33)` |
| `--error-700` | <span style="background:oklch(0.46 0.1803 26.83);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.46 0.1803 26.83)` |
| `--error-800` | <span style="background:oklch(0.38 0.1485 26.5);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.38 0.1485 26.5)` |
| `--error-900` | <span style="background:oklch(0.32 0.1211 26.09);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.32 0.1211 26.09)` |

## 🌈 Success Colors

| CSS Variable        | Sample | OKLCH Value |
|---------------------|--------|-------------|
| `--success-50` | <span style="background:oklch(0.96 0.0214 158.59);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.96 0.0214 158.59)` |
| `--success-100` | <span style="background:oklch(0.87 0.0687 157.12);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.87 0.0687 157.12)` |
| `--success-200` | <span style="background:oklch(0.81 0.102 155.66);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.81 0.102 155.66)` |
| `--success-300` | <span style="background:oklch(0.74 0.1433 153.58);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.74 0.1433 153.58)` |
| `--success-400` | <span style="background:oklch(0.69 0.1651 151.43);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.69 0.1651 151.43)` |
| `--success-500` | <span style="background:oklch(0.63 0.185972 147.3695);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.63 0.185972 147.3695)` |
| `--success-600` | <span style="background:oklch(0.59 0.1732 147.43);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.59 0.1732 147.43)` |
| `--success-700` | <span style="background:oklch(0.49 0.1432 147.89);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.49 0.1432 147.89)` |
| `--success-800` | <span style="background:oklch(0.41 0.117575 148.4695);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.41 0.117575 148.4695)` |
| `--success-900` | <span style="background:oklch(0.34 0.0968 149.13);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.34 0.0968 149.13)` |