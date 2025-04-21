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

| CSS Variable                  | Sample                                                                                                               | OKLCH Value                 |
|-------------------------------|---------------------------------------------------------------------------------------------------------------------|----------------------------|
| `--background`                | <span style="background:oklch(1 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>             | `oklch(1 0 0)`             |
| `--foreground`                | <span style="background:oklch(0.145 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>         | `oklch(0.145 0 0)`         |
| `--card`                      | <span style="background:oklch(1 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>             | `oklch(1 0 0)`             |
| `--card-foreground`           | <span style="background:oklch(0.145 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>         | `oklch(0.145 0 0)`         |
| `--popover`                   | <span style="background:oklch(1 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>             | `oklch(1 0 0)`             |
| `--popover-foreground`        | <span style="background:oklch(0.145 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>         | `oklch(0.145 0 0)`         |
| `--muted`                     | <span style="background:oklch(0.97 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>          | `oklch(0.97 0 0)`          |
| `--muted-foreground`          | <span style="background:oklch(0.556 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>         | `oklch(0.556 0 0)`         |
| `--accent`                    | <span style="background:oklch(0.97 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>          | `oklch(0.97 0 0)`          |
| `--accent-foreground`         | <span style="background:oklch(0.205 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>         | `oklch(0.205 0 0)`         |
| `--destructive`               | <span style="background:oklch(0.577 0.245 27.325);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.577 0.245 27.325)`|
| `--border`                    | <span style="background:oklch(0.922 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>         | `oklch(0.922 0 0)`         |
| `--input`                     | <span style="background:oklch(0.922 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>         | `oklch(0.922 0 0)`         |
| `--ring`                      | <span style="background:oklch(0.708 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>         | `oklch(0.708 0 0)`         |

## 🌈 Primary Colors

| CSS Variable          | Sample                                                                                                          | OKLCH Value            |
|-----------------------|----------------------------------------------------------------------------------------------------------------|-----------------------|
| `--primary`           | <span style="background:oklch(0.45 0.22 290);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.45 0.22 290)`|
| `--primary-foreground`| <span style="background:oklch(0.985 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>    | `oklch(0.985 0 0)`   |
| `--primary-50`        | <span style="background:oklch(0.93 0.04 296);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.93 0.04 296)`|
| `--primary-100`       | <span style="background:oklch(0.82 0.08 292);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.82 0.08 292)`|
| `--primary-200`       | <span style="background:oklch(0.74 0.12 290);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.74 0.12 290)`|
| `--primary-300`       | <span style="background:oklch(0.65 0.16 288);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.65 0.16 288)`|
| `--primary-400`       | <span style="background:oklch(0.58 0.19 286);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.58 0.19 286)`|
| `--primary-500`       | <span style="background:oklch(0.45 0.22 290);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.45 0.22 290)`|
| `--primary-600`       | <span style="background:oklch(0.42 0.21 291);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.42 0.21 291)`|
| `--primary-700`       | <span style="background:oklch(0.36 0.2 292);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>  | `oklch(0.36 0.2 292)` |
| `--primary-800`       | <span style="background:oklch(0.3 0.18 293);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>  | `oklch(0.3 0.18 293)` |
| `--primary-900`       | <span style="background:oklch(0.25 0.16 294);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.25 0.16 294)`|

## 🌈 Secondary Colors (Updated)

| CSS Variable            | Sample                                                                                                          | OKLCH Value            |
|-------------------------|----------------------------------------------------------------------------------------------------------------|-----------------------|
| `--secondary`           | <span style="background:oklch(0.80 0.06 265);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.80 0.06 265)`|
| `--secondary-foreground`| <span style="background:oklch(0.985 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>    | `oklch(0.985 0 0)`   |
| `--secondary-50`        | <span style="background:oklch(0.97 0.01 265);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.97 0.01 265)`|
| `--secondary-100`       | <span style="background:oklch(0.94 0.02 265);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.94 0.02 265)`|
| `--secondary-200`       | <span style="background:oklch(0.91 0.03 265);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.91 0.03 265)`|
| `--secondary-300`       | <span style="background:oklch(0.87 0.04 265);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.87 0.04 265)`|
| `--secondary-400`       | <span style="background:oklch(0.84 0.05 265);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.84 0.05 265)`|
| `--secondary-500`       | <span style="background:oklch(0.80 0.06 265);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.80 0.06 265)`|
| `--secondary-600`       | <span style="background:oklch(0.75 0.06 265);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.75 0.06 265)`|
| `--secondary-700`       | <span style="background:oklch(0.65 0.05 265);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.65 0.05 265)`|
| `--secondary-800`       | <span style="background:oklch(0.55 0.04 265);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.55 0.04 265)`|
| `--secondary-900`       | <span style="background:oklch(0.45 0.03 265);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.45 0.03 265)`|

## 🌈 Neutral Blacks

| CSS Variable              | Sample                                                                                                          | OKLCH Value            |
|---------------------------|----------------------------------------------------------------------------------------------------------------|-----------------------|
| `--neutral-black-50`      | <span style="background:oklch(0.93 0.005 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.93 0.005 0)` |
| `--neutral-black-100`     | <span style="background:oklch(0.83 0.004 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.83 0.004 0)` |
| `--neutral-black-200`     | <span style="background:oklch(0.73 0.003 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.73 0.003 0)` |
| `--neutral-black-300`     | <span style="background:oklch(0.63 0.002 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.63 0.002 0)` |
| `--neutral-black-400`     | <span style="background:oklch(0.53 0.001 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.53 0.001 0)` |
| `--neutral-black-500`     | <span style="background:oklch(0.43 0.001 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.43 0.001 0)` |
| `--neutral-black-600`     | <span style="background:oklch(0.33 0.001 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.33 0.001 0)` |
| `--neutral-black-700`     | <span style="background:oklch(0.23 0.001 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.23 0.001 0)` |
| `--neutral-black-800`     | <span style="background:oklch(0.13 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>     | `oklch(0.13 0 0)`     |
| `--neutral-black-900`     | <span style="background:oklch(0.03 0 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>     | `oklch(0.03 0 0)`     |

## 🌈 Neutral Whites

| CSS Variable              | Sample                                                                                                          | OKLCH Value            |
|---------------------------|----------------------------------------------------------------------------------------------------------------|-----------------------|
| `--neutral-white-50`      | <span style="background:oklch(0.99 0.001 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.99 0.001 0)` |
| `--neutral-white-100`     | <span style="background:oklch(0.97 0.001 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.97 0.001 0)` |
| `--neutral-white-200`     | <span style="background:oklch(0.95 0.001 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.95 0.001 0)` |
| `--neutral-white-300`     | <span style="background:oklch(0.93 0.001 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.93 0.001 0)` |
| `--neutral-white-400`     | <span style="background:oklch(0.91 0.001 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.91 0.001 0)` |
| `--neutral-white-500`     | <span style="background:oklch(0.89 0.001 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.89 0.001 0)` |
| `--neutral-white-600`     | <span style="background:oklch(0.85 0.001 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.85 0.001 0)` |
| `--neutral-white-700`     | <span style="background:oklch(0.8 0.001 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>  | `oklch(0.8 0.001 0)`  |
| `--neutral-white-800`     | <span style="background:oklch(0.75 0.001 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>  | `oklch(0.75 0.001 0)` |
| `--neutral-white-900`     | <span style="background:oklch(0.7 0.001 0);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>  | `oklch(0.7 0.001 0)`  |


## 🌈 Hyperlink Colors

| CSS Variable            | Sample                                                                                                          | OKLCH Value            |
|-------------------------|----------------------------------------------------------------------------------------------------------------|-----------------------|
| `--hyperlink-50`        | <span style="background:oklch(0.92 0.05 250);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.92 0.05 250)`|
| `--hyperlink-100`       | <span style="background:oklch(0.87 0.07 250);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.87 0.07 250)`|
| `--hyperlink-200`       | <span style="background:oklch(0.82 0.09 250);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.82 0.09 250)`|
| `--hyperlink-300`       | <span style="background:oklch(0.77 0.11 250);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.77 0.11 250)`|
| `--hyperlink-400`       | <span style="background:oklch(0.72 0.13 250);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.72 0.13 250)`|
| `--hyperlink-500`       | <span style="background:oklch(0.67 0.15 250);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.67 0.15 250)`|
| `--hyperlink-600`       | <span style="background:oklch(0.62 0.17 250);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.62 0.17 250)`|
| `--hyperlink-700`       | <span style="background:oklch(0.57 0.19 250);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.57 0.19 250)`|
| `--hyperlink-800`       | <span style="background:oklch(0.52 0.21 250);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.52 0.21 250)`|
| `--hyperlink-900`       | <span style="background:oklch(0.47 0.23 250);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.47 0.23 250)`|

## 🌈 Error Colors

| CSS Variable      | Sample                                                                                                          | OKLCH Value            |
|-------------------|----------------------------------------------------------------------------------------------------------------|-----------------------|
| `--error-50`      | <span style="background:oklch(0.93 0.05 25);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.93 0.05 25)` |
| `--error-100`     | <span style="background:oklch(0.88 0.08 25);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.88 0.08 25)` |
| `--error-200`     | <span style="background:oklch(0.83 0.11 25);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.83 0.11 25)` |
| `--error-300`     | <span style="background:oklch(0.78 0.14 25);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.78 0.14 25)` |
| `--error-400`     | <span style="background:oklch(0.73 0.17 25);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.73 0.17 25)` |
| `--error-500`     | <span style="background:oklch(0.68 0.2 25);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>  | `oklch(0.68 0.2 25)`  |
| `--error-600`     | <span style="background:oklch(0.63 0.23 25);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.63 0.23 25)` |
| `--error-700`     | <span style="background:oklch(0.58 0.26 25);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.58 0.26 25)` |
| `--error-800`     | <span style="background:oklch(0.53 0.29 25);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.53 0.29 25)` |
| `--error-900`     | <span style="background:oklch(0.48 0.32 25);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.48 0.32 25)` |

## 🌈 Success Colors

| CSS Variable        | Sample                                                                                                          | OKLCH Value            |
|---------------------|----------------------------------------------------------------------------------------------------------------|-----------------------|
| `--success-50`      | <span style="background:oklch(0.93 0.05 145);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.93 0.05 145)`|
| `--success-100`     | <span style="background:oklch(0.88 0.08 145);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.88 0.08 145)`|
| `--success-200`     | <span style="background:oklch(0.83 0.11 145);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.83 0.11 145)`|
| `--success-300`     | <span style="background:oklch(0.78 0.14 145);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.78 0.14 145)`|
| `--success-400`     | <span style="background:oklch(0.73 0.17 145);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.73 0.17 145)`|
| `--success-500`     | <span style="background:oklch(0.68 0.2 145);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span>  | `oklch(0.68 0.2 145)` |
| `--success-600`     | <span style="background:oklch(0.63 0.23 145);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.63 0.23 145)`|
| `--success-700`     | <span style="background:oklch(0.58 0.26 145);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.58 0.26 145)`|
| `--success-800`     | <span style="background:oklch(0.53 0.29 145);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.53 0.29 145)`|
| `--success-900`     | <span style="background:oklch(0.48 0.32 145);padding:0.5em 1em;border-radius:4px;display:inline-block;"></span> | `oklch(0.48 0.32 145)`|
