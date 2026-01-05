type Props = { title: string; platform: 'youtube'|'vimeo'; id: string; description?: string }
export default function VideoCard({title, platform, id, description}: Props){
  const src = platform === 'youtube' ? `https://www.youtube.com/embed/${id}` : `https://player.vimeo.com/video/${id}`
  return (
    <article className="rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden">
      <div className="aspect-video">
        <iframe className="w-full h-full" src={src} title={title} allowFullScreen/>
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
    </article>
  )
}
