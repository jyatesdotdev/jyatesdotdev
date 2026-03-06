## 2024-03-24 - Prisma Data Fetching Optimization
**Learning:** Database fetches can be optimized using Prisma's `_count` and relation filters to avoid loading all related records into memory and counting them in JavaScript.
**Action:** Use Prisma's `_count` and `take: 1` filtering when only counts and existence checks are needed.
