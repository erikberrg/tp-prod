export const calculateRepetition = (repetition) => Number(repetition);

export const calculateDelay = (delay) => delay * 1000;

export const calculateDistance = (distance) => {
  const trackLength = 200;
  return Number(distance / trackLength);
};

export const calculateDuration = (minutes, seconds, hundredths) => {
  return ((Number(minutes) * 60) + Number(seconds) + (Number(hundredths) / 100));
};

export const formatRaceTime = (minutes, seconds, hundredths) => {
  const paddedSeconds = seconds.toString().padStart(2, "0");
  const paddedHundredths = hundredths.toString().padStart(2, "0");
  
  let formattedTime = `${minutes}:${paddedSeconds}.${paddedHundredths}`;
  
  if (minutes > 0) {
    formattedTime += " min";
  } else if (seconds > 0) {
    formattedTime += " sec";
  } else {
    formattedTime += " sec";
  }

  return formattedTime;
};