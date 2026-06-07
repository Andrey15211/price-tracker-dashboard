# Price Tracker Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, responsive price-monitoring dashboard with mutable mock APIs, history charts, alerts, validation, and provider adapters.

**Architecture:** Next.js route handlers expose a typed in-memory repository. TanStack Query consumes those routes, while an adapter-driven service performs simulated checks and appends history.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, TanStack Query, Recharts, React Hook Form, Zod

---

- [ ] Create framework configuration and global visual tokens.
- [ ] Define product/history types, schemas, deterministic seed data, and mock store.
- [ ] Implement source adapter, price service, and product/check-price route handlers.
- [ ] Build responsive app shell, KPI cards, products table, alerts, and loading/error/empty states.
- [ ] Build validated add-product modal and mutation synchronization.
- [ ] Build product detail metrics, period-filtered chart, history table, and manual refresh.
- [ ] Document local setup, architecture, safety constraints, and Vercel deployment.
- [ ] Run lint/build and inspect desktop/mobile rendering in CloakBrowser.
