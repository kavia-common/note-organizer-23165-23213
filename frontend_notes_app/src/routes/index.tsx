import { $, component$, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { NotesSidebar } from "~/ui/NotesSidebar";
import { NotesList } from "~/ui/NotesList";
import { NoteEditor } from "~/ui/NoteEditor";
import { NotesService } from "~/services/notes-service";

/**
 * NotesApp route: Shell layout with sidebar, notes list, editor and FAB.
 * Implements CRUD interactions against REST API (see NotesService).
 */
type ViewMode = "list" | "edit" | "create";

interface NotesState {
  loading: boolean;
  error: string | null;
  notes: Note[];
  selectedId: string | null;
  view: ViewMode;
  filter: string;
  tags: string[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string; // ISO string
}

// PUBLIC_INTERFACE
export default component$(() => {
  const state = useStore<NotesState>({
    loading: false,
    error: null,
    notes: [],
    selectedId: null,
    view: "list",
    filter: "",
    tags: [],
  });

  const sidebarOpen = useSignal(true);

  // Fetch notes on mount and when filter/tags change
  useTask$(async ({ track }) => {
    track(() => state.filter);
    track(() => state.tags.join(","));
    state.loading = true;
    state.error = null;
    try {
      state.notes = await NotesService.list(state.filter, state.tags);
    } catch (e: any) {
      state.error = e?.message ?? "Failed to load notes";
    } finally {
      state.loading = false;
    }
  });

  const handleCreate$ = $(async () => {
    state.view = "create";
    state.selectedId = null;
  });

  const handleSelect$ = $((id: string) => {
    state.selectedId = id;
    state.view = "edit";
  });

  const handleSave$ = $(async (note: Omit<Note, "id" | "updatedAt"> & Partial<Pick<Note, "id">>) => {
    try {
      if (note.id) {
        const updated = await NotesService.update(note.id, {
          title: note.title,
          content: note.content,
          tags: note.tags ?? [],
        });
        // optimistic update list
        const idx = state.notes.findIndex((n) => n.id === updated.id);
        if (idx >= 0) state.notes[idx] = updated;
        state.selectedId = updated.id;
        state.view = "edit";
      } else {
        const created = await NotesService.create({
          title: note.title,
          content: note.content,
          tags: note.tags ?? [],
        });
        state.notes.unshift(created);
        state.selectedId = created.id;
        state.view = "edit";
      }
    } catch (e: any) {
      state.error = e?.message ?? "Failed to save note";
    }
  });

  const handleDelete$ = $(async (id: string) => {
    try {
      await NotesService.remove(id);
      state.notes = state.notes.filter((n) => n.id !== id);
      if (state.selectedId === id) {
        state.selectedId = null;
        state.view = "list";
      }
    } catch (e: any) {
      state.error = e?.message ?? "Failed to delete note";
    }
  });

  const selectedNote = () => {
    const n = state.notes.find((x) => x.id === state.selectedId);
    return n ? n : null;
  };

  return (
    <div class="app-shell">
      <aside class="sidebar">
        <NotesSidebar
          sidebarOpen={sidebarOpen}
          onNew$={handleCreate$}
          filter={state.filter}
          onFilterChange$={$((v: string) => (state.filter = v))}
          tags={state.tags}
          onTagsChange$={$((tags: string[]) => (state.tags = tags))}
        />
      </aside>

      <main class="main">
        <header class="main__header">
          <h1 class="main__title">Notes</h1>
          <div class="header-actions">
            <button class="button button--ghost" onClick$={handleCreate$}>+ New</button>
          </div>
        </header>

        {state.error && (
          <div class="card" style="padding:.75rem; border-left:4px solid var(--color-error); margin-bottom: .75rem;">
            <strong style="color:var(--color-error)">Error:</strong> {state.error}
          </div>
        )}

        {state.view === "list" && (
          <NotesList
            loading={state.loading}
            notes={state.notes}
            onSelect$={handleSelect$}
            onDelete$={handleDelete$}
          />
        )}

        {state.view !== "list" && (
          <NoteEditor
            mode={state.view}
            note={state.view === "edit" ? selectedNote() : null}
            onCancel$={$(() => (state.view = "list"))}
            onSave$={handleSave$}
            onDelete$={$(() => state.selectedId && handleDelete$(state.selectedId))}
          />
        )}

        <button class="fab" aria-label="Add note" onClick$={handleCreate$} title="Add note">
          +
        </button>
      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Ocean Notes",
  meta: [
    {
      name: "description",
      content: "A modern notes app with Ocean Professional theme",
    },
  ],
};
