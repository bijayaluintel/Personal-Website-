import { getSiteSettings } from "@/sanity/lib/siteSettings";
import { ArrowIcon } from "./ArrowIcon";

export async function SiteFooter() {
  const settings = await getSiteSettings();

  return (
    <footer className="site-footer">
      <div className="section-shell footer-top">
        <div>
          <p className="footer-kicker">{settings.footerPrompt}</p>
          <a className="footer-email" href={`mailto:${settings.email}`}>{settings.email}<ArrowIcon /></a>
        </div>
        <div className="footer-links">
          <p>{settings.socialHeading}</p>
          <ul>{settings.socialLinks.map((link) => <li key={`${link.label}-${link.href}`}><a href={link.href}>{link.label}</a></li>)}</ul>
        </div>
      </div>
      <div className="section-shell footer-bottom">
        <a className="brand-mark brand-mark-light" href="#top">{settings.shortName}</a>
        <p>© {new Date().getFullYear()} {settings.copyrightName}</p><a href="#top">{settings.backToTopLabel}</a>
      </div>
    </footer>
  );
}
