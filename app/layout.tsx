import './globals.css'
import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: "Arthur Nisbeth — IT & Cybersecurity",
  description: "Projects, blogs, videos, and certifications showcasing my IT and cybersecurity work.",
  metadataBase: new URL('https://example.com'),
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-black dark:bg-black dark:text-white antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
