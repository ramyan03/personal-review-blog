/**
 * The four places to reach Ramyan. One list, used by the landing hero, the
 * contact page and the footer, so a changed handle only has to be changed here.
 */
export type SocialLink = {
  key: "email" | "instagram" | "letterboxd" | "myanimelist";
  label: string;
  handle: string;
  href: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    key: "email",
    label: "Email",
    handle: "ramyanchelva@gmail.com",
    href: "mailto:ramyanchelva@gmail.com",
  },
  {
    key: "instagram",
    label: "Instagram",
    handle: "ramyan.reviews",
    href: "https://instagram.com/ramyan.reviews",
  },
  {
    key: "letterboxd",
    label: "Letterboxd",
    handle: "vforverstappen",
    href: "https://letterboxd.com/vforverstappen",
  },
  {
    key: "myanimelist",
    label: "MyAnimeList",
    handle: "rc3510",
    href: "https://myanimelist.net/profile/rc3510",
  },
];

/**
 * The review index lives at the foot of the landing page, not on a page of its
 * own. `/reviews` used to be a second copy of it, which read as a near
 * duplicate of the thing you had just scrolled through, so that route now
 * redirects here and this is the single address for the index.
 */
export const REVIEWS_HREF = "/#all-reviews";
export const REVIEWS_ANCHOR = "all-reviews";

/** `/#all-reviews`, with a genre or search term applied to it. */
export function reviewsHref(params?: { genre?: string; q?: string }): string {
  const query = new URLSearchParams();
  if (params?.genre) query.set("genre", params.genre.toLowerCase());
  if (params?.q?.trim()) query.set("q", params.q.trim());
  const qs = query.toString();
  return qs ? `/?${qs}#${REVIEWS_ANCHOR}` : REVIEWS_HREF;
}
