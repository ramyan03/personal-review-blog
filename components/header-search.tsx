"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchIcon } from "@/components/icons";

/**
 * Searching is just a query string. The archive page reads it and filters the
 * reviews it already has in memory, so there is nothing to query on the server.
 */
export default function HeaderSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState("");

  // Keep the box in step with the URL, including back and forward navigation.
  useEffect(() => {
    setValue(params.get("q") ?? "");
  }, [params]);

  function submit(next: string) {
    const query = new URLSearchParams(params.toString());
    if (next.trim()) query.set("q", next.trim());
    else query.delete("q");
    const qs = query.toString();
    router.push(qs ? `/reviews?${qs}` : "/reviews");
  }

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        submit(value);
      }}
      className="order-last w-full min-w-0 sm:order-none sm:w-auto sm:flex-1 sm:max-w-[300px]"
    >
      <label className="flex items-center gap-2 rounded-full border border-hairline bg-surface px-3.5 py-2 transition-colors focus-within:border-accent">
        <span className="flex-none text-fg-faint">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search reviews"
          aria-label="Search reviews"
          className="w-full min-w-0 bg-transparent text-sm text-fg placeholder:text-fg-faint focus:outline-none"
        />
      </label>
    </form>
  );
}
