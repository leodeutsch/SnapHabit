/**
 * Parse a date string, handling all-day events correctly
 * Avoids timezone issues when parsing YYYY-MM-DD strings
 */
export function parseScheduledDate(
  dateString: string,
  isAllDay?: boolean,
): Date {
  // Handle all-day dates (YYYY-MM-DD format)
  if ((isAllDay || !dateString.includes('T')) && dateString.length === 10) {
    return new Date(
      parseInt(dateString.slice(0, 4), 10),
      parseInt(dateString.slice(5, 7), 10) - 1,
      parseInt(dateString.slice(8, 10), 10),
    )
  }

  // Handle timed events (ISO strings)
  return new Date(dateString)
}

/**
 * Format a date as a YYYY-MM-DD string for all-day events
 */
export function formatDateYMD(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatRelativeDate(
  dateISOString: string | undefined,
  isAllDay?: boolean,
): string {
  if (!dateISOString) {
    return 'Add due date'
  }

  try {
    // Use the safe parsing function
    const taskDateTime = parseScheduledDate(dateISOString, isAllDay)

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // For date comparison, we want to compare dates without time
    const scheduledDay = new Date(
      taskDateTime.getFullYear(),
      taskDateTime.getMonth(),
      taskDateTime.getDate(),
    )

    // Calculate difference in days correctly
    const diffTime = scheduledDay.getTime() - today.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    // Format based on difference
    if (diffDays < 0) {
      return 'Overdue'
    } else if (diffDays === 0) {
      // For today with time, show the time
      if (!isAllDay && dateISOString.includes('T')) {
        return `Today at ${formatISOToTime(dateISOString)}`
      }
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
  const result = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )

  switch (text.toLowerCase()) {
    case 'today':
      return result
    case 'tomorrow':
      result.setDate(result.getDate() + 1)
      return result
    case 'next week':
      result.setDate(result.getDate() + 7)
      return result
    default:
      return result
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
