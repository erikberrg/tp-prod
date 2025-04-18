import React, { createContext, useContext, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { theme } from '../constants/theme';

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [animationColor, setAnimationColor] = useState(theme.colors.blue);
  const animationProgress = useRef(new Animated.Value(0));
  const animationLoop = useRef(null);

  const startAnimation = (duration, lapCountNumber, repetitions, delay) => {
    const timePerLap = duration / lapCountNumber;
    animationProgress.current.setValue(0);

    const lapAnimation = Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: timePerLap,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    animationLoop.current = Animated.loop(
      Animated.sequence([
        Animated.loop(lapAnimation, { iterations: lapCountNumber }),
        Animated.delay(delay),
      ]),
      { iterations: repetitions }
    );

    animationLoop.current.start();
  };

    // Function to stop
    const resetAnimation = () => {
      animationProgress.current.setValue(0);
      if (animationLoop.current) {
        animationLoop.current.stop();
      }
    };

  return (
<AnimationContext.Provider
  value={{
    startAnimation,
    resetAnimation,
    animationProgress,
    animationColor,
    setAnimationColor,
  }}
>
  {children}
</AnimationContext.Provider>
  );
};

export const useAnimationContext = () => useContext(AnimationContext);
