## Project Structure

This project follows the standard Next.js application layout, separating
routing, UI components, server logic, and configuration into clearly
defined directories.

### **app/**

Holds all route segments and server components. Each folder inside
`app/` maps to a route in the application. Common subdirectories
include: - **layout.tsx** -- Root layout applied to all pages. -
**page.tsx** -- The entry point for a specific route. - **loading.tsx**
-- Optional route-level loading UI. - **error.tsx** -- Optional error
boundary for the route. - **api/** -- Route Handlers for server-side API
endpoints.

### **components/**

Reusable UI components used across the app. Each component is
self-contained with its own logic, styling, and accessibility
considerations.

### **lib/**

Utility functions, shared helpers, and server-side logic not tied to any
specific route.

### **hooks/**

Custom React hooks encapsulating reusable stateful logic.

### **styles/**

Global CSS files, utility styles, theme tokens, or Tailwind
configuration extensions.

### **public/**

Static assets served at the root of the domain.

### **types/**

Shared TypeScript interfaces and type definitions.

### **Project Root Files**

- **next.config.js** -- Next.js framework configuration.
- **tsconfig.json** -- TypeScript compiler options.
- **package.json** -- App dependencies, scripts, and metadata.
- **.env.local** -- Environment variables for local development.
