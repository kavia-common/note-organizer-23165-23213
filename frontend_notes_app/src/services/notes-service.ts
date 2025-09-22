import { isServer } from "@builder.io/qwik";

export interface NoteDTO {
  id?: string;
  title: string;
  content: string;
  tags: string[];
}
export interface Note extends NoteDTO {
  id: string;
  updatedAt: string;
}

/**
 * PUBLIC_INTERFACE
 * NotesService provides CRUD methods to interact with a REST API.
 * Endpoints expected:
 * - GET    /api/notes
 * - POST   /api/notes
 * - PUT    /api/notes/{id}
 * - DELETE /api/notes/{id}
 *
 * It anticipates optional filter and tags query params for listing.
 */
export const NotesService = {
  baseUrl(): string {
    // If a SITE_URL env is injected at build time, prefer it; otherwise relative.
    // Do not hardcode config; users should set VITE_API_BASE in .env (see .env.example).
    const envBase =
      (import.meta as any).env?.VITE_API_BASE?.toString() ||
      (isServer ? "" : "");
    return envBase;
  },

  // PUBLIC_INTERFACE
  async list(search: string = "", tags: string[] = []): Promise<Note[]> {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (tags.length) params.set("tags", tags.join(","));
    const url = `${this.baseUrl()}/api/notes?${params.toString()}`;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error(`List failed: ${res.status}`);
    return (await res.json()) as Note[];
  },

  // PUBLIC_INTERFACE
  async create(payload: NoteDTO): Promise<Note> {
    const url = `${this.baseUrl()}/api/notes`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Create failed: ${res.status}`);
    return (await res.json()) as Note;
  },

  // PUBLIC_INTERFACE
  async update(id: string, payload: NoteDTO): Promise<Note> {
    const url = `${this.baseUrl()}/api/notes/${encodeURIComponent(id)}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Update failed: ${res.status}`);
    return (await res.json()) as Note;
  },

  // PUBLIC_INTERFACE
  async remove(id: string): Promise<void> {
    const url = `${this.baseUrl()}/api/notes/${encodeURIComponent(id)}`;
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  },
};
