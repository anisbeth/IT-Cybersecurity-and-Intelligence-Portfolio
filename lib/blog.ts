import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const postsDir = path.join(process.cwd(), 'content', 'blog')

export type PostMeta = {
  slug: string
  title: string
  date: string
  tags?: string[]
  summary?: string
  readingTime: string
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'))
  return files.map(file => {
    const slug = file.replace(/\.mdx$/, '')
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8')
    const { data, content } = matter(raw)
    const rt = readingTime(content)
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? new Date().toISOString(),
      tags: data.tags ?? [],
      summary: data.summary ?? '',
      readingTime: rt.text,
    }
  }).sort((a,b) => +new Date(b.date) - +new Date(a.date))
}

export function getPost(slug: string) {
  const file = path.join(postsDir, slug + '.mdx')
  const raw = fs.readFileSync(file, 'utf-8')
  const { data, content } = matter(raw)
  return { meta: {
    slug,
    title: data.title ?? slug,
    date: data.date ?? new Date().toISOString(),
    tags: data.tags ?? [],
    summary: data.summary ?? '',
    readingTime: readingTime(content).text
  }, content }
}
