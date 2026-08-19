'use client'

import {useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type {SiteSettings} from '@/sanity/lib/siteSettings'

function ChevronIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 12 12" width="12">
      <path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeLinecap="round" />
    </svg>
  )
}

function PenIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
      <path d="m3 15 3.2-.8L15 5.4 12.6 3 3.8 11.8 3 15Z" stroke="currentColor" strokeLinejoin="round" />
      <path d="m10.9 4.7 2.4 2.4M6.2 14.2l-2.4-2.4" stroke="currentColor" />
    </svg>
  )
}

export function SiteHeaderClient({settings}: {settings: SiteSettings}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header-wrap">
      <div className="site-header">
        <Link className="site-identity" href="/" aria-label={`${settings.siteName}, home`}>
          <Image
            alt={`${settings.siteName} logo`}
            className="site-navbar-logo"
            height={74}
            priority
            src="/navbar-logo-tight.png"
            width={74}
          />
        </Link>

        <nav aria-label="Primary navigation" className={menuOpen ? 'primary-nav is-open' : 'primary-nav'}>
          <ul className="nav-list">
            {settings.navigation.map((item) => (
              <li className={item.children?.length ? 'nav-item has-submenu' : 'nav-item'} key={`${item.label}-${item.href}`}>
                <Link href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                  {item.children?.length ? <ChevronIcon /> : null}
                </Link>
                {item.children?.length ? (
                  <div className="nav-dropdown">
                    <p>{item.label}</p>
                    <ul>
                      {item.children.map((child, index) => (
                        <li key={`${child.label}-${child.href}`}>
                          <Link href={child.href} onClick={() => setMenuOpen(false)}>
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
          <a className="mobile-contact" href={`mailto:${settings.email}`}>{settings.contactButtonLabel}</a>
        </nav>

        <a className="header-contact" href={`mailto:${settings.email}`}>
          <PenIcon />
          {settings.contactButtonLabel}
        </a>

        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className={menuOpen ? 'menu-toggle is-open' : 'menu-toggle'}
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <span /><span />
        </button>
      </div>
    </header>
  )
}
