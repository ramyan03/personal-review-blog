import {
  InstagramIcon,
  LetterboxdIcon,
  MailIcon,
  MyAnimeListIcon,
} from "@/components/icons";
import { SOCIAL_LINKS, type SocialLink } from "@/lib/links";

const ICONS = {
  email: MailIcon,
  instagram: InstagramIcon,
  letterboxd: LetterboxdIcon,
  myanimelist: MyAnimeListIcon,
} as const;

export function SocialIcon({
  link,
  size,
}: {
  link: SocialLink;
  size?: number;
}) {
  const Icon = ICONS[link.key];
  return <Icon size={size} />;
}

/**
 * The four handles as icons only, for the hero and the footer. Each carries its
 * handle as the accessible name, so the row is not four unlabelled glyphs.
 */
export default function SocialLinks({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <ul className={`m-0 flex list-none items-center gap-7 p-0 ${className}`}>
      {SOCIAL_LINKS.map((link) => (
        <li key={link.key}>
          <a
            href={link.href}
            {...(link.key === "email"
              ? {}
              : { target: "_blank", rel: "me noreferrer" })}
            aria-label={`${link.label}: ${link.handle}`}
            title={`${link.label}: ${link.handle}`}
            className="block text-fg-faint transition-colors hover:text-accent"
          >
            <SocialIcon link={link} size={size} />
          </a>
        </li>
      ))}
    </ul>
  );
}
