import { cn } from '@/lib/utils'

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

/**
 * Space Mono label for section identifiers.
 * Example: "// EXPERIENCE"
 */
export default function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span
      className={cn('section-label', className)}
      aria-hidden="true"
    >
      {children}
    </span>
  )
}