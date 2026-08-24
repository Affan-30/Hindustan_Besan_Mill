export const formatCurrency = (value) =>
  "₹" + Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

export const formatKg = (value) => `${Number(value || 0).toLocaleString("en-IN")} kg`;

export const formatDateDisplay = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
};

export const formatDateShort = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Kolkata" });
};

// Returns YYYY-MM-DD for the current IST calendar date, for use in <input type="date"> and API calls.
export const todayISODate = () => {
  const now = new Date();
  const ist = new Date(now.getTime() + (5.5 * 60 + now.getTimezoneOffset()) * 60000);
  return ist.toISOString().slice(0, 10);
};

export const toISODate = (date) => new Date(date).toISOString().slice(0, 10);
