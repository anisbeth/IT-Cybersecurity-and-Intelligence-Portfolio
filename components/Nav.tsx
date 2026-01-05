'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Moon, Sun, Menu } from 'lucide-react'

export default function Nav(){
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(()=>{
    const pref = localStorage.getItem('theme') || 'system'
    const isDark = pref === 'dark' || (pref==='system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  },[])

  function toggleTheme(){
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-black/50 border-b border-black/10 dark:border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">Arthur Nisbeth</Link>
        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/blog">Blog</Link>
          <Link href="/videos">Videos</Link>
          <Link href="/certifications">Certifications</Link>
          <Link href="/about">About</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button aria-label="Toggle theme" onClick={toggleTheme} className="p-2 rounded-xl border border-black/10 dark:border-white/10">
            {dark ? <Sun size={18}/> : <Moon size={18}/>}
          </button>
          <button className="md:hidden p-2" onClick={()=>setOpen(!open)} aria-label="Open menu"><Menu size={20}/></button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-black/10 dark:border-white/10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-3">
            <Link href="/blog" onClick={()=>setOpen(false)}>Blog</Link>
            <Link href="/videos" onClick={()=>setOpen(false)}>Videos</Link>
            <Link href="/certifications" onClick={()=>setOpen(false)}>Certifications</Link>
            <Link href="/about" onClick={()=>setOpen(false)}>About</Link>
          </div>
        </div>
      )}
    </header>
  )
}
