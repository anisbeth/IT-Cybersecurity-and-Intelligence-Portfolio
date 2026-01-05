import Container from '@/components/Container'
import certs from '@/data/certifications.json'

export default function CertificationsPage(){
  return (
    <Container>
      <section className="py-14">
        <h1 className="text-3xl font-semibold">Certifications</h1>
        <p className="text-muted-foreground mt-2">Badges, PDFs, and links to verify credentials.</p>
      </section>
      <ul className="grid md:grid-cols-2 gap-6">
        {certs.map((c, i) => (
          <li key={i} className="rounded-2xl border border-black/10 dark:border-white/10 p-5">
            <h3 className="font-semibold">{c.name}</h3>
            <p className="text-sm text-muted-foreground">{c.issuer} • {new Date(c.issued).toLocaleDateString()}</p>
            <div className="mt-3 flex gap-3">
              <a className="underline text-sm" href={c.credentialUrl} target="_blank" rel="noreferrer">Verify</a>
              {c.file && <a className="underline text-sm" href={`/${c.file}`} target="_blank" rel="noreferrer">View PDF</a>}
            </div>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground mt-6">Add your certificate PDFs to <code>/public</code> and update <code>/data/certifications.json</code>.</p>
    </Container>
  )
}
