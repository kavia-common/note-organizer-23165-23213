import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

// PUBLIC_INTERFACE
export default component$(() => {
  return (
    <div class="page-container">
      <h1 class="main-title">frontend_notes_app is being generated</h1>
    </div>
  );
});

export const head: DocumentHead = {
  title: "frontend_notes_app",
  meta: [
    {
      name: "description",
      content: "Ultralight Qwik template",
    },
  ],
};
