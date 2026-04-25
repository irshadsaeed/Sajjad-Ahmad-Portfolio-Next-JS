'use client'

import React, { useRef, useEffect, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface RevealWrapperProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  delay?: number
  variant?: 'fadeUp' | 'fadeIn' | 'scaleReveal' | 'slideInLeft' | 'springPop'
  once?: boolean
}

const variants = {
  fadeUp: {
    hidden:  { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as number[] } },
  },
  fadeIn: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  },
  scaleReveal: {
    hidden:  { scale: 0.93, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as number[] } },
  },
  slideInLeft: {
    hidden:  { x: -36, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as number[] } },
  },
  springPop: {
    hidden:  { scale: 0.85, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as number[] } },
  },
}

const reducedVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
}

export default function RevealWrapper({
  children,
  className,
  style,
  delay = 0,
  variant = 'fadeUp',
  once = true,
}: RevealWrapperProps) {
  const prefersReducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  const selectedVariants = prefersReducedMotion ? reducedVariants : variants[variant]

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={selectedVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
