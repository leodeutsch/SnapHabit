export function formatRelativeDate(dateISOString: string | undefined): string {
  if (!dateISOString) {
    return 'Add due date'
  }

  try {
    // Create Date objects for comparison
    const taskDateTime = new Date(dateISOString)

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Calculate difference in days
    const diffTime = taskDateTime.getTime() - today.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    // Format based on difference
    if (diffDays < 0) {
      return 'Overdue'
    } else if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Tomorrow'
    } else if (diffDays < 7) {
      return `In ${diffDays} days`
    } else {
      // For dates further away, use date format
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year:
          taskDateTime.getFullYear() !== today.getFullYear()
            ? 'numeric'
            : undefined,
      }
      return taskDateTime.toLocaleDateString(undefined, options)
    }
  } catch (error) {
    console.warn('Error formatting task date:', error)
    return 'Date error'
  }
}

export function formatISOToTime(isoString: string): string {
  if (!isoString) return ''

  const date = new Date(isoString)
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function parseRelativeDate(text: string): Date {
  const today = new Date()
  switch (text.toLowerCase()) {
    case 'today':
      return today
    case 'tomorrow':
      today.setDate(today.getDate() + 1)
      return today
    case 'next week':
      today.setDate(today.getDate() + 7)
      return today
    default:
      return today
  }
}

export function parseTime(text: string): Date | null {
  const match = text.match(/(\d{1,2})(:\d{2})?\s*(am|pm)?/i)
  if (match) {
    const hours = parseInt(match[1])
    const minutes = match[2] ? parseInt(match[2].slice(1)) : 0
    const period = match[3] ? match[3].toLowerCase() : null

    let adjustedHours = hours

    if (period === 'pm' && hours < 12) {
      adjustedHours += 12
    } else if (period === 'am' && hours === 12) {
      adjustedHours = 0
    }

    const date = new Date()
    date.setHours(adjustedHours, minutes, 0, 0)
    return date
  }
  return null
}
