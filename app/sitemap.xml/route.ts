import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/blog'

export async function GET(){
  const posts = getAllPosts()
  const urls = ['','/blog','/videos','/certifications','/about', ...posts.map(p=>`/blog/${p.slug}`)]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map(u=> `<url><loc>https://example.com${u}</loc></url>`).join('')}
  </urlset>`
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
}
