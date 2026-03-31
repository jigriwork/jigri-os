# JIGRI OS

**Tagline:** Billing, inventory, CRM, and control all in one

Production-grade SaaS starter for a Retail/Business Operating System built with modern full-stack Next.js.

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui style primitives
- Prisma + PostgreSQL-ready schema
- React Hook Form + Zod validations
- TanStack Table for data grids
- Recharts for analytics visualization
- PWA base (manifest + service worker + offline route)

## Implemented Phases

### Phase 1 — Project Setup
- Next.js app initialized in current folder
- pnpm-based dependency management
- Tailwind + component primitives + lint/prettier setup
- `.env.example` and local `.env` baseline created
- Scalable folders included:
  - `app`
  - `components`
  - `features`
  - `lib`
  - `hooks`
  - `prisma`
  - `types`
  - `config`

### Phase 2 — UI Foundation
- Premium SaaS landing page at `/`
- Responsive app shell (`AppShell`) with:
  - sidebar navigation
  - sticky top header
  - mobile toggle behavior
- Implemented routes:
  - `/app/dashboard`
  - `/app/billing`
  - `/app/products`
  - `/app/customers`
  - `/app/suppliers`
  - `/app/inventory`
  - `/app/reports`
  - `/app/settings`

### Phase 3 — Database Foundation
Prisma schema built for multi-tenant SaaS design:

- `Tenant`
- `Workspace`
- `Company`
- `Store`
- `User`
- `Role`
- `BusinessMode`
- `BusinessModeSettings`

And operational modules:

- `Category`, `Brand`, `Unit`
- `Product`, `ProductVariant`
- `Customer`, `Supplier`
- `Bill`, `BillItem`

Migration SQL committed:
- `prisma/migrations/202603311841_init/migration.sql`
- `prisma/migrations/migration_lock.toml`

Prisma client generation and schema sync validated with:
- `pnpm prisma generate`
- `pnpm prisma db push`

### Phase 4 — Settings System
Implemented settings UI + server action logic for:

- company setup
- store setup
- business mode selection (code-based, customizable)
- mode toggles:
  - customer mobile required
  - barcode enabled
  - loyalty enabled
  - due sales enabled
  - tax enabled
  - variants enabled

Files:
- `features/settings/settings-form.tsx`
- `app/actions.ts` (`saveSettingsAction`)

### Phase 5 — Master Data
Modules with list/create/search support:

- Products (`/app/products`)
  - category/brand/unit/product fields
  - variant capture (SKU/size/color)
- Customers (`/app/customers`)
  - mobile primary + name + email
- Suppliers (`/app/suppliers`)
  - basic supplier records

Common reusable table component:
- `components/shared/data-table.tsx`

### Phase 6 — Billing POS (Critical)
Implemented at `/app/billing`:

1. Product entry
   - search by name/SKU
   - add to bill
   - edit qty
   - remove item

2. Customer panel
   - mobile input
   - lookup existing customer
   - quick create/update on save

3. Bill summary
   - subtotal
   - discount
   - tax
   - total payable

4. Actions
   - new bill
   - clear bill
   - hold bill
   - save bill

5. Responsive UX
   - desktop multi-column speed layout
   - tablet/mobile touch-friendly cards

## PWA Baseline

- App manifest: `app/manifest.ts`
- SW registration: `components/shared/pwa-register.tsx`
- Service worker: `public/sw.js`
- Offline route: `app/offline/page.tsx`
- Icons:
  - `public/icon-192.png`
  - `public/icon-512.png`

## Architecture Notes

- Server actions are centralized in `app/actions.ts`
- Data access helpers in `lib/data/*`
- Validation in `lib/validations/*`
- UI modules are feature-scoped under `features/*`
- Multi-tenant-first schema enables scaling from single kirana store to enterprise multi-store operations

## Local Setup

1. Install dependencies

```bash
pnpm install
```

2. Configure env

```bash
copy .env.example .env
```

3. Start PostgreSQL (local/cloud) and set `DATABASE_URL` accordingly.

Optional local helper (Prisma Postgres dev server):

```bash
pnpm prisma dev -d --name jigri-os
```

4. Apply schema + generate client

```bash
pnpm prisma db push
pnpm prisma generate
```

5. Seed default workspace data

```bash
pnpm prisma db seed
```

6. Run app

```bash
pnpm dev
```

## Quality Checks Run

- `pnpm lint` ✅
- `pnpm build` ✅
- `pnpm prisma generate` ✅
- `pnpm prisma db push` ✅

### Note on Migration Command

In this environment, `prisma migrate dev` could not complete due to runtime connectivity behavior of the local Prisma dev proxy. As a production-ready fallback, the project includes a full migration SQL snapshot under:

- `prisma/migrations/202603311841_init/migration.sql`

and the database was successfully synchronized using:

- `pnpm prisma db push`

For teams using standard PostgreSQL (local Docker/managed DB), run:

```bash
pnpm prisma migrate dev --name init
```

## Current Project Structure (high-level)

```text
app/
  actions.ts
  app/
  manifest.ts
  offline/
components/
  layout/
  shared/
  ui/
config/
features/
  billing/
  customers/
  dashboard/
  products/
  settings/
  suppliers/
lib/
  data/
  validations/
prisma/
  migrations/
  schema.prisma
  seed.ts
public/
types/
```

## Next Recommended Steps

1. Add auth + RBAC enforcement middleware (workspace/store scoped).
2. Add transaction-safe stock deduction and inventory ledger on bill save.
3. Add GST/tax engine and invoice print/export.
4. Introduce API/webhook layer for integrations (payments, WhatsApp, accounting).
5. Add observability: request logging, audit events, and error tracking.
