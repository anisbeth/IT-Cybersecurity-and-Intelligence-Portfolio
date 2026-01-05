import Container from '@/components/Container'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

export default function Home(){
  const posts = getAllPosts().slice(0,3)
  return (
    <Container>
      <section className="py-16">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">IT & Cybersecurity Portfolio</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">Hands-on labs, blue-team projects, and write-ups. I publish short videos of my workflows and blog summaries of articles, papers, and docs I read.</p>
        <div className="mt-6 flex gap-3">
          <Link href="/videos" className="rounded-xl px-4 py-2 border border-black/10 dark:border-white/10">Watch Videos</Link>
          <Link href="/blog" className="rounded-xl px-4 py-2 border border-black/10 dark:border-white/10">Read the Blog</Link>
        </div>
      </section>

      <section className="py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Latest posts</h2>
          <Link href="/blog" className="text-sm underline">All posts</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map(p => (
            <article key={p.slug} className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
              <h3 className="font-semibold"><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
              <p className="text-xs text-muted-foreground mt-1">{new Date(p.date).toLocaleDateString()} • {p.readingTime}</p>
              <p className="text-sm mt-2 text-muted-foreground line-clamp-3">{p.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </Container>
  )
}
