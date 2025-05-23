function getTodayISODate() {
  return new Date().toISOString().split('T')[0];
}

function waitUntilHourUTC(hour, callback) {
  const now = new Date();
  const target = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour, 0, 0));
  
  // If we've already passed the target hour today, schedule for tomorrow
  if (now > target) {
    target.setUTCDate(target.getUTCDate() + 1);
  }
  
  const timeout = target - now;
  
  console.log(`Next user count snapshot scheduled for: ${target.toISOString()}`);
  console.log(`Time until next snapshot: ${Math.round(timeout / 1000 / 60)} minutes`);
  
  setTimeout(() => {
    console.log('Executing daily user count snapshot...');
    callback();
    
    // Schedule the callback to run every 24 hours after the first execution
    setInterval(() => {
      console.log('Executing scheduled daily user count snapshot...');
      callback();
    }, 24 * 60 * 60 * 1000);
  }, timeout);
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function log(message, config) {
  if (config.logging) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }
}

function getDateFromUTCHour(hour) {
  const now = new Date();
  const targetDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour, 0, 0));
  
  // If we've passed the cutoff hour today, we're counting for yesterday
  if (now.getUTCHours() >= hour) {
    return formatDate(now);
  } else {
    // Before cutoff hour, we're still counting for yesterday
    const yesterday = new Date(now);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    return formatDate(yesterday);
  }
}

module.exports = {
  getTodayISODate,
  waitUntilHourUTC,
  formatDate,
  log,
  getDateFromUTCHour,
}; 