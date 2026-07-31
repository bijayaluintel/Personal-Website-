import { siteData } from "@/constants/home";
import { ArrowIcon } from "./ArrowIcon";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-top">
        <div>
          <p className="footer-kicker">Have a thought to share?</p>
          <a className="footer-email" href={`mailto:${siteData.email}`}>{siteData.email}<ArrowIcon /></a>
        </div>
        <div className="footer-links">
          <p>Follow along</p>
          <ul>{siteData.socialLinks.map((link) => <li key={link.label}><a href={link.href}>{link.label}</a></li>)}</ul>
        </div>
      </div>
      <div className="section-shell footer-bottom">
        <a className="brand-mark brand-mark-light" href="#top">{siteData.shortName}</a>
        <p>© {new Date().getFullYear()} Bijaya Luintel</p><a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
