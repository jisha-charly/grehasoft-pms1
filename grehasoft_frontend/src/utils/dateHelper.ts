import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

/**
 * Grehasoft Date Utility
 * Formats backend ISO strings for enterprise UI components.
 */

export const dateHelper = {
  // Standard Display: "Oct 12, 2023"
  formatDisplay: (dateStr: string | null | undefined): string => {
    if (!dateStr) return 'N/A';
    const date = parseISO(dateStr);
    return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Invalid Date';
  },

  // Detailed Display (Audit Logs): "Oct 12, 2023 14:30"
  formatDateTime: (dateStr: string | null | undefined): string => {
    if (!dateStr) return 'N/A';
    const date = parseISO(dateStr);
    return isValid(date) ? format(date, 'MMM dd, yyyy HH:mm') : 'Invalid Date';
  },

  // Relative Time (Activity Feed): "2 hours ago"
  formatRelative: (dateStr: string | null | undefined): string => {
    if (!dateStr) return 'N/A';
    const date = parseISO(dateStr);
    return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : 'Invalid Date';
  },

  // Form Input (YYYY-MM-DD)
  formatForInput: (dateStr: string | null | undefined): string => {
    if (!dateStr) return '';
    const date = parseISO(dateStr);
    return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
  },

  // Check if a task is overdue
  isOverdue: (dueDateStr: string | null | undefined): boolean => {
    if (!dueDateStr) return false;
    const date = parseISO(dueDateStr);
    return isValid(date) && date < new Date();
  }
};