import Container from '@/components/Container'
import { getPost } from '@/lib/blog'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'

export default function PostPage({ params }: { params: { slug: string } }){
  let post
  try { post = getPost(params.slug) } catch { return notFound() }

  return (
    <Container>
      <article className="py-10 prose prose-neutral dark:prose-invert max-w-none">
        <h1 className="mb-0">{post.meta.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{new Date(post.meta.date).toLocaleDateString()} • {post.meta.readingTime}</p>
        <MDXRemote source={post.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </article>
    </Container>
  )
}
