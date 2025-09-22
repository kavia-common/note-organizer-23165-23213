# Ocean Notes (Qwik) ⚡️

A modern, minimalist notes app UI built with Qwik & QwikCity, styled with the Ocean Professional theme.

- Sidebar navigation
- Notes listing, create, edit, delete (CRUD via REST)
- Floating action button for quick add
- Responsive, accessible UI

## Theme

Ocean Professional
- Primary: #2563EB
- Secondary/Success: #F59E0B
- Error: #EF4444
- Background: #f9fafb
- Surface: #ffffff
- Text: #111827

Implemented with subtle shadows, rounded corners, and smooth transitions.

## Quick start

```bash
# Install
npm install

# Optional: set API base (if backend hosted on different origin)
cp .env.example .env
# then edit .env and set VITE_API_BASE=http://localhost:8000

# Dev
npm start

# Preview production
npm run preview

# Build
npm run build
```

## REST API

This app expects the following endpoints from the backend (SQLite-backed service):

- GET    /api/notes?q=<search>&tags=<comma,list>
- POST   /api/notes
- PUT    /api/notes/{id}
- DELETE /api/notes/{id}

Adjust VITE_API_BASE if your backend is on a separate origin.

## Structure

```
src/
  routes/
    index.tsx          # App shell with sidebar, list, editor, FAB
  services/
    notes-service.ts   # REST API integration
  ui/
    NotesSidebar.tsx   # Sidebar with search and tags
    NotesList.tsx      # Grid list of notes
    NoteEditor.tsx     # Create/Edit note form
```

## Accessibility

- Buttons and interactive cards have roles, labels, and focus handling where appropriate.
- Colors use accessible contrast for text and critical actions.

## License

MIT
