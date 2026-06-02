/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { SiteNav } from '~/components/SiteNav'
import { SiteFooter } from '~/components/SiteFooter'
import appCss from '~/styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Gwendolyn & Noah · October 25, 2026' },
      {
        name: 'description',
        content:
          'Join us as we celebrate our wedding on October 25, 2026 at Beliveau Winery.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/images/leaf.png', type: 'image/png' },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-6 py-32 text-center">
      <p className="uppercase tracking-[0.3em] text-xs text-gold mb-4">404</p>
      <h1 className="font-script text-6xl text-burgundy">Page not found</h1>
      <p className="mt-6 text-ink/70">
        That link doesn't lead anywhere on our wedding site. Try one of these:
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link
          to="/"
          className="px-6 py-2 bg-burgundy text-cream uppercase tracking-widest text-xs rounded-full hover:bg-pumpkin transition-colors"
        >
          Home
        </Link>
        <Link
          to="/rsvp"
          className="px-6 py-2 border border-burgundy text-burgundy uppercase tracking-widest text-xs rounded-full hover:bg-burgundy hover:text-cream transition-colors"
        >
          RSVP
        </Link>
      </div>
    </section>
  )
}

function RootComponent() {
  return (
    <RootDocument>
      <SiteNav />
      <main className="min-h-[calc(100vh-12rem)]">
        <Outlet />
      </main>
      <SiteFooter />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* Inline SVG grain — reliable cross-browser paper texture */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 9998, opacity: 0.21, mixBlendMode: 'multiply' }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id="paper-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#paper-grain)" />
          </svg>
        </div>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
