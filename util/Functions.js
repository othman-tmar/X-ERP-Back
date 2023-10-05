
const moment = require('moment');

// calcule difference between tow dates function
const getDifference = (date1, date2) => {
  const momentDate1 = moment(date1, 'DD/MM/YY HH:mm');
  const momentDate2 = moment(date2, 'DD/MM/YY HH:mm');

  // Calculate the difference in milliseconds
  const diff = momentDate2.diff(momentDate1);

  // Convert the difference to a human-readable format
  const duration = moment.duration(diff);

  // Create an array to hold the time units
  let timeUnits = [];

  // Add each time unit to the array if its value is different from 0
  if (duration.years() !== 0) {
    timeUnits.push(`${duration.years()} years`);
  }
  if (duration.months() !== 0) {
    timeUnits.push(`${duration.months()} months`);
  }
  if (duration.days() !== 0) {
    timeUnits.push(`${duration.days()} days`);
  }
  if (duration.hours() !== 0) {
    timeUnits.push(`${duration.hours()} hours`);
  }
  if (duration.minutes() !== 0) {
    timeUnits.push(`${duration.minutes()} minutes`);
  }

  return `${timeUnits.join(', ')}`;
}

// convert date 
 const parseDate = (dateString) => {
  let [datePart, timePart] = dateString?.split(' ');
  let [day, month, year] = datePart.split('/');
  let [hours, minutes] = timePart.split(':');

  // JavaScript's Date constructor expects the year, month, and day as full numbers.
  // Also, the month is 0-indexed (January is 0, December is 11), so we subtract 1 from the month.
  return new Date(`20${year}`, month - 1, day, hours, minutes);
}

// convert breakTime to hours 
function parseBreakTimeString(breakTime) {
  let totalHours = 0;

  // Split the breakTime string into parts using commas followed by a space
  const parts = breakTime?.split(/,\s+/);

  for (let i = 0; i < parts?.length; i++) {
    // Split each part into value and unit using a space
    const [valueStr, unit] = parts[i].split(/\s+/);
    const value = parseInt(valueStr);

    if (!isNaN(value)) {
      if (unit === 'months' || unit === 'month') {
        // Convert months to hours (1 month = 30*24 hours)
        totalHours += value * 30 * 24;
      } else if (unit === 'days' || unit === 'day') {
        // Convert days to hours (1 day = 24 hours)
        totalHours += value * 24;
      } else if (unit === 'hours' || unit === 'hour') {
        // Add hours directly
        totalHours += value;
      } else if (unit === 'minutes' || unit === 'minute') {
        // Convert minutes to hours (1 minute = 1/60 hours)
        totalHours += value / 60;
      }
    }
  }
  
  return totalHours;
}


module.exports = { getDifference ,parseDate,parseBreakTimeString };