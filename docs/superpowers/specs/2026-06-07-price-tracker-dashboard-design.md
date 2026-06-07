# Price Tracker Dashboard Design

## Product

A dark, compact monitoring dashboard that demonstrates price history, alert logic, route handlers, client synchronization, and an adapter boundary for future legitimate data providers.

## Architecture

- Next.js App Router hosts the application and JSON route handlers.
- TanStack Query owns client request, loading, error, and invalidation states.
- A development-only global mock store provides mutable products and histories.
- `SourceAdapter` isolates provider-specific price lookup behavior.
- `priceService` coordinates product lookup, adapter execution, status calculation, and history updates.
- Zod validates all write routes and the React Hook Form.

## Screens

- Dashboard: KPI strip, monitored-products table, alert feed, and add-product modal.
- Product detail: product metrics, period-filtered Recharts history, history table, and manual price check.
- Responsive shell: fixed desktop sidebar and compact mobile top navigation.

## Visual System

Deep navy-black background, slate panels, thin borders, compact technical typography, cyan chart data, emerald drops and target alerts, and red increases. Tables remain the primary data surface.

## Safety

The project does not scrape marketplaces or bypass anti-bot controls. The mock adapter can later be replaced with official APIs, feeds, or authorized integrations.
