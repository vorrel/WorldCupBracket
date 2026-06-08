import { TEAMS_BY_CODE } from '../data/teams'

type Size = 'sm' | 'md' | 'lg'

export function TeamBadge({
  code,
  fallback,
  size = 'md',
  className = '',
}: {
  code: string | null
  fallback?: string
  size?: Size
  className?: string
}) {
  const team = code ? TEAMS_BY_CODE[code] : undefined
  const flag = team?.flag ?? '⚪'
  const name = team?.name ?? fallback ?? 'TBD'

  const px =
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl'

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={px}>{flag}</span>
      <span className={`${size === 'sm' ? 'text-sm' : ''} font-medium truncate`}>
        {name}
      </span>
    </span>
  )
}
