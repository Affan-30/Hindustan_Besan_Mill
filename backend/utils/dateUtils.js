// All business dates are treated as Asia/Kolkata calendar dates.
// We store dates as UTC midnight of the IST calendar day, and always
// derive "today" using the IST offset so a save at 11:30 PM IST lands
// on the correct business day regardless of server timezone.

const IST_OFFSET_MINUTES = 5 * 60 + 30;

export const istNow = () => {
  const now = new Date();
  const istMs = now.getTime() + IST_OFFSET_MINUTES * 60000;
  return new Date(istMs);
};

// Normalizes any date/string input to UTC midnight representing that IST calendar day.
export const toBusinessDate = (input) => {
  const d = input ? new Date(input) : istNow();
  const ist = new Date(d.getTime() + IST_OFFSET_MINUTES * 60000);
  const y = ist.getUTCFullYear();
  const m = ist.getUTCMonth();
  const day = ist.getUTCDate();
  return new Date(Date.UTC(y, m, day, 0, 0, 0, 0));
};

export const todayBusinessDate = () => toBusinessDate(new Date());

export const startOfMonthBusinessDate = (year, month) =>
  new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));

export const endOfMonthBusinessDate = (year, month) =>
  new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
