export const calculateRepetition = (repetition) => Number(repetition);

export const calculateDelay = (delay) => delay * 1000;

export const calculateDistance = (distance) => {
  const trackLength = 200;
  return Number(distance / trackLength);
};

export const calculateDuration = (minutes, seconds) => {
  return (Number(minutes) * 60 + Number(seconds)) * 1000;
};
