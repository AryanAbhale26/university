// Formatting helper functions
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatRollNumber = (rollNo) => {
  return rollNo ? rollNo.trim().toUpperCase() : '';
};

export const formatPercentage = (val) => {
  if (val === null || val === undefined) return '0%';
  return `${parseFloat(val).toFixed(1)}%`;
};
