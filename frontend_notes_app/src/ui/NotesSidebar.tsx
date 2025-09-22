import { $, component$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";

interface SidebarProps {
  sidebarOpen: { value: boolean };
  onNew$: PropFunction<() => void>;
  filter: string;
  onFilterChange$: PropFunction<(value: string) => void>;
  tags: string[];
  onTagsChange$: PropFunction<(tags: string[]) => void>;
}

/**
 * PUBLIC_INTERFACE
 * NotesSidebar renders app branding, quick actions, search and tag filters.
 */
export const NotesSidebar = component$<SidebarProps>((props) => {
  const onSubmitSearch$ = $((ev: Event) => {
    ev.preventDefault();
    // noop - immediate change is handled by input change
  });

  const toggleTag$ = $((tag: string) => {
    const set = new Set(props.tags);
    if (set.has(tag)) set.delete(tag);
    else set.add(tag);
    props.onTagsChange$([...set]);
  });

  const commonTags = ["work", "personal", "ideas", "todo", "archive"];

  return (
    <div class="sidebar__inner">
      <div class="sidebar__brand">
        <span style="font-size:1.2rem;">📝</span>
        <div>
          Ocean Notes
          <div style="font-size:.75rem; color:#6b7280;">Organize with ease</div>
        </div>
      </div>

      <div class="card" style="padding:.75rem;">
        <button class="button button--primary" style="width:100%;" onClick$={props.onNew$}>
          + New Note
        </button>
      </div>

      <div class="sidebar__section-title">Search</div>
      <div class="card" style="padding:.5rem;">
        <form preventdefault:submit onSubmit$={onSubmitSearch$}>
          <input
            class="input"
            type="search"
            placeholder="Search notes..."
            value={props.filter}
            onInput$={(e, el) => props.onFilterChange$(el.value)}
            aria-label="Search notes"
          />
        </form>
      </div>

      <div class="sidebar__section-title">Tags</div>
      <div class="card" style="padding:.5rem; display:flex; gap:.4rem; flex-wrap:wrap;">
        {commonTags.map((t) => {
          const active = props.tags.includes(t);
          return (
            <button
              key={t}
              type="button"
              class={`tag ${active ? "tag--blue" : ""}`}
              onClick$={() => toggleTag$(t)}
              aria-pressed={active}
              aria-label={`Toggle tag ${t}`}
            >
              #{t}
            </button>
          );
        })}
      </div>

      <div style="margin-top:1rem; font-size:.8rem; color:#6b7280;">
        <div>Theme: Ocean Professional</div>
        <div class="mono">Primary: #2563EB</div>
        <div class="mono">Secondary: #F59E0B</div>
      </div>
    </div>
  );
});
