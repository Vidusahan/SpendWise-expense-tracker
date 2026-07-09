# SpendWise — Database Design

Normalized PostgreSQL schema, managed through Prisma. Source of truth is
`backend/prisma/schema.prisma`; this doc explains the *why* behind it.

## Entity-Relationship Diagram

```
 users (1) ───< (M) categories (1) ───< (M) expenses >─── (M) 1 users
   │                    │
   │                    └───< (M) budgets >─── (M) 1 users
   │
   └───< (M) refresh_tokens
```

- One **user** has many categories, expenses, budgets, refresh tokens.
- One **category** has many expenses and many budgets (a category can have
  at most one budget per month/year, enforced by a composite unique index).
- An **expense** belongs to exactly one user and one category.

## Why these keys and constraints

| Decision | Reasoning |
|---|---|
| `id` = UUID, not auto-increment int | Avoids leaking row counts/growth rate through the API, and IDs are safe to generate client-side later if needed. |
| `Category.userId + name` unique | Categories are per-user (custom categories), so uniqueness must be scoped to the user, not global. |
| `Expense.categoryId` → `onDelete: Restrict` | Deleting a category that still has expenses attached should fail loudly, not silently cascade-delete financial history. |
| `Budget.userId + categoryId + month + year` unique | Makes "budget usage this month" a single indexed lookup instead of an ambiguous aggregate over duplicate rows. |
| `Expense.amount` / `Budget.amount` = `Decimal(12,2)` | Money must never use `Float` — binary floating point can't represent cents exactly, which silently corrupts totals over many transactions. |
| Composite indexes `[userId, date]`, `[userId, categoryId]`, `[userId, year, month]` | Every real query filters by `userId` first (row-level data isolation) and then narrows by date or category — indexes match the actual access pattern, not just individual columns. |
| `RefreshToken` modeled now, used in Phase 4 | Keeps the `User` relations complete in one migration instead of an awkward schema patch later. |

## Commands

```bash
cd backend
cp .env.example .env        # point DATABASE_URL at your Postgres instance
npx prisma migrate dev --name init
npx prisma db seed
npx prisma studio
```

## Definition of done
`npx prisma migrate dev` succeeds and `npx prisma studio` shows `users`,
`categories`, `expenses`, `budgets`, and `refresh_tokens` correctly related.
