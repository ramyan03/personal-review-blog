import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { reader } from "@/lib/reader";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const about = await reader.singletons.about.read();
  if (!about) notFound();

  const content = await about.content();

  return (
    <main className="mx-auto max-w-[680px] px-5 pt-8 pb-24 sm:px-6 lg:pt-12 lg:pb-[140px]">
      <h1 className="mb-10 font-serif text-xl leading-[1.15] font-medium tracking-[-0.01em] text-fg-bright lg:text-2xl">
        About
      </h1>
      <article className="review-body plain-body">
        <DocumentRenderer document={content} />
      </article>
    </main>
  );
}
