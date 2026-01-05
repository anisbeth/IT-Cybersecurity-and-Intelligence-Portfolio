export default function Badge({children}:{children: React.ReactNode}){
  return <span className="inline-flex items-center rounded-full border border-black/10 dark:border-white/15 px-2 py-0.5 text-xs">{children}</span>
}
