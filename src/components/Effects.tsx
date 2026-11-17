'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'

const ease = [0.76, 0, 0.24, 1] as const

/** Cinematic intro — plays once per visit, ~1.6s. */
function Preloader() {
  const [show, setShow] = useState(true)
  const [n, setN] = useState(0)

  useEffect(() => {
    if (sessionStorage.getItem('intro')) { setShow(false); return }
    let v = 0
    const id = setInterval(() => {
      v = Math.min(100, v + Math.ceil(Math.random() * 9))
      setN(v)
      if (v >= 100) {
        clearInterval(id)
        setTimeout(() => { setShow(false); try { sessionStorage.setItem('intro', '1') } catch {} }, 250)
      }
    }, 28)
    return () => clearInterval(id)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="loader"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease }}
          aria-hidden="true"
        >
          <div className="loader-name">
            <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.8, ease }}>
              Sajjad <em>Ahmad</em>
            </motion.span>
          </div>
          <div className="loader-bar"><i style={{ transform: `scaleX(${n / 100})` }} /></div>
          <div className="loader-n">{String(n).padStart(3, '0')}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Gold reading-progress line at the top. */
function Progress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />
}

/** Soft cursor light + magnetic buttons (desktop / mouse only). */
function Pointer() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const glow = document.querySelector<HTMLElement>('.cursor-glow')
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0

    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY
      const btn = (e.target as Element | null)?.closest?.<HTMLElement>('.btn, .copy, .burger')
      document.querySelectorAll<HTMLElement>('[data-mag]').forEach(b => {
        if (b !== btn) { b.style.transform = ''; b.removeAttribute('data-mag') }
      })
      if (btn) {
        const r = btn.getBoundingClientRect()
        btn.setAttribute('data-mag', '')
        btn.style.transform = `translate(${(x - r.left - r.width / 2) * 0.18}px, ${(y - r.top - r.height / 2) * 0.28}px)`
      }
    }
    const loop = () => {
      cx += (x - cx) * 0.12; cy += (y - cy) * 0.12
      if (glow) glow.style.transform = `translate(${cx}px, ${cy}px)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', move, { passive: true })
    raf = requestAnimationFrame(loop)
    document.documentElement.classList.add('has-pointer')
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [])
  return <div className="cursor-glow" aria-hidden="true" />
}

export default function Effects() {
  return (
    <>
      <Preloader />
      <Progress />
      <Pointer />
    </>
  )
}
