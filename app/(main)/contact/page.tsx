import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { SocialIcon } from "@/components/social-links";
import { reader } from "@/lib/reader";
import { SOCIAL_LINKS } from "@/lib/links";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const contact = await reader.singletons.contact.read();
  if (!contact) notFound();

  const content = await contact.content();

  return (
    <main className="mx-auto w-full max-w-[680px] px-5 pt-8 pb-24 sm:px-6 lg:pt-12">
      <h1 className="mb-8 font-serif text-xl leading-[1.15] font-medium tracking-[-0.01em] text-fg-bright lg:text-2xl">
        Contact
      </h1>

      <article className="review-body plain-body">
        <DocumentRenderer document={content} />
      </article>

      {/* The same four links as the hero and the footer, from one list. */}
      <ul className="m-0 mt-10 list-none border-t border-rule p-0">
        {SOCIAL_LINKS.map((link) => (
          <li key={link.key} className="border-b border-row">
            <a
              href={link.href}
              {...(link.key === "email"
                ? {}
                : { target: "_blank", rel: "me noreferrer" })}
              className="group flex items-center gap-4 py-5"
            >
              <span className="flex-none text-fg-muted transition-colors group-hover:text-accent">
                <SocialIcon link={link} size={20} />
              </span>
              <span className="flex-none text-xs font-semibold tracking-[0.12em] text-fg-muted uppercase">
                {link.label}
              </span>
              <span className="ml-auto truncate font-serif text-lg text-fg-title transition-colors group-hover:text-accent">
                {link.handle}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
