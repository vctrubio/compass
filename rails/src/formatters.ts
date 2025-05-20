/**
 * Utility functions for formatting different data types in user-friendly ways
 */

/**
 * Formats a date to the format "day-month : HH:MM" (e.g., "20-May : 14:30")
 * 
 * @param {Date | string | number | null | undefined} date - The date to format
 * @param {string} defaultValue - Value to return if date is invalid or null (defaults to '-')
 * @returns {string} The formatted date string
 */
export function formatDate(date: Date | string | number | null | undefined, defaultValue: string = '-'): string {
  if (!date) return defaultValue;
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return defaultValue;
    }
    
    // Get day as number (1-31)
    const day = dateObj.getDate();
    
    // Get month as short name (Jan, Feb, etc.)
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    
    // Get hours and minutes with leading zeros if needed
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    
    // Format as "day-month : HH:MM" (e.g., "20-May : 14:30")
    return `${day}-${month} : ${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return defaultValue;
  }
}

/**
 * Formats a date for form inputs (YYYY-MM-DD)
 * 
 * @param {Date | string | number | null | undefined} date - The date to format
 * @returns {string} The formatted date string for form inputs
 */
export function formatDateForInput(date: Date | string | number | null | undefined): string {
  if (!date) return '';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    // Format as YYYY-MM-DD for input type="date"
    return dateObj.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
}

/**
 * Formats a price/currency value
 * 
 * @param {number|string|null|undefined} amount - The amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @param {string} defaultValue - Value to display if amount is invalid
 * @returns {string} Formatted currency string
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  currency: string = 'USD',
  locale: string = 'en-US',
  defaultValue: string = '-'
): string {
  if (amount === null || amount === undefined) return defaultValue;
  
  try {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numericAmount)) return defaultValue;
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(numericAmount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return defaultValue;
  }
}

/**
 * Formats a duration in minutes to a human-readable format
 * 
 * @param {number|string|null|undefined} minutes - Duration in minutes
 * @param {boolean} verbose - Whether to use verbose format (default: false)
 * @param {string} defaultValue - Value to display if duration is invalid
 * @returns {string} Formatted duration string
 */
export function formatDuration(
  minutes: number | string | null | undefined,
  verbose: boolean = false,
  defaultValue: string = '-'
): string {
  if (minutes === null || minutes === undefined) return defaultValue;
  
  try {
    const mins = typeof minutes === 'string' ? parseInt(minutes) : minutes;
    
    if (isNaN(mins)) return defaultValue;
    
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    
    if (verbose) {
      // Verbose format: "2 hours 30 minutes" or "30 minutes"
      if (hours === 0) {
        return `${remainingMins} minute${remainingMins !== 1 ? 's' : ''}`;
      } else if (remainingMins === 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
      } else {
        return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMins} minute${remainingMins !== 1 ? 's' : ''}`;
      }
    } else {
      // Compact format: "2h 30m" or "30m"
      if (hours === 0) {
        return `${remainingMins}m`;
      } else if (remainingMins === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h ${remainingMins}m`;
      }
    }
  } catch (error) {
    console.error('Error formatting duration:', error);
    return defaultValue;
  }
}

/**
 * Formats a status value with consistent styling classes
 * 
 * @param {string} status - The status to format
 * @param {Object} statusMap - Map of status values to display text and classes
 * @param {string} defaultValue - Value to display if status is not found
 * @returns {Object} Object with text and className properties
 */
export function formatStatus(
  status: string | null | undefined,
  statusMap: Record<string, { text: string, className: string }>,
  defaultValue: { text: string, className: string } = { text: 'Unknown', className: 'text-gray-400' }
): { text: string, className: string } {
  if (!status || !statusMap[status]) {
    return defaultValue;
  }
  
  return statusMap[status];
}

/**
 * Common status maps for reuse
 */
export const BOOKING_STATUS_MAP = {
  'pending': { text: 'Pending', className: 'text-yellow-500 font-medium' },
  'confirmed': { text: 'Confirmed', className: 'text-green-500 font-medium' },
  'cancelled': { text: 'Cancelled', className: 'text-red-500 font-medium' },
  'completed': { text: 'Completed', className: 'text-blue-500 font-medium' }
};

export const PAYMENT_STATUS_MAP = {
  'unpaid': { text: 'Unpaid', className: 'text-yellow-500 font-medium' },
  'partial': { text: 'Partial', className: 'text-blue-500 font-medium' },
  'paid': { text: 'Paid', className: 'text-green-500 font-medium' },
  'refunded': { text: 'Refunded', className: 'text-purple-500 font-medium' }
};

export const LESSON_STATUS_MAP = {
  'created': { text: 'Created', className: 'text-yellow-500 font-medium' },
  'confirmed': { text: 'Confirmed', className: 'text-blue-500 font-medium' },
  'cancelled': { text: 'Cancelled', className: 'text-red-500 font-medium' },
  'completed': { text: 'Completed', className: 'text-green-500 font-medium' }
};
