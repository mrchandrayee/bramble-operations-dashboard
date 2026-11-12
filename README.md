# Bramble — Operations Dashboard

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://mrchandrayee.github.io/bramble-operations-dashboard/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

A React + TypeScript + Vite reconstruction of the uploaded 23.4-second screen recording.

## Video analysis

The recording shows a dark operations dashboard branded **BRAMBLE** with a header reading `TypeScript · Vite · GSAP`. It cycles through four main sections:

1. **Overview** — greeting for Mara, sales metrics, 30-day sales line chart, November goal ring, latest orders, low-stock summary and sales-source donut.
2. **Fulfillment** — four Kanban columns: To pack, Packing, Ready to ship, Shipped. Cards can be dragged between columns or advanced with the action button.
3. **Inventory** — stock metrics, category shelf/tube visualization, stock table and a restock modal with quantity controls.
4. **Orders** — order list and a right-side order detail drawer with payment, customer, items, totals, carrier and status action.

The bottom of the video also shows code panels labelled `charts.ts`, `fulfillment.ts` and `app.css`. The source text is too small to recover line-for-line, so the app behavior and visual design are reconstructed rather than presented as the creator's verbatim source.

## Features in this runnable reconstruction

- Responsive dark admin dashboard with optional light theme.
- Overview metrics, SVG sales chart, goal progress and recent orders.
- Fulfillment Kanban board with drag-and-drop and status progression.
- Inventory shelf visual, stock filters and restock modal.
- Orders table with search/status filters and detail drawer.
- Notifications popover, theme toggle, create placeholder and toast feedback.
- GSAP entrance transitions.
- Lucide icons and sample local data.
- No backend required; changes live in React state and reset on refresh.

## Run locally

Requirements: Node.js 18+

```bash
npm install
npm run dev
```

Open the local Vite URL, usually http://localhost:5173.

## Production build

```bash
npm run build
npm run preview
```

## Project structure

```text
bramble-operations-dashboard/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── src/
    ├── main.tsx
    ├── App.tsx
    └── styles.css
```

## Production integration notes

This is a front-end demo with sample data. To make it production-ready, connect orders, products, fulfillment events, customers, and inventory to your API/database; add authentication and role permissions; persist mutations server-side; and integrate real carrier labels/tracking and payment/refund workflows.
