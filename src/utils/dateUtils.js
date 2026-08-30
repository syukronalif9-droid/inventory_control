export function parseDDMMYYYY(dateString) {
  if (!dateString || dateString === '-') return null;
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1; // month is 0-indexed in JS
    const y = parseInt(parts[2], 10);
    const date = new Date(y, m, d);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  return null;
}

export function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

export function calculateWorkDays(startDateStr, endDateStr, holidayList = []) {
  const start = parseDDMMYYYY(startDateStr);
  if (!start) return null; // Cannot calculate if start date is invalid

  let end = parseDDMMYYYY(endDateStr);
  if (!end) {
    end = new Date(); // If GR Date is empty, use today
    end.setHours(0, 0, 0, 0);
  }

  if (start > end) return 0;

  const holidays = (Array.isArray(holidayList) ? holidayList : [])
    .map((item) => {
      const dateValue = typeof item === 'string' ? item : item?.date;
      const d = parseDDMMYYYY(dateValue);
      if (d) d.setHours(0, 0, 0, 0);
      return d;
    })
    .filter(Boolean);

  let workDays = 0;
  let currentDate = new Date(start);

  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay(); // 0 is Sunday, 1-6 are Mon-Sat

    if (dayOfWeek === 0) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    const isHoliday = holidays.some((holiday) => isSameDay(holiday, currentDate));
    if (!isHoliday) {
      workDays++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return Math.max(0, workDays - 1);
}
