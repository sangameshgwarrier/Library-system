export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr + (dateStr.length === 10 ? 'T00:00:00' : ''));
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const getTodayStr = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export const addDays = (dateStr, days) => {
  const d = new Date(dateStr + (dateStr.length === 10 ? 'T00:00:00' : ''));
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const getDaysDifference = (fromStr, toStr) => {
  if (!fromStr || !toStr) return 0;
  const from = new Date(fromStr + (fromStr.length === 10 ? 'T00:00:00' : ''));
  const to = new Date(toStr + (toStr.length === 10 ? 'T00:00:00' : ''));
  const diffTime = to.getTime() - from.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isSameDay = (dateStrA, dateStrB) => {
  if (!dateStrA || !dateStrB) return false;
  return dateStrA.slice(0, 10) === dateStrB.slice(0, 10);
};

