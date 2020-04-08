## About

This repo is an example of how building your own server-state management solutions can quickly become complex and hard to maintain, while still not fulfilling on many expectations that we have for our server-state as React developers.

Each commit adds more functionality to manage this server-state until it becomes relatively complex for the benefits. Once that point is reached, all of the server-state logic is migrated to React Query which not only handles the same use cases, but give us a much better user experience.

## Running the examples

- Run `yarn` and then `yarn dev` locally.
- The Next.js API server is an in-memory local server, so the data is not actually persisted to disk. The posts that are stored or altered will be reset when the server restarts or when a file is saved and the server is recompiled.
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Commit Progression

- Basic Blog App + API
  - This is the initial commit with a base Next.js application.
  - It provides an API for CRUD-ind blog posts and its storage is in-memory, so it will be wiped clean every time a file is edited.
  - A basic client application is set up using local component state to fetch, display, and modify the posts on the backend.
- Reusable hooks + Total Post Count
  - All of the data fetching hooks are modularized so they can be use throughout the app and a total post count is added to the sidebar
  - Unfortunately, the query that powers the total post count does not update when we refetch the same query that powers the posts page
- Global Posts State + Delete
  - Posts are placed into a global store via a provider
  - The provider handles all of the fetching now and the hooks merely consume the context from that global state
- Dedupe Simultaneous Requests
  - Using global state, we can now dedupe requests to the same assets when we use their hooks more than once on the page. This is a useful skill when building server-state management patterns
- Post lookup ID
  - A post lookup by ID feature is added to the sidebar and will show a post for the given ID if it is found and also allow you to link to it.
  - Unfortunately, the title of the post that is found via the ID lookup does not update when we update the individual post.
- Global Post Detail State
  - The individual post context is also globalized into a provider and hooks to consume it. It contains an id-based cache of each individual post and the appropriate state for each one
  - At this point, we have accumulated a TON of code simply to manage this global server-state and we still do not have proper caching or invalidation set up, and we still have a lot of loading jank. Overall, the user experience hasn't really changed and we only have more code to worry about now.
- Migrate queries to React Query
  - By moving all of the queries to React Query, we not only get to remove a TON of code we were using to track our server-state, but we also get a ton of great stuff we didn't have before like caching, background refetching and loading states and automatic refetching of stale data
  - At this point, we are much better off, but it could be better! We still have to manually refetch our queries where they are used to get them to updated when we make a change on the server with a mutation
- Migrate mutations to React Query
  - With all of the mutations going through React Query now, we have a declarative and scalable API to manipulate our queries after our mutations run. Now we have a very very good chance that what the user is seeing on the screen is extremely up to date with what is on the server.
- Optimistic updates
  - By utilizing some more of `useMutation`'s options, we can now implement optimistic updates and rollbacks for mutations that will synchronously update our cache before the mutation is attempted with the expected result. If the mutation fails, the optimistic update will get rolled back. If it succeeds, a background refetch happens to make sure everything in the server is 100% synced up.
- Paginated Query Results
  - You can begin to use React Query's more advanced query hooks to do things like pagination, while still using all of the same great features of `useQuery`
- Infinite Query Results
  - Again, one more great solution to a normally complex pattern
- Hoverable Prefetching
  - Here we use the `queryCache`'s prefetching abilities to pre-load the detail views of our queries when we hover over them in the post list. The power is real!
