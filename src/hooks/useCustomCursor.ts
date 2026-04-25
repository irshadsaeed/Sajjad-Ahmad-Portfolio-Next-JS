'use client'

import { useEffect, useRef } from 'react'
import { lerp } from '@/lib/utils'

/**
 * Canvas-based custom cursor.
 * Dot (6px, immediate) + ring (28px, lerp follow, 0.12 factor).
 * Hidden on touch devices (pointer: coarse).
 */
export function useCustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const canvas = document.createElement('canvas')
    canvas.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      pointer-events: none;
      z-index: 9999;
      will-change: transform;
    `
    canvas.setAttribute('aria-hidden', 'true')
    document.body.appendChild(canvas)
    canvasRef.current = canvas

    const ctx = canvas.getContext('2d')!
    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let dotScale = 1
    let ringScale = 1
    let rafId: number

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', onMouseMove)

    const onMouseEnterHoverable = () => {
      dotScale = 0
      ringScale = 1.7
    }
    const onMouseLeaveHoverable = () => {
      dotScale = 1
      ringScale = 1
    }

    const hoverables = document.querySelectorAll<HTMLElement>(
      'a, button, [role="button"], .pill, .carousel-btn'
    )
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterHoverable)
      el.addEventListener('mouseleave', onMouseLeaveHoverable)
    })

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ringX = lerp(ringX, mouseX, 0.12)
      ringY = lerp(ringY, mouseY, 0.12)

      // Dot
      const dotR = 3 * dotScale
      ctx.beginPath()
      ctx.arc(mouseX, mouseY, dotR, 0, Math.PI * 2)
      ctx.fillStyle = '#00FF94'
      ctx.fill()

      // Ring
      const ringR = 14 * ringScale
      ctx.beginPath()
      ctx.arc(ringX, ringY, ringR, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(0, 255, 148, 0.6)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      rafId = requestAnimationFrame(draw)
    }
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      hoverables.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterHoverable)
        el.removeEventListener('mouseleave', onMouseLeaveHoverable)
      })
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
    }
  }, [])
}