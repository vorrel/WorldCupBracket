import { TEAMS_BY_CODE } from '../data/teams'

type Size = 'sm' | 'md' | 'lg'

export function TeamBadge({
  code,
  fallback,
  size = 'md',
  flagSide = 'left',
  className = '',
}: {
  code: string | null
  fallback?: string
  size?: Size
  /** Put the flag before or after the name. */
  flagSide?: 'left' | 'right'
  className?: string
}) {
  const team = code ? TEAMS_BY_CODE[code] : undefined
  const flag = team?.flag ?? '⚪'
  const name = team?.name ?? fallback ?? 'TBD'

  const px =
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl'

  const dir = flagSide === 'right' ? 'flex-row-reverse' : ''

  return (
    <span className={`flex items-center gap-2 min-w-0 ${dir} ${className}`}>
      <span className={`${px} shrink-0`}>{flag}</span>
      <span className={`${size === 'sm' ? 'text-sm' : ''} font-medium truncate min-w-0`}>
        {name}
      </span>
    </span>
  )
}
