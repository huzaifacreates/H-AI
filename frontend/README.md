# Connecting Frontend to Backend — Guide

Below is a **step-by-step** explanation of what to change in `app/page.tsx` to wire the frontend to the FastAPI backend at `POST /chat`.

---

## Backend Recap (for reference)

| Endpoint | Method | Request Body | Response |
|----------|--------|-------------|----------|
| `/chat` | POST | `{ "message": "user text" }` | `{ "response": "ai reply" }` |

- The backend runs on `http://localhost:8000` (default FastAPI port).
- CORS is already wide-open (`allow_origin = ["*"]`), so no browser issues.

---

## Step 1 — Add a `loading` state to show the user something is happening

Right now you have two states: `text` (input value) and `submittedText` (last submitted text).

Add a third state to track whether the API call is in progress:

```ts
const [loading, setLoading] = useState(false);
```

This lets you disable the button / show a spinner while waiting for the AI.

---

## Step 2 — Replace `handleSubmit` with a real `fetch` call

Currently `handleSubmit` only saves text locally. Change it to send a POST request to the backend.

```ts
async function handleSubmit() {
  if (!text.trim()) return;          // don't send empty messages
  setLoading(true);                   // start loading
  try {
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json();
    setSubmittedText(data.response);  // store the AI reply
  } catch (err) {
    setSubmittedText("Error: Could not reach the server.");
    console.error(err);
  } finally {
    setLoading(false);                // stop loading
  }
  setText("");                        // clear input
}
```

**What's happening here:**
1. `fetch("http://localhost:8000/chat", ...)` — makes a POST request to your backend.
2. `headers: { "Content-Type": "application/json" }` — tells the server the body is JSON.
3. `body: JSON.stringify({ message: text })` — sends the user's message in the format the backend expects.
4. `res.json()` — parses the JSON response `{ "response": "..." }`.
5. `data.response` — extracts the AI reply and shows it.
6. `try/catch` — handles network errors gracefully (server down, etc.).

---

## Step 3 — Show the loading state in the UI

Disable the button while loading so the user doesn't double-submit:

```tsx
<button
  onClick={handleSubmit}
  disabled={loading}
  className="bg-gray-400 hover:bg-gray-300 py-2 px-2 ml-3 rounded-xl hover:transition hover:duration-300 disabled:opacity-50"
>
  {loading ? "Thinking..." : "Submit"}
</button>
```

- `disabled={loading}` prevents clicking while a request is in flight.
- `disabled:opacity-50` dims the button visually.
- Button text changes to "Thinking..." as a simple loading indicator.

---

## Step 4 — Display the conversation with chat bubbles (recommended)

Instead of just one line of `submittedText`, turn it into a **chat history** array so the user sees the full conversation.

Replace the state declarations with:

```ts
const [text, setText] = useState("");
const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([]);
const [loading, setLoading] = useState(false);
```

Update `handleSubmit`:

```ts
async function handleSubmit() {
  if (!text.trim()) return;
  const userMessage = text;
  setText("");
  setMessages((prev) => [...prev, { from: "user", text: userMessage }]);

  setLoading(true);
  try {
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });
    const data = await res.json();
    setMessages((prev) => [...prev, { from: "bot", text: data.response }]);
  } catch {
    setMessages((prev) => [...prev, { from: "bot", text: "Error: Could not reach the server." }]);
  } finally {
    setLoading(false);
  }
}
```

Replace the middle `<div>` with a scrollable chat area:

```tsx
<div className="flex-1 overflow-y-auto p-5 space-y-3">
  {messages.map((msg, i) => (
    <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
      <span className={`inline-block max-w-[70%] rounded-xl px-4 py-2 ${
        msg.from === "user"
          ? "bg-blue-500 text-white rounded-br-sm"
          : "bg-gray-300 text-black rounded-bl-sm"
      }`}>
        {msg.text}
      </span>
    </div>
  ))}
  {loading && (
    <div className="flex justify-start">
      <span className="inline-block bg-gray-300 rounded-xl px-4 py-2 italic">Typing...</span>
    </div>
  )}
</div>
```

---

## Step 5 — Update `layout.tsx` for full-height layout

Your chat area needs to fill the screen. Make sure `layout.tsx` body has `h-full` and the page section uses the remaining space:

In `layout.tsx`, change `<body>` to:
```tsx
<body className="min-h-dvh flex flex-col">{children}</body>
```

In `page.tsx`, change `<section className="h-full">` to:
```tsx
<section className="h-full flex flex-col">
```

This lets the chat area (`flex-1`) expand between the header and the input bar.

---

## Running Both Servers

| Terminal | Command |
|----------|---------|
| Backend  | `cd backend && uvicorn main:app --reload` |
| Frontend | `cd frontend && npm run dev` |

Make sure to start the backend **before** the frontend. The frontend runs on port 3000, backend on 8000.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `fetch` fails / network error | Backend not running — start `uvicorn` first |
| CORS error in browser | Already handled on backend (`allow_origin = ["*"]`) |
| Button does nothing | Check that `handleSubmit` is `async` and uses `await` |
| "Unexpected token < in JSON" | Backend returned HTML (404/500) — check terminal output |

---

## Summary of Changes (before → after)

| Aspect | Before | After |
|--------|--------|-------|
| States | `text`, `submittedText` | `text`, `messages[]`, `loading` |
| Submit | Just saves text locally | `fetch` POST to `/chat` |
| Display | Single `<p>` of submitted text | Scrollable chat bubbles |
| UI feedback | None | Loading indicator / disabled button |
