export default function Footer(){
  return (
    <footer className="mt-20 border-t border-black/10 dark:border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-10 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Arthur Nisbeth • Built with Next.js • <a className="underline" href="/rss.xml">RSS</a></p>
      </div>
    </footer>
  )
}
