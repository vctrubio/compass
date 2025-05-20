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
