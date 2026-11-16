import { getDaysDifference, getTodayStr } from './dateUtils';

/**
 * Calculate overdue days and fine amount
 * @param {string} dueDate - 'YYYY-MM-DD'
 * @param {string} [returnDate] - 'YYYY-MM-DD', defaults to today if null
 * @param {number} finePerDay - rate per day
 * @param {number} gracePeriodDays - buffer days before fine applies
 * @returns {object} calculation results
 */
export const calculateFine = (dueDate, returnDate = null, finePerDay = 1.0, gracePeriodDays = 0) => {
  const targetDate = returnDate || getTodayStr();
  const diffDays = getDaysDifference(dueDate, targetDate);

  if (diffDays <= 0) {
    return {
      isOverdue: false,
      overdueDays: 0,
      billableDays: 0,
      fineAmount: 0,
      statusLabel: 'On Time'
    };
  }

  const overdueDays = diffDays;
  const billableDays = Math.max(0, overdueDays - gracePeriodDays);
  const fineAmount = Number((billableDays * finePerDay).toFixed(2));

  return {
    isOverdue: true,
    overdueDays,
    billableDays,
    fineAmount,
    statusLabel: overdueDays <= gracePeriodDays ? 'Grace Period' : 'Overdue'
  };
};

