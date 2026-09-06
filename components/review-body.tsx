import {
  DocumentRenderer,
  type DocumentRendererProps,
} from "@keystatic/core/renderer";
import type { Dimensions } from "@/lib/artwork";

type Doc = DocumentRendererProps["document"];

/* Loose shape for walking the tree; Keystatic node types are a union. */
type WalkNode = { type?: string; src?: string; children?: readonly WalkNode[] };

/** The first image in the document, which is the one above the fold. */
function firstImageSrc(nodes: readonly WalkNode[]): string | null {
  for (const node of nodes) {
    if (node.type === "image" && typeof node.src === "string") return node.src;
    if (node.children) {
      const found = firstImageSrc(node.children);
      if (found) return found;
    }
  }
  return null;
}

/**
 * A review's text, with its artwork given a size.
 *
 * Keystatic hands images over as a src and an alt and nothing else, so the
 * browser reserved no height for them: the paragraph below sat where the
 * picture was going to be, then got shoved down when it decoded. That is the
 * abrupt pop. Sizes come from posters/manifest.json, which already records
 * them, and the topmost image is fetched eagerly rather than lazily, because it
 * is on screen immediately and deferring it is what makes it late.
 */
export default function ReviewBody({
  document,
  sizes,
}: {
  document: Doc;
  sizes: Map<string, Dimensions>;
}) {
  const lead = firstImageSrc(document as readonly WalkNode[]);

  return (
    <article className="review-body">
      <DocumentRenderer
        document={document}
        renderers={{
          block: {
            image({ src, alt }) {
              const size = sizes.get(src);
              const isLead = src === lead;

              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={alt}
                  width={size?.width}
                  height={size?.height}
                  loading={isLead ? "eager" : "lazy"}
                  fetchPriority={isLead ? "high" : undefined}
                  decoding="async"
                />
              );
            },
          },
        }}
      />
    </article>
  );
}
