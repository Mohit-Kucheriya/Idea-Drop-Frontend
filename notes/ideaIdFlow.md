### Short summary (confirming your flow)

- When you navigate to `/ideas/123` the **route loader runs first**.

- The loader calls `queryClient.ensureQueryData(ideaQueryOptions("123"))`
  - If the query `["idea","123"]` is already in the React Query cache → `ensureQueryData` returns it immediately.

  - If not present → `ensureQueryData` fetches `/api/ideas/123`, stores the result in the cache, and returns it.

- After the loader resolves, the route renders `RouteComponent`.

- `RouteComponent` calls `useSuspenseQuery(ideaQueryOptions("123"))`. That hook **reads from the same cache** (same query key).
  - If the loader already cached the data, `useSuspenseQuery` gets it instantly (no blocking fetch).

  - If somehow the cache didn't have it, `useSuspenseQuery` would start the fetch and suspend until data arrives.

- For every subsequent navigation to the same route, the loader still **runs**, but `ensureQueryData` will usually return cached data (no refetch) unless cache policies/options force a fetch.

### Expanded, step-by-step (first time vs later)

**First visit to `/ideas/123`:**

1.  Router calls the loader.

2.  `ensureQueryData(["idea","123"])` → cache miss → runs `queryFn` → fetches `/api/ideas/123`.

3.  Data is stored in React Query's cache (under `["idea","123"]`). Loader resolves with that data.

4.  Component mounts and calls `useSuspenseQuery(["idea","123"])`. The hook finds the data in cache and returns it immediately (no duplicate blocking fetch). UI renders.

**Later visits (shortly after):**

1.  Loader runs again on navigation, but `ensureQueryData` sees cache hit and immediately returns the cached value (no network).

2.  Component's `useSuspenseQuery` reads the cache and shows data immediately.

**Visits after cache is removed or stale (or different id):**

- If cache entry was garbage-collected (past `cacheTime`) or never existed for that id, `ensureQueryData` will fetch again.

- If you navigate to a different id (`/ideas/124`) the same process repeats for the new key `["idea","124"]`.

### Important caveats (why you might still see extra fetches)

- **React Query default `staleTime` is 0** → data is considered _stale immediately_. That means on mount React Query may trigger a _background refetch_ depending on `refetchOnMount` (default behavior: refetch if stale). This is a background refetch (non-blocking) and not the same as the loader's initial fetch, but it is an extra request you may observe.
  - To avoid that background refetch, set `staleTime` to a positive value or set `refetchOnMount: false` in your `queryOptions`.

- If `queryFn` or `queryKey` differs between loader and component, they won't share the same cache and you can get duplicate fetches.

- If you server-render (SSR) or have concurrent navigations, timing can get more complex --- but on a normal SPA navigation the loader's fetch + `useSuspenseQuery` reading cache avoids blocking double fetches.

### What the loader returns vs what the component uses

- The loader **returns a Promise** that resolves to data (or the resolved query). You are _not_ directly passing that loader return into the component in your code --- instead you prefill the React Query cache.

- `useSuspenseQuery` then **reads from the cache** (not the loader's return value directly). They cooperate via the shared `queryClient`.

### About `queryClient` in `context`

- `queryClient` is the React Query instance that holds the cache and controls fetches/retries/staleness.

- You pass it into your router context so loaders and components can both access the _same_ cache. That's the glue that prevents duplicated, inconsistent requests.

### Practical tips

- Keep `queryOptions` identical in loader and component (same `queryKey` and `queryFn`): this ensures they share one source of truth.

- Use `ensureQueryData` in the loader when you want to prefetch and guarantee data in cache before render; use the hook in the component to read it reactively and take advantage of suspense/error boundaries.
