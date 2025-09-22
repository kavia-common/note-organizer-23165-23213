import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import type { Note } from "~/routes/index";

interface NoteEditorProps {
  mode: "create" | "edit";
  note: Note | null;
  onCancel$: PropFunction<() => void>;
  onSave$: PropFunction<
    (note: { id?: string; title: string; content: string; tags: string[] }) => void
  >;
  onDelete$?: PropFunction<() => void>;
}

/**
 * PUBLIC_INTERFACE
 * NoteEditor handles form for creating or updating a note.
 */
export const NoteEditor = component$<NoteEditorProps>((props) => {
  const title = useSignal("");
  const content = useSignal("");
  const tags = useSignal<string>("");

  useTask$(({ track }) => {
    track(() => props.note?.id);
    if (props.mode === "edit" && props.note) {
      title.value = props.note.title || "";
      content.value = props.note.content || "";
      tags.value = props.note.tags?.join(", ") || "";
    } else {
      title.value = "";
      content.value = "";
      tags.value = "";
    }
  });

  const save$ = $(() => {
    const parsedTags = tags.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    props.onSave$({
      id: props.note?.id,
      title: title.value.trim() || "Untitled",
      content: content.value,
      tags: parsedTags,
    });
  });

  return (
    <div class="card editor">
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <h2 style="margin:.25rem 0;">
          {props.mode === "create" ? "Create Note" : "Edit Note"}
        </h2>
        <div class="editor__actions">
          {props.mode === "edit" && props.onDelete$ && (
            <button class="button button--danger" onClick$={props.onDelete$}>
              Delete
            </button>
          )}
          <button class="button" onClick$={props.onCancel$}>Cancel</button>
          <button class="button button--primary" onClick$={save$}>
            Save
          </button>
        </div>
      </div>

      <input
        class="input"
        placeholder="Note title"
        value={title.value}
        onInput$={(e, el) => (title.value = el.value)}
        aria-label="Note title"
      />
      <textarea
        class="textarea"
        placeholder="Write your note..."
        rows={10}
        value={content.value}
        onInput$={(e, el) => (content.value = el.value)}
        aria-label="Note content"
      />
      <input
        class="input"
        placeholder="Tags (comma separated)"
        value={tags.value}
        onInput$={(e, el) => (tags.value = el.value)}
        aria-label="Note tags"
      />
      <div style="color:#6b7280; font-size:.85rem;">
        Tip: Use commas to separate tags. Example: work, personal
      </div>
    </div>
  );
});
