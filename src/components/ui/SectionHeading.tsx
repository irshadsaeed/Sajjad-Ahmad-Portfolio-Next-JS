import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3'
}

/**
 * Barlow Condensed section heading.
 */
export default function SectionHeading({
  children,
  className,
  as: Tag = 'h2',
}: SectionHeadingProps) {
  return (
    <Tag className={cn('section-heading', className)}>
      {children}
    </Tag>
  )
}