export const getDate = (n = 0) => {
  var rawDate = ((d) => new Date(d.setDate(d.getDate() - n)))(new Date());
  const date = `${rawDate.getDate()}.${
    rawDate.getMonth() + 1
  }.${rawDate.getFullYear()}`;
  return date;
};

export const getWeek = (n = 0) => {
  var weekday = [6, 5, 4, 3, 2, 1, 0];
  var ans = weekday.map((day) => {
    return getDate(n * 7 + day);
  });
  return ans;
};

export const getDailyStreak = (dailyStats) => {
  var max = Object.keys(dailyStats).length;
  var i = 0;
  for (i = 0; i < max; i++) {
    if (
      dailyStats[getDate(i + 1)] === undefined ||
      dailyStats[getDate(i + 1)] <= 60000
    ) {
      break;
    }
  }
  return i;
};

export const getDailyTargetStreak = (dailyStats, target) => {
  var max = Object.keys(dailyStats).length;
  var i = 0;
  for (i = 0; i < max; i++) {
    if (
      dailyStats[getDate(i + 1)] === undefined ||
      dailyStats[getDate(i + 1)] / 60000 <= target
    ) {
      break;
    }
  }
  return i;
};
export const getCurrentMonth = () => {
  let date = new Date();
  const formatted = `${date.getMonth() + 1}.${date.getFullYear()}`;
  return formatted;
};

export const getMonths = (n = 6) => {
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  var ans = [];
  for (var i = 0; i < n; i++) {
    ans.push(`${month}.${year}`);
    month = month - 1;
    if (month == 0) {
      month = 12;
      year = year - 1;
    }
  }
  return ans.reverse();
};
