import Container from '@/components/Container'
import VideoCard from '@/components/VideoCard'
import videos from '@/data/videos.json'

export default function VideosPage(){
  return (
    <Container>
      <section className="py-14">
        <h1 className="text-3xl font-semibold">Videos</h1>
        <p className="text-muted-foreground mt-2">Short demos of my workflows and walkthroughs.</p>
      </section>
      <div className="grid md:grid-cols-2 gap-6">
        {videos.map((v, i) => <VideoCard key={i} {...v} />)}
      </div>
    </Container>
  )
}
