export function formatPercentChange(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'No comparison data'
  }
  const sign = value > 0 ? '+' : ''
  return `${sign}${value}% vs last month`
}

export function formatNewToday(count: number | null | undefined): string {
  if (count === null || count === undefined) {
    return 'No daily breakdown'
  }
  return `+${count} new today`
}

export function formatRatingSubtitle(): string {
  return 'Based on recent reviews'
}
