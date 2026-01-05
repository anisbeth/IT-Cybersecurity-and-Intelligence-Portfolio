import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/blog'

export async function GET(){
  const posts = getAllPosts()
  const items = posts.map(p => `
    <item>
      <title>${p.title}</title>
      <link>https://example.com/blog/${p.slug}</link>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${p.summary ?? ''}</description>
    </item>`).join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0"><channel>
    <title>Arthur Nisbeth — Blog</title>
    <link>https://example.com</link>
    <description>IT & Cybersecurity Blog</description>
    ${items}
  </channel></rss>`
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
}
