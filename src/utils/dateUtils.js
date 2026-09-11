/**
 * Parses virtually any date representation (Excel serial, ISO string, DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, DD.MM.YYYY, 8-digit numbers, text months, etc.)
 * Returns a valid JavaScript Date object (at local time) or null if invalid/empty.
 */
export function parseAnyDate(val) {
  if (val === null || val === undefined) return null;
  if (val instanceof Date) {
    if (!isNaN(val.getTime())) return val;
    return null;
  }
  let str = String(val).trim();
  if (!str || str === 'null' || str === 'undefined' || str === '-' || str === '0') return null;

  // If ISO datetime or string with time, drop time component
  if (str.includes('T')) {
    str = str.split('T')[0];
  }

  // 1. Handle Excel Serial Numbers (e.g. 45678, "45678", 45678.5)
  // Typically positive numbers between 1000 and 100000
  const num = Number(str);
  if (!isNaN(num) && num > 1000 && num < 100000 && !str.includes('/') && !str.includes('-') && !str.includes('.')) {
    const dateObj = new Date(Math.round((num - 25569) * 86400 * 1000));
    dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
    if (!isNaN(dateObj.getTime())) return dateObj;
  }

  // 2. Handle 8-digit strings like "20260510" or "10052026"
  if (/^\d{8}$/.test(str)) {
    if (str.startsWith('20') || str.startsWith('19')) {
      // YYYYMMDD
      const y = parseInt(str.substring(0, 4), 10);
      const m = parseInt(str.substring(4, 6), 10) - 1;
      const d = parseInt(str.substring(6, 8), 10);
      const dt = new Date(y, m, d);
      if (!isNaN(dt.getTime())) return dt;
    } else {
      // DDMMYYYY
      const d = parseInt(str.substring(0, 2), 10);
      const m = parseInt(str.substring(2, 4), 10) - 1;
      const y = parseInt(str.substring(4, 8), 10);
      const dt = new Date(y, m, d);
      if (!isNaN(dt.getTime())) return dt;
    }
  }

  // 3. Handle Indonesian and English textual months e.g. "10 Mei 2026", "10-Jan-2026", "May 10, 2026"
  const monthMap = {
    jan: 0, januari: 0, january: 0,
    feb: 1, februari: 1, february: 1,
    mar: 2, maret: 2, march: 2,
    apr: 3, april: 3,
    mei: 4, may: 4,
    jun: 5, juni: 5, june: 5,
    jul: 6, juli: 6, july: 6,
    agu: 7, agustus: 7, aug: 7, august: 7,
    sep: 8, september: 8,
    okt: 9, oktober: 9, oct: 9, october: 9,
    nov: 10, november: 10,
    des: 11, desember: 11, dec: 11, december: 11
  };

  const textParts = str.replace(/,/g, ' ').trim().split(/[\s/.-]+/);
  if (textParts.length === 3) {
    let day = null, month = null, year = null;
    textParts.forEach((part) => {
      const lower = part.toLowerCase();
      if (monthMap[lower] !== undefined) {
        month = monthMap[lower];
      } else if (!isNaN(part)) {
        const valNum = parseInt(part, 10);
        if (part.length === 4 || valNum > 1000) {
          year = valNum;
        } else if (valNum <= 31 && day === null) {
          day = valNum;
        } else if (valNum <= 12 && month === null) {
          month = valNum - 1;
        }
      }
    });

    if (day !== null && month !== null && year !== null) {
      if (year < 100) year += 2000;
      const dt = new Date(year, month, day);
      if (!isNaN(dt.getTime())) return dt;
    }
  }

  // 4. Split by standard separators [/.-] or spaces (remove time first)
  const dateStrOnly = str.split(' ')[0];
  const parts = dateStrOnly.split(/[/.-]/);

  if (parts.length === 3) {
    let p0 = parseInt(parts[0], 10);
    let p1 = parseInt(parts[1], 10);
    let p2 = parseInt(parts[2], 10);

    if (!isNaN(p0) && !isNaN(p1) && !isNaN(p2)) {
      let day, month, year;

      if (parts[0].length === 4 || p0 > 1000) {
        // YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD
        year = p0;
        month = p1 - 1;
        day = p2;
      } else if (parts[2].length === 4 || p2 > 1000) {
        // DD/MM/YYYY or MM/DD/YYYY
        year = p2;
        if (p0 > 12) {
          // Definitely DD/MM/YYYY
          day = p0;
          month = p1 - 1;
        } else if (p1 > 12) {
          // Definitely MM/DD/YYYY
          day = p1;
          month = p0 - 1;
        } else {
          // Ambiguous (both <= 12). Default to Indonesian/European standard: DD/MM/YYYY
          day = p0;
          month = p1 - 1;
        }
      } else {
        // 2-digit year (e.g. 10/05/26)
        year = p2 < 100 ? 2000 + p2 : p2;
        if (p0 > 12) {
          day = p0;
          month = p1 - 1;
        } else {
          day = p0;
          month = p1 - 1;
        }
      }

      const dt = new Date(year, month, day);
      if (!isNaN(dt.getTime())) return dt;
    }
  }

  // 5. Native JS Date parse fallback
  const fallback = new Date(str);
  if (!isNaN(fallback.getTime())) {
    return fallback;
  }

  return null;
}

export function formatToDDMMYYYY(val) {
  if (!val || val === 'null' || val === '-' || val === 'undefined') return '-';
  const dt = parseAnyDate(val);
  if (!dt) return String(val);

  const d = String(dt.getDate()).padStart(2, '0');
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const y = dt.getFullYear();
  return `${d}/${m}/${y}`;
}

export function parseDDMMYYYY(dateString) {
  if (!dateString || dateString === '-') return null;
  const dt = parseAnyDate(dateString);
  if (dt) {
    dt.setHours(0, 0, 0, 0);
    return dt;
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

  // Same day = 1 day performance
  if (isSameDay(start, end)) return 1;

  let workDays = 0;
  // Start counting from the day AFTER the start date
  let currentDate = new Date(start);
  currentDate.setDate(currentDate.getDate() + 1);

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

  return Math.max(1, workDays);
}

