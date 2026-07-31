"use client";

import { useState } from "react";
import Link from "next/link";
import { siteData } from "@/constants/home";

function ChevronIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 12 12" width="12">
      <path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
      <path d="m3 15 3.2-.8L15 5.4 12.6 3 3.8 11.8 3 15Z" stroke="currentColor" strokeLinejoin="round" />
      <path d="m10.9 4.7 2.4 2.4M6.2 14.2l-2.4-2.4" stroke="currentColor" />
    </svg>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header-wrap">
      <div className="site-header">
        <Link className="site-identity" href="/" aria-label={`${siteData.name}, home`}>
          <span className="brand-mark">{siteData.shortName}</span>
          <span className="brand-name">
            <strong>Bijaya Luintel</strong>
            <small>Writer & storyteller</small>
          </span>
        </Link>

        <nav aria-label="Primary navigation" className={menuOpen ? "primary-nav is-open" : "primary-nav"}>
          <ul className="nav-list">
            {siteData.nav.map((item) => (
              <li className={item.children ? "nav-item has-submenu" : "nav-item"} key={item.label}>
                <Link href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                  {item.children && <ChevronIcon />}
                </Link>
                {item.children && (
                  <div className="nav-dropdown">
                    <p>{item.label}</p>
                    <ul>
                      {item.children.map((child, index) => (
                        <li key={child.label}>
                          <Link href={child.href} onClick={() => setMenuOpen(false)}>
                            <span>0{index + 1}</span>
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <a className="mobile-contact" href={`mailto:${siteData.email}`}>Work with me</a>
        </nav>

        <a className="header-contact" href={`mailto:${siteData.email}`}>
          <PenIcon />
          Work with me
        </a>

        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          className={menuOpen ? "menu-toggle is-open" : "menu-toggle"}
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <span /><span />
        </button>
      </div>
    </header>
  );
}
