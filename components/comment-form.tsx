"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate, type Comment } from "@/lib/format";

/**
 * Leaving a comment, without a backend behind it.
 *
 * A submitted comment is kept in the writer's own browser and shown back to
 * them, so the review does not look like it swallowed what they wrote. It is
 * labelled as theirs and as not yet published, because it genuinely is not:
 * published comments are typed into /keystatic and ship in the build. Showing
 * a local draft as though it were live would be a lie told to the one person
 * who cannot check.
 *
 * Storage is per browser and per review, and every access is guarded, since
 * localStorage throws outright rather than returning null in some privacy
 * modes.
 */

type Draft = Comment & { savedAt: number };

const key = (slug: string) => `rr.comments.${slug}`;

function load(slug: string): Draft[] {
  try {
    const raw = localStorage.getItem(key(slug));
    return raw ? (JSON.parse(raw) as Draft[]) : [];
  } catch {
    return [];
  }
}

function save(slug: string, drafts: Draft[]) {
  try {
    localStorage.setItem(key(slug), JSON.stringify(drafts));
  } catch {
    // Full or blocked. Losing a draft is not worth throwing over.
  }
}

export default function CommentForm({
  slug,
  onCount,
}: {
  slug: string;
  onCount?: (n: number) => void;
}) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const existing = load(slug);
    setDrafts(existing);
    setReady(true);
    onCount?.(existing.length);
    // onCount is a render prop from a server component parent and is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedText = text.trim();
    if (!trimmedName || !trimmedText) return;

    const next = [
      ...drafts,
      {
        name: trimmedName,
        text: trimmedText,
        date: new Date().toISOString().slice(0, 10),
        savedAt: Date.now(),
      },
    ];

    setDrafts(next);
    save(slug, next);
    onCount?.(next.length);
    setText("");
  }

  function remove(savedAt: number) {
    const next = drafts.filter((draft) => draft.savedAt !== savedAt);
    setDrafts(next);
    save(slug, next);
    onCount?.(next.length);
  }

  // Nothing until storage has been read, so the server and client first paint
  // agree and no draft flashes in after hydration.
  if (!ready) return null;

  return (
    <>
      {drafts.length > 0 ? (
        <ul className="m-0 mb-8 list-none p-0">
          {drafts.map((draft) => (
            <li
              key={draft.savedAt}
              className="border-b border-row py-6 first:pt-0 last:border-0"
            >
              <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-serif text-base font-medium text-fg-title">
                  {draft.name}
                </span>
                <span className="text-xs text-fg-faint">
                  {formatDate(draft.date)}
                </span>
                <span className="text-xs tracking-[0.12em] text-accent uppercase">
                  Yours, not published yet
                </span>
                <button
                  type="button"
                  onClick={() => remove(draft.savedAt)}
                  className="ml-auto text-xs text-fg-faint transition-colors hover:text-fg"
                >
                  Remove
                </button>
              </div>
              <p className="m-0 max-w-[62ch] font-serif text-base leading-[1.7] text-fg-body">
                {draft.text}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      <form onSubmit={submit} className="max-w-[62ch]">
        <label htmlFor={`name-${slug}`} className="sr-only">
          Your name
        </label>
        <input
          id={`name-${slug}`}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          className="w-full border-b border-rule bg-transparent py-2 text-base text-fg-bright outline-none transition-colors placeholder:text-fg-faint focus:border-accent"
        />

        <label htmlFor={`text-${slug}`} className="sr-only">
          Your comment
        </label>
        <textarea
          id={`text-${slug}`}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Add a comment"
          rows={3}
          className="mt-5 w-full resize-y border-b border-rule bg-transparent py-2 font-serif text-base leading-[1.7] text-fg-bright outline-none transition-colors placeholder:font-sans placeholder:text-fg-faint focus:border-accent"
        />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          {/*
            Deliberately does not promise publication. Nothing is sent
            anywhere: the comment is kept in this browser, and comments go up
            only when they are typed in by hand. Saying it would be published
            would be a promise the page cannot keep, so it points at contact
            instead, which is the route that actually reaches him.
          */}
          <p className="m-0 max-w-[50ch] text-xs leading-[1.6] text-fg-dim">
            Kept in your browser. Comments go up by hand, so{" "}
            <Link
              href="/contact"
              className="border-b border-hairline pb-px text-fg-muted transition-colors hover:border-accent hover:text-accent"
            >
              send it along
            </Link>{" "}
            if you would like it on the page.
          </p>
          <button
            type="submit"
            disabled={!name.trim() || !text.trim()}
            className="border-b-2 border-accent pb-1 text-xs font-semibold tracking-[0.14em] text-accent uppercase transition-colors hover:text-fg-bright disabled:border-rule disabled:text-fg-dim"
          >
            Post
          </button>
        </div>
      </form>
    </>
  );
}
