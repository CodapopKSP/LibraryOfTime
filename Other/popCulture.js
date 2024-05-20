//|---------------------|
//|     Pop Culture     |
//|---------------------|

// A set of functions for calculating dates in the Pop Culture category.

function getMinecraftTime(currentDateTime) {
  // Convert date to milliseconds since midnight
  const millisecondsSinceMidnight = currentDateTime -
    new Date(
      currentDateTime.getFullYear(),
      currentDateTime.getMonth(),
      currentDateTime.getDate(),
    );

  // Convert milliseconds to Minecraft time
  const minecraftTime = Math.floor(millisecondsSinceMidnight / 50); // 1 Minecraft hour = 50 milliseconds
  const hoursSinceMidnight = Math.floor(minecraftTime / 1000);
  let day = Math.trunc(hoursSinceMidnight / 24);
  let hours = hoursSinceMidnight % day;
  const minutes = Math.floor((minecraftTime % 1000) * 0.06);
  const seconds = Math.floor(((minecraftTime % 1000) * 0.06 - minutes) * 60);

  return "Day: " + day + " | " + pad(hours, 2) + ":" + pad(minutes, 2) + ":" +
    pad(seconds, 2);
}

function getInceptionDreamTime(currentDateTime) {
  // Convert date to milliseconds since midnight
  const millisecondsSinceMidnight = currentDateTime -
    new Date(
      currentDateTime.getFullYear(),
      currentDateTime.getMonth(),
      currentDateTime.getDate(),
    );

  // Convert milliseconds to Inception dream time
  const dreamTime = millisecondsSinceMidnight / (1000 * 60 * 60 * 24) * 20; // 1:20 conversion for the whole day
  const hours = Math.floor(dreamTime * 24);
  const minutes = Math.floor((dreamTime * 24 % 1) * 60);
  const seconds = Math.floor(((dreamTime * 24 % 1) * 60 % 1) * 60);

  return pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2);
}

function pad(num, size) {
  return ("000" + num).slice(-size);
}
