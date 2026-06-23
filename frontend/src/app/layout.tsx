import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { SiteFooter } from '@/shared/ui/site-footer';
import { SiteHeader } from '@/shared/ui/site-header';
import { CookieBanner } from '@/shared/ui/cookie-banner';
import { DynamicBackground } from '@/shared/ui/dynamic-background';
import { Providers } from '@/shared/lib/providers';
import './globals.css';
import { cn } from "@/lib/utils";

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700', '900'],
});

export const metadata: Metadata = {
  title: 'LumenBridge Finance Ltd',
  description:
    'Прозрачные краткосрочные займы для частных лиц и бизнеса в Европе.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={cn("h-full", "scroll-smooth", roboto.variable)}
    >
      <body className="min-h-full bg-[var(--color-background)] text-[var(--color-foreground)] antialiased">
        <Providers>
          <DynamicBackground />
          <div className="relative z-10 flex min-h-screen flex-col overflow-x-clip">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <CookieBanner />
          </div>
        </Providers>
      </body>
    </html>
  );
}
