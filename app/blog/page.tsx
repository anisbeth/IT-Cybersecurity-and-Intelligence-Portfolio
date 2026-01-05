import Container from '@/components/Container'
import { getAllPosts } from '@/lib/blog'
import Link from 'next/link'
import Badge from '@/components/Badge'

export default function BlogPage(){
  const posts = getAllPosts()
  return (
    <Container>
      <section className="py-14">
        <h1 className="text-3xl font-semibold">Blog</h1>
        <p className="text-muted-foreground mt-2">Summaries, notes, and opinions on what I read.</p>
      </section>
      <div className="grid gap-6">
        {posts.map(p => (
          <article key={p.slug} className="rounded-2xl border border-black/10 dark:border-white/10 p-5">
            <h2 className="text-xl font-semibold"><Link href={`/blog/${p.slug}`}>{p.title}</Link></h2>
            <p className="text-xs text-muted-foreground mt-1">{new Date(p.date).toLocaleDateString()} • {p.readingTime}</p>
            <p className="text-sm mt-2 text-muted-foreground">{p.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">{p.tags?.map(t => <Badge key={t}>{t}</Badge>)}</div>
          </article>
        ))}
      </div>
    </Container>
  )
}
