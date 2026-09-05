import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { reader } from "@/lib/reader";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const contact = await reader.singletons.contact.read();
  if (!contact) notFound();

  const content = await contact.content();
  const links = contact.links ?? [];

  return (
    <main className="mx-auto w-full max-w-[680px] px-5 pt-8 pb-24 sm:px-6 lg:pt-12">
      <h1 className="mb-8 font-serif text-xl leading-[1.15] font-medium tracking-[-0.01em] text-fg-bright lg:text-2xl">
        Contact
      </h1>

      <article className="review-body plain-body">
        <DocumentRenderer document={content} />
      </article>

      <ul className="mt-10 m-0 list-none border-t border-rule p-0">
        {contact.email ? (
          <ContactRow
            label="Email"
            value={contact.email}
            href={`mailto:${contact.email}`}
          />
        ) : null}
        {links.map((link) => (
          <ContactRow
            key={link.url}
            label={link.label}
            value={link.handle || link.url}
            href={link.url}
            external
          />
        ))}
      </ul>
    </main>
  );
}

function ContactRow({
  label,
  value,
  href,
  external = false,
}: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <li className="border-b border-row">
      <a
        href={href}
        {...(external
          ? { target: "_blank", rel: "me noreferrer" }
          : {})}
        className="group flex items-baseline justify-between gap-5 py-5"
      >
        <span className="flex-none text-xs font-semibold tracking-[0.12em] text-fg-muted uppercase">
          {label}
        </span>
        <span className="truncate font-serif text-lg text-fg-title transition-colors group-hover:text-accent">
          {value}
        </span>
      </a>
    </li>
  );
}
