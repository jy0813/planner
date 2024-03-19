const getHours = (start = 0, end = 24, interval = 15) => {
  const hours = [];

  for (let i = start; i <= end; i++) {
    for (let j = 0; j < 60; j += interval) {
      if (i === end && j !== 0) {
        continue;
      }

      const minutes = j.toString().padStart(2, "0");
      if (i === 0) {
        hours.push(`오전 12:${minutes}`);
      } else if (i > 12) {
        hours.push(`오후 ${i - 12}:${minutes}`);
      } else {
        hours.push(`오전 ${i}:${minutes}`);
      }
    }
  }

  return hours;
};

export default getHours;
