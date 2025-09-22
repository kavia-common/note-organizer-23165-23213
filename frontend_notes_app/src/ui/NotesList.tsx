import { component$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import type { Note } from "~/routes/index";

/**
 * PUBLIC_INTERFACE
 * NotesList renders the list/grid of notes.
 */
export const NotesList = component$<{
  loading: boolean;
  notes: Note[];
  onSelect$: PropFunction<(id: string) => void>;
  onDelete$: PropFunction<(id: string) => void>;
}>((props) => {
  if (props.loading) {
    return (
      <div class="card" style="padding:1rem;">
        Loading notes...
      </div>
    );
  }

  if (!props.notes.length) {
    return (
      <div class="card" style="padding:1rem;">
        <div style="font-weight:600;margin-bottom:.25rem;">No notes yet</div>
        <div style="color:#6b7280;">Click the + button to create your first note.</div>
      </div>
    );
  }

  return (
    <div class="notes-grid">
      {props.notes.map((n) => (
        <article
          key={n.id}
          class="note-card"
          onClick$={() => props.onSelect$(n.id)}
          role="button"
          tabIndex={0}
          aria-label={`Open note ${n.title}`}
        >
          <h3 class="note-card__title">{n.title || "Untitled"}</h3>
          <div style="color:#4b5563; overflow:hidden; display:-webkit-box; -webkit-line-clamp:3; line-clamp:3; -webkit-box-orient: vertical;">
            {n.content || "No content"}
          </div>
          <div class="note-card__meta">
            <div style="display:flex; gap:.35rem; flex-wrap: wrap;">
              {n.tags?.slice(0, 3).map((t) => (
                <span key={t} class="tag tag--amber">#{t}</span>
              ))}
            </div>
            <div style="display:flex; align-items:center; gap:.5rem;">
              <time dateTime={n.updatedAt}>
                {new Date(n.updatedAt).toLocaleDateString()}
              </time>
              <button
                class="button button--ghost"
                onClick$={(e) => {
                  e.stopPropagation();
                  props.onDelete$(n.id);
                }}
                aria-label="Delete note"
                title="Delete note"
              >
                🗑
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
});
