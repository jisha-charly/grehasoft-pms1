// ===============================
// DATE FORMAT HELPERS
// ===============================

export const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRelativeTime = (dateString?: string) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();

  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hrs ago`;
  return `${days} days ago`;
};
